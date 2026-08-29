// ============================================================
// SẮC DIỆN — narrative generator
//
// LƯU Ý QUAN TRỌNG: "primary color" ở đây (tính từ 12 slice thật, theo
// tỷ lệ diện tích) là KHÁI NIỆM KHÁC với pricing.dominantColor (tính
// theo COLOR_HUE_SCORE — màu giá trị cao nhất, dùng cho hashtag/định
// giá). Cố tình KHÔNG gộp 2 khái niệm này làm một:
//   - colorNarrative trả lời "mắt nhìn thấy màu gì nhiều nhất"
//   - pricing.dominantColor trả lời "màu nào đáng giá nhất để định giá/hashtag"
// Nếu m muốn 2 khái niệm phải khớp nhau tuyệt đối, cần quay lại quyết
// định ở tin nhắn trước (item B) — hiện tại để riêng, an toàn hơn.
// ============================================================
import {
  COLOR_DICTIONARY,
  COLOR_STORY,
  SATURATION_TEMPLATES,
  DISTRIBUTION_TEMPLATES,
} from "@/content/jadeContent";
import type { ColorName } from "@/content/jadeContent";

import {
  classifySlices,
  extractColorSlices,
  primaryColorEngine,
  colorRelationshipEngine,
  distributionEngine,
  transitionEngine,
} from "./algorithms";
import type { ColorRelationship } from "./algorithms";

function colorLabel(c: ColorName): string {
  return c;
}
function colorDescriptor(c: ColorName): string {
  return COLOR_DICTIONARY[c].defaultNarrative;
}

/**
 * Mapping từ ColorRelationship (v1.1) → 1 trong 6 template 2-màu/3+màu
 * (doc gốc "RESULT NARRATIVE SYSTEM" mục 12). 2 bản spec KHÔNG khớp
 * 1-1 hoàn toàn (v1.1 chia theo balanced×soft/contrast + primary×soft/
 * contrast = 4 tổ hợp; doc gốc chia theo 4 template riêng: primary+
 * secondary / gần nhau / tương phản / ~50-50 — không cùng 1 trục).
 * Bảng dưới là QUYẾT ĐỊNH TẠM của t để code chạy được, CẦN M REVIEW:
 *   balanced_soft            → template "~50/50"
 *   balanced_contrast        → template "~50/50"  (không có bản riêng cho balanced+contrast)
 *   primary_secondary_soft   → template "gần nhau"
 *   primary_secondary_contrast → template "tương phản"
 */
function twoColorNarrative(
  relationship: ColorRelationship,
  primary: ColorName,
  secondary: ColorName,
): string {
  const A = colorLabel(primary);
  const B = colorLabel(secondary);
  const dA = colorDescriptor(primary);
  const dB = colorDescriptor(secondary);

  switch (relationship) {
    case "balanced_soft":
    case "balanced_contrast":
      return `Hai sắc ${A} và ${B} cùng hiện diện với tỷ lệ tương đối cân bằng, tạo nên một diện màu song hành thay vì một sắc chủ đạo đơn nhất. Sự chuyển đổi giữa hai gam màu khiến tổng thể trở nên đặc biệt và khó trùng lặp.`;
    case "primary_secondary_soft":
      return `${A} và ${B} chuyển tiếp nhẹ nhàng trên cùng diện ngọc. Sự tương đồng về sắc độ tạo nên một tổng thể mềm mại, liền mạch và giàu sức sống.`;
    case "primary_secondary_contrast":
      return `${A} đối lập cùng ${B}, tạo nên một bố cục giàu tương phản. Chính sự khác biệt giữa hai sắc màu làm nổi bật từng vùng diện ngọc và tạo nên dấu ấn thị giác riêng.`;
    default:
      return `${A} giữ vai trò sắc chủ đạo, điểm xuyết bởi ${B}. Sự kết hợp giữa ${dA} và ${dB} tạo nên một diện ngọc có chiều sâu, trong đó mỗi vùng màu góp phần làm nổi bật vùng còn lại.`;
  }
}

function multiColorNarrative(
  relationship: ColorRelationship,
  primary: ColorName,
  others: ColorName[],
): string {
  if (relationship === "multicolor_primary") {
    return `Diện ngọc mang bố cục đa sắc với ${colorLabel(primary)} làm nền chủ đạo, kết hợp cùng ${others
      .map(colorLabel)
      .join(", ")}. Các vùng màu chuyển tiếp tạo nên nhiều lớp sắc độ, khiến diện ngọc thay đổi theo góc nhìn và mang dấu ấn riêng của chính khối đá.`;
  }
  return `Một bố cục đa sắc với ${[primary, ...others]
    .map(colorLabel)
    .join(", ")} cùng hiện diện mà không một gam màu nào hoàn toàn lấn át phần còn lại. Sự đan xen tự nhiên tạo nên diện ngọc giàu biến hóa — càng quan sát kỹ càng có thêm những chuyển sắc để khám phá.`;
}

export interface ColorNarrativeResult {
  text: string;
  story: string | null; // đoạn dài mới (COLOR_STORY) — hiển thị RIÊNG, không ghép vào text
  primary: ColorName | null;
  relationship: ColorRelationship | null;
  transition: ReturnType<typeof transitionEngine> | null;
}

export function generateColorNarrative(ringColors: string[]): ColorNarrativeResult {
  // 2 biểu diễn song song, đúng kiến trúc freeze:
  // - colorSlices (đã lọc slice trắng) → primaryColorEngine / proportion
  // - slices (giữ nguyên vị trí, có null) → distribution/transition cần
  //   biết đúng vị trí 12 múi để đếm contiguous region chính xác
  const colorSlices = extractColorSlices(ringColors);
  const slices = classifySlices(ringColors);
  const result = primaryColorEngine(colorSlices);

  if (!result) {
    // Không có màu nào hợp lệ trong 12 slice — không throw, vì đây là
    // trạng thái hợp lệ (user chưa tô màu), không phải lỗi mapping.
    return { text: "", story: null, primary: null, relationship: null, transition: null };
  }

  const relationship = colorRelationshipEngine(result);
  const saturationSentence = SATURATION_TEMPLATES[COLOR_DICTIONARY[result.primary].tone];
  const distributionSentence = DISTRIBUTION_TEMPLATES[
    (() => {
      const d = distributionEngine(slices);
      // map DistributionPattern label → key thật trong DISTRIBUTION_TEMPLATES
      const KEY_MAP: Record<string, keyof typeof DISTRIBUTION_TEMPLATES> = {
        "Đều": "đều",
        "Thành mảng": "thành mảng",
        "Loang nhẹ": "loang nhẹ",
        "Thành vệt": "thành vệt",
        "Điểm xuyết": "điểm xuyết",
        "Chuyển màu": "chuyển màu",
      };
      return KEY_MAP[d];
    })()
  ];

  let text: string;
  if (relationship === "single") {
    text = `Sở hữu sắc ${colorLabel(result.primary)}, ${colorDescriptor(result.primary)}. ${saturationSentence} ${distributionSentence}`;
  } else if (relationship.startsWith("multicolor")) {
    const others = [...new Set(slices.filter((c): c is ColorName => c !== null && c !== result.primary))];
    text = multiColorNarrative(relationship, result.primary, others);
  } else if (result.secondary) {
    text = twoColorNarrative(relationship, result.primary, result.secondary);
  } else {
    text = `Sở hữu sắc ${colorLabel(result.primary)}, ${colorDescriptor(result.primary)}. ${saturationSentence} ${distributionSentence}`;
  }

  // transitionEngine() dùng nội bộ cho Phẩm Giá / badge sau này. KHÔNG có
  // câu văn tương ứng trong spec gốc (doc chỉ định nghĩa 4 nhãn, không có
  // template câu như saturation/distribution) — nên chỉ trả nhãn ra, chưa
  // nối vào `text` để tránh bịa câu. Badge "Hòa quyện/Tương phản mạnh" ở
  // Results.tsx dùng field `transition` này trực tiếp.
  const transition = transitionEngine(slices);

  return { text, story: COLOR_STORY[result.primary] ?? null, primary: result.primary, relationship, transition };
}
