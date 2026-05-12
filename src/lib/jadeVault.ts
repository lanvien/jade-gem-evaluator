// ============================================================
// JADE VAULT — Local-only persistence (localStorage "jadeVault")
// Coexists with Supabase Cốp Ngọc (lib/copNgoc.ts) — independent.
// ============================================================

const STORAGE_KEY = "jadeVault";

// Quick hex → name lookup (kept in sync with ColorRing.JADE_COLORS)
const HEX_TO_NAME: Record<string, string> = {
  "#1B5E20": "Đế Vương Lục", "#2E7D32": "Chính Dương Lục", "#1A3A0A": "Xanh Cay",
  "#A5D6A7": "Xanh Ngọt", "#66BB6A": "Lục Táo", "#2E5A1C": "Xanh Rau Bina",
  "#558B2F": "Đậu Lục", "#26A69A": "Thanh Thủy Lục", "#33691E": "Du Thanh",
  "#78909C": "Hồi Lục", "#1B2B1B": "Mặc Thúy",
  "#CE93D8": "Tử La Lan", "#7B1FA2": "Tím Cà", "#5C6BC0": "Tím Lam",
  "#E53935": "Hồng Phỉ", "#FB8C00": "Hoàng Tông Phỉ", "#F48FB1": "Phấn Hồng",
  "#0277BD": "Lam Thiên Không", "#4FC3F7": "Lam Thanh", "#1A3A5C": "Lão Lam Thủy",
  "#F5F5F5": "Bạch Nguyệt Quang", "#9E9E9E": "Xương Gà Đen", "#212121": "Mặc Thúy (Hắc)",
  "#e5e7eb": "Trống",
};

const TONE_OPACITY: Record<string, number> = { light: 0.4, medium: 0.75, dark: 1 };

export interface VaultSegment {
  hex: string;
  opacity: number;
  colorName: string;
}

export interface JadeItem {
  id: string;
  createdAt: string;
  name: string;
  notes: string;
  segments: VaultSegment[];
  hasPhieuHoa: boolean;
  isMuna: boolean;
  userImage?: string; // base64 data URL — user's own bracelet photo (replaces SVG)
  assessment: {
    chungPeak: string;
    chungBase: string;
    baseColor: string;
    toneLevel: number;
    flaws: string[];
    shape: string;
    estimatedPrice?: string;
    [key: string]: any;
  };
}

// ─── ID ───
export function nanoId(len = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  const arr = new Uint8Array(len);
  (globalThis.crypto || (window as any).crypto).getRandomValues(arr);
  for (let i = 0; i < len; i++) s += chars[arr[i] % chars.length];
  return s;
}

// ─── Read / Write ───
export function loadVault(): JadeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveVault(items: JadeItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("jadeVault:change"));
}

export function addToVault(item: JadeItem) {
  const items = loadVault();
  items.unshift(item);
  saveVault(items);
}

export function updateVaultItem(id: string, patch: Partial<JadeItem>) {
  const items = loadVault().map((it) => (it.id === id ? { ...it, ...patch } : it));
  saveVault(items);
}

export function removeFromVault(id: string) {
  saveVault(loadVault().filter((it) => it.id !== id));
}

// ─── Build VaultSegment[] from Assessment ringColors+tones ───
export function buildSegments(
  ringColors: string[],
  colorTones: Record<string, string>,
): VaultSegment[] {
  const safe = ringColors.length === 12 ? ringColors : Array(12).fill("#e5e7eb");
  return safe.map((hex, i) => {
    const tone = colorTones[String(i)] || "medium";
    const isEmpty = hex.toLowerCase() === "#e5e7eb";
    return {
      hex,
      opacity: isEmpty ? 1 : TONE_OPACITY[tone] ?? 0.75,
      colorName: HEX_TO_NAME[hex] || HEX_TO_NAME[hex.toUpperCase()] || "—",
    };
  });
}

// ─── Format helpers ───
export function formatVaultDate(iso: string): string {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

// ─── Reactive count hook (used by header badge) ───
import { useEffect, useState } from "react";
export function useVaultCount(): number {
  const [n, setN] = useState(() => loadVault().length);
  useEffect(() => {
    const update = () => setN(loadVault().length);
    window.addEventListener("jadeVault:change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("jadeVault:change", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return n;
}

export function useVaultItems(): [JadeItem[], () => void] {
  const [items, setItems] = useState<JadeItem[]>(() => loadVault());
  const refresh = () => setItems(loadVault());
  useEffect(() => {
    const update = () => setItems(loadVault());
    window.addEventListener("jadeVault:change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("jadeVault:change", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return [items, refresh];
}
