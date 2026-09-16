import { supabase } from "@/integrations/supabase/client";
import { ensureAnonUser } from "./anonAuth";

const BUCKET = "jade-images";
const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];

export async function uploadJadeImage(file: File, guestName: string): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("Ảnh quá lớn (tối đa 10MB).");
  if (file.type && !ALLOWED.includes(file.type.toLowerCase()))
    throw new Error("Chỉ nhận ảnh JPG, PNG, WEBP hoặc HEIC.");

  const uid = await ensureAnonUser();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeName = guestName.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 20) || "guest";
  const path = `submissions/${uid}/${safeName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext || "jpg"}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  return path;
}

// Returns a signed URL valid for ~7 days.
export async function getSignedUrl(path: string): Promise<string> {
  // If already a full URL, return as-is (legacy).
  if (/^https?:\/\//.test(path)) return path;
  await ensureAnonUser();
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  if (error || !data?.signedUrl) return "";
  return data.signedUrl;
}

export async function getSignedUrls(paths: string[]): Promise<string[]> {
  return Promise.all(paths.map(getSignedUrl));
}
