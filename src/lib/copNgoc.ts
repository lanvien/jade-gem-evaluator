// ============================================================
// CỐP NGỌC — Lưu trữ & quản lý vòng ngọc đã định giá
// ============================================================

import type { PricingResult } from "./pricingEngine";

export interface CopNgocEntry {
  id: string;             // Mã Cốp (ví dụ "CN-XXXXX")
  name: string;           // Tên ái phi do user đặt
  createdAt: number;
  result: PricingResult;
  ringColors?: string[];
  thumbnail?: string;     // dataURL ảnh nếu có
  notes?: string;
}

const STORAGE_KEY = "cop-ngoc-v1";

function safeParse(json: string | null): CopNgocEntry[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function generateCopId(): string {
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CN-${rnd}`;
}

export function listCopNgoc(): CopNgocEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => b.createdAt - a.createdAt
  );
}

export function saveCopNgoc(entry: Omit<CopNgocEntry, "id" | "createdAt"> & { id?: string }): CopNgocEntry {
  const all = listCopNgoc();
  const final: CopNgocEntry = {
    id: entry.id || generateCopId(),
    name: entry.name,
    createdAt: Date.now(),
    result: entry.result,
    ringColors: entry.ringColors,
    thumbnail: entry.thumbnail,
    notes: entry.notes,
  };
  const next = [final, ...all.filter(e => e.id !== final.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return final;
}

export function deleteCopNgoc(id: string): void {
  const next = listCopNgoc().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function searchCopNgoc(query: string): CopNgocEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return listCopNgoc();
  return listCopNgoc().filter(e =>
    e.id.toLowerCase().includes(q) ||
    e.name.toLowerCase().includes(q)
  );
}

export function getCopNgoc(id: string): CopNgocEntry | undefined {
  return listCopNgoc().find(e => e.id === id);
}
