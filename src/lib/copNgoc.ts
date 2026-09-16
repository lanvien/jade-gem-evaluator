// ============================================================
// CỐP NGỌC — Lưu trữ không cần đăng nhập
// Dùng UUID ẩn (session) + Mã NGOC-XXXX để restore trên máy khác
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ensureAnonUser } from "./anonAuth";
import type { PricingResult, JadeInput } from "./pricingEngine";
import { formatVND } from "./pricingEngine";

const SESSION_KEY = "cop_ngoc_session_id";
const QUERY_KEY = ["cop_ngoc"] as const;


// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export interface CopItem {
  id: string;
  savedAt: string;
  nickname: string;
  input: JadeInput;
  result: PricingResult;
}

export interface CopData {
  sessionId: string;
  copCode: string;     // "NGOC-8888"
  items: CopItem[];
  createdAt: string;
  updatedAt: string;
}

// Shape lưu trên DB (snake_case)
interface CopRow {
  session_id: string;
  cop_code: string;
  items: CopItem[];
  created_at: string;
  updated_at: string;
}

function rowToData(row: CopRow): CopData {
  return {
    sessionId: row.session_id,
    copCode: row.cop_code,
    items: row.items ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─────────────────────────────────────────────
// SESSION — danh tính ẩn danh do Supabase Auth cấp (auth.uid())
// ─────────────────────────────────────────────
let legacyClaimed = false;

/** Nhận lại cốp cũ của chính trình duyệt này (mô hình session_id trước đây). */
async function claimLegacy(uid: string): Promise<void> {
  if (legacyClaimed) return;
  legacyClaimed = true;
  const legacy = localStorage.getItem(SESSION_KEY);
  if (!legacy || legacy === uid) {
    localStorage.setItem(SESSION_KEY, uid);
    return;
  }
  try {
    await (supabase as any).rpc("claim_cop_by_session", { p_session: legacy });
  } catch {
    /* không chặn luồng dùng app */
  }
  localStorage.setItem(SESSION_KEY, uid);
}

async function getSessionId(): Promise<string> {
  const uid = await ensureAnonUser();
  await claimLegacy(uid);
  return uid;
}

export function resetLocalSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

function generateCopCode(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `NGOC-${num}`;
}

// ─────────────────────────────────────────────
// DB CALLS (via supabase-js client) — RLS lọc theo auth.uid()
// ─────────────────────────────────────────────
async function fetchCop(_uid: string): Promise<CopData | null> {
  const { data, error } = await supabase
    .from("cop_ngoc")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  const row = data?.[0];
  return row ? rowToData(row as unknown as CopRow) : null;
}

async function upsertCop(uid: string, items: CopItem[]): Promise<CopData> {
  const existing = await fetchCop(uid);
  const now = new Date().toISOString();

  if (existing) {
    const { data, error } = await supabase
      .from("cop_ngoc")
      .update({ items: items as any, updated_at: now })
      .eq("session_id", existing.sessionId)
      .select()
      .single();
    if (error) throw error;
    return rowToData(data as unknown as CopRow);
  }

  const copCode = generateCopCode();
  const { data, error } = await supabase
    .from("cop_ngoc")
    .insert({
      session_id: uid,
      user_id: uid,
      cop_code: copCode,
      items: items as any,
      created_at: now,
      updated_at: now,
    } as any)
    .select()
    .single();
  if (error) throw error;
  return rowToData(data as unknown as CopRow);
}

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
export function useCopNgoc() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const uid = await getSessionId();
      return fetchCop(uid);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useRestoreCop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (copCode: string) => {
      const uid = await getSessionId();
      const code = copCode.trim().toUpperCase();
      const { data, error } = await (supabase as any).rpc("claim_cop_by_code", { p_code: code });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) throw new Error(`Không tìm thấy mã "${code}". Kiểm tra lại nhé!`);
      return rowToData(row as CopRow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}


export function useSaveToCop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      nickname,
      input,
      result,
    }: {
      nickname: string;
      input: JadeInput;
      result: PricingResult;
    }) => {
      const sessionId = await getSessionId();
      const existing = await fetchCop(sessionId);
      const currentItems: CopItem[] = existing?.items ?? [];

      const newItem: CopItem = {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        nickname,
        input,
        result,
      };

      const updatedItems = [newItem, ...currentItems].slice(0, 20);
      return upsertCop(sessionId, updatedItems);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useRemoveFromCop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const sessionId = await getSessionId();
      const existing = await fetchCop(sessionId);
      if (!existing) return null;
      const updatedItems = existing.items.filter(i => i.id !== itemId);
      return upsertCop(sessionId, updatedItems);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

// ─────────────────────────────────────────────
// DISPLAY HELPERS
// ─────────────────────────────────────────────
export function formatCopItemSummary(item: CopItem): string {
  const { result } = item;
  return (
    `${item.nickname} — ` +
    `${result.chungLabel.split("–")[1]?.trim() ?? ""} · ` +
    `${formatVND(item.result.minPrice)}–${formatVND(item.result.maxPrice)}`
  );
}

export function formatSavedDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
