import { supabase } from "@/integrations/supabase/client";

const BUCKET = "jade-images";

export async function uploadJadeImage(file: File, guestName: string): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeName = guestName.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 20) || "guest";
  const path = `submissions/${safeName}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
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
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  if (error || !data?.signedUrl) return "";
  return data.signedUrl;
}

export async function getSignedUrls(paths: string[]): Promise<string[]> {
  return Promise.all(paths.map(getSignedUrl));
}
