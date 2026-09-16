// ============================================================
// DANH TÍNH ẨN DANH — không đăng nhập, không thu thập thông tin
// Mỗi trình duyệt được cấp một anonymous user của Supabase Auth.
// auth.uid() là danh tính duy nhất mà backend tin cậy (RLS).
// ============================================================
import { supabase } from "@/integrations/supabase/client";

let pending: Promise<string> | null = null;

async function createOrGet(): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession();
  const existing = sessionData.session?.user?.id;
  if (existing) return existing;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  const uid = data.user?.id;
  if (!uid) throw new Error("Không tạo được phiên ẩn danh.");
  return uid;
}

/** Đảm bảo luôn có một phiên ẩn danh; trả về auth.uid(). */
export function ensureAnonUser(): Promise<string> {
  if (!pending) {
    pending = createOrGet().catch((e) => {
      pending = null;
      throw e;
    });
  }
  return pending;
}
