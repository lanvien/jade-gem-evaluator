// ============================================================
// CỐP NGỌC — Lưu trữ không cần đăng nhập
// Dùng UUID ẩn (session) + Mã NGOC-XXXX để restore trên máy khác
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
// SESSION
// ─────────────────────────────────────────────
function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function resetLocalSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

function generateCopCode(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `NGOC-${num}`;
}

// ─────────────────────────────────────────────
// DB CALLS (via supabase-js client)
// ─────────────────────────────────────────────
async function fetchCop(sessionId: string): Promise<CopData | null> {
  const { data, error } = await supabase
    .from("cop_ngoc")
    .select("*")
    .eq("session_id", sessionId)
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return data ? rowToData(data as unknown as CopRow) : null;
}

async function fetchCopByCode(copCode: string): Promise<CopData | null> {
  const { data, error } = await supabase
    .from("cop_ngoc")
    .select("*")
    .eq("cop_code", copCode.toUpperCase())
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw error;
  return data ? rowToData(data as unknown as CopRow) : null;
}

async function upsertCop(sessionId: string, items: CopItem[]): Promise<CopData> {
  const existing = await fetchCop(sessionId);
  const now = new Date().toISOString();

  if (existing) {
    const { data, error } = await supabase
      .from("cop_ngoc")
      .update({ items: items as any, updated_at: now })
      .eq("session_id", sessionId)
      .select()
      .single();
    if (error) throw error;
    return rowToData(data as unknown as CopRow);
  }

  const copCode = generateCopCode();
  const { data, error } = await supabase
    .from("cop_ngoc")
    .insert({
      session_id: sessionId,
      cop_code: copCode,
      items: items as any,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToData(data as unknown as CopRow);
}

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────
export function useCopNgoc() {
  const sessionId = typeof window !== "undefined" ? getOrCreateSessionId() : "";
  return useQuery({
    queryKey: [...QUERY_KEY, sessionId],
    queryFn: () => fetchCop(sessionId),
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRestoreCop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (copCode: string) => {
      const cop = await fetchCopByCode(copCode);
      if (!cop) throw new Error(`Không tìm thấy mã "${copCode}". Kiểm tra lại nhé!`);
      const sessionId = getOrCreateSessionId();
      const { error } = await supabase
        .from("cop_ngoc")
        .update({ session_id: sessionId })
        .eq("cop_code", copCode.toUpperCase());
      if (error) throw error;
      return cop;
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
      const sessionId = getOrCreateSessionId();
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
      const sessionId = getOrCreateSessionId();
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
