import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
export type ArticleStatus = "draft" | "published";

export const ARTICLE_BUCKET = "articles";
export const COVER_MAX_BYTES = 5 * 1024 * 1024;
export const COVER_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Tiếng Việt → slug kebab-case (bỏ dấu, đ → d). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** URL công khai của ảnh bìa (bucket `articles` là public). */
export function coverPublicUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return supabase.storage.from(ARTICLE_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function validateCoverFile(file: File): string | null {
  if (!COVER_MIME_TYPES[file.type]) return "Chỉ nhận ảnh JPG, PNG hoặc WebP.";
  if (file.size > COVER_MAX_BYTES) return "Ảnh quá lớn (tối đa 5 MB).";
  return null;
}

/**
 * Tải ảnh bìa lên đường dẫn MỚI: covers/<article-id>/<uuid>.<ext>.
 * Không upsert, không ghi đè (bucket không có policy UPDATE).
 */
export async function uploadArticleCover(articleId: string, file: File): Promise<string> {
  const ext = COVER_MIME_TYPES[file.type];
  if (!ext) throw new Error("Định dạng ảnh không được hỗ trợ.");
  const path = `covers/${articleId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(ARTICLE_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

/** Xóa ảnh bìa trong kho. Trả về true nếu xóa được (không ném lỗi). */
export async function removeArticleCover(path: string | null | undefined): Promise<boolean> {
  if (!path) return true;
  try {
    const { data, error } = await supabase.storage.from(ARTICLE_BUCKET).remove([path]);
    return !error && (data?.length ?? 0) >= 1;
  } catch {
    return false;
  }
}
