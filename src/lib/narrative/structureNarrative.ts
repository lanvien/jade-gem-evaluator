// ============================================================
// CỐT NGỌC — narrative generator
// Input: chung (đã classify) + grain code thô từ survey.
// Output: đoạn văn hoàn chỉnh, {grain} đã thay bằng GRAIN_MODIFIER.
// ============================================================
import { CHUNG_BASE_COPY, GRAIN_MODIFIER } from "@/content/jadeContent";
import type { ChungName, GrainCode } from "@/content/jadeContent";

export function generateStructureNarrative(chung: ChungName, grain: GrainCode | undefined): string {
  const base = CHUNG_BASE_COPY[chung];
  if (!base) {
    throw new Error(`Missing CHUNG_BASE_COPY entry for: ${chung}`);
  }

  // grain có thể undefined nếu data khảo sát thiếu — dùng mô tả trung tính
  // thay vì throw, vì đây là lỗi dữ liệu upstream, không phải lỗi content.
  const modifier = grain ? GRAIN_MODIFIER[grain] : "cấu trúc hạt đặc trưng của chủng này";
  return base.replace("{grain}", modifier);
}
