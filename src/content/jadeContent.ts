// ============================================================
// HIỂU NGỌC — CONTENT CONFIG (v2.1 — synced với tierNarrative.ts)
// Toàn bộ nội dung hiển thị tách khỏi logic component.
// Logic chỉ: đọc field code → tra bảng ở đây → render.
//
// ⚠️ File này là NGUỒN GỐC (canonical source) cho ColorName / Shape.
// Nếu pricingEngine.ts đang định nghĩa lại 2 type này, đảm bảo
// literal union khớp 100% ký tự với export bên dưới — đặc biệt
// "Lão Lam Thuỷ" dùng dấu "uỷ" (không phải "ủy").
// ============================================================

import q1_dau from "@/assets/jade/q1_dau.png";
import q1_nep from "@/assets/jade/q1_nep.png";
import q1_nbang from "@/assets/jade/q1_nbang.png";
import q2_dau from "@/assets/jade/q2_dau.png";
import q2_nep from "@/assets/jade/q2_nep.png";
import q2_bang from "@/assets/jade/q2_bang.png";
import q2_nbang from "@/assets/jade/q2_nbang.png";

/* ─────────────────────────────────────────────
   A. CÂU 1 — ĐỘ XUYÊN SÁNG (field code: translucency)
   ───────────────────────────────────────────── */
export type TranslucencyCode = "T1" | "T2" | "T3" | "T4" | "T5";

export interface OptionContent {
  code: string;
  label: string;
  short: string;      // 1 dòng rút gọn hiển thị trong list
  description: string; // mô tả đầy đủ — chỉ hiện khi hover/bấm ⓘ
  image?: string;
}

export const TRANSLUCENCY_OPTIONS: OptionContent[] = [
  {
    code: "T1",
    label: "Trong suốt (Thuỷ tinh)",
    short: "Nhìn xuyên qua rất rõ",
    description:
      "Ánh sáng truyền qua rất rõ, có thể nhìn xuyên qua lòng ngọc và nhận biết khá rõ vật thể phía sau.",
    image: q2_bang,
  },
  {
    code: "T2",
    label: "Bán trong suốt (Băng)",
    short: "Thấy hình khối phía sau, chi tiết bị mờ",
    description:
      "Ánh sáng truyền qua rõ nhưng không hoàn toàn trong; có thể thấy hình khối phía sau nhưng chi tiết bị mờ.",
    image: q2_bang,
  },
  {
    code: "T3",
    label: "Trong mờ (Nếp Băng)",
    short: "Xuyên sáng nhưng hình phía sau đã mờ",
    description:
      "Ánh sáng xuyên qua được nhưng hình ảnh phía sau đã mờ đáng kể, tạo cảm giác mềm và mờ ảo.",
    image: q2_nbang,
  },
  {
    code: "T4",
    label: "Bán trong mờ (Nếp Mịn)",
    short: "Chỉ cảm nhận ánh sáng và bóng mờ",
    description:
      "Chỉ một phần ánh sáng xuyên qua; chủ yếu cảm nhận được ánh sáng và bóng mờ thay vì hình dạng rõ ràng.",
    image: q2_nep,
  },
  {
    code: "T5",
    label: "Đục (Đậu)",
    short: "Hầu như không xuyên sáng",
    description:
      "Ánh sáng hầu như không xuyên qua lòng ngọc; không thể nhìn rõ vật thể phía sau.",
    image: q2_dau,
  },
];

export const TRANSLUCENCY_QUESTION = {
  title: "Khả năng xuyên sáng của ngọc như thế nào?",
  hint: "Soi đèn pin từ cạnh, cách 1–2cm vào vòng, không chiếu thẳng vào mắt.",
  note:
    "Mô tả chỉ giúp bạn tự đối chiếu; kết quả quan sát thực tế có thể thay đổi theo ánh sáng, độ dày và vị trí của vòng.",
};

/* ─────────────────────────────────────────────
   A. CÂU 2 — CẤU TRÚC VI HẠT (field code: grain)
   ───────────────────────────────────────────── */
export type GrainCode = "TE1" | "TE2" | "TE3" | "TE4" | "TE5";

export const GRAIN_OPTIONS: OptionContent[] = [
  {
    code: "TE1",
    label: "Cực mịn",
    short: "Hạt rất nhỏ, liên kết chặt, liền khối",
    description:
      "Hạt tinh thể rất nhỏ và liên kết chặt đến mức khó nhận ra ranh giới từng hạt; tổng thể lòng ngọc trông đặc, mịn và liền khối.",
    image: q1_nbang,
  },
  {
    code: "TE2",
    label: "Mịn",
    short: "Hạt nhỏ, đồng đều, phải nhìn kỹ mới thấy ranh giới",
    description:
      "Hạt nhỏ, khá đồng đều và liên kết tương đối chặt; ranh giới giữa các hạt chỉ nhận thấy khi quan sát kỹ.",
    image: q1_nbang,
  },
  {
    code: "TE3",
    label: "Khá mịn",
    short: "Nhận ra cấu trúc hạt nhưng chưa thô",
    description:
      "Có thể nhận ra cấu trúc hạt nhưng hạt vẫn tương đối nhỏ; bề mặt và lòng ngọc chưa tạo cảm giác thô rõ rệt.",
    image: q1_nep,
  },
  {
    code: "TE4",
    label: "Khá thô",
    short: "Hạt tương đối lớn, bắt đầu gợn",
    description:
      "Hạt tinh thể tương đối lớn, ranh giới giữa các hạt dễ nhận biết hơn; cấu trúc bên trong bắt đầu tạo cảm giác gợn/thô.",
    image: q1_nep,
  },
  {
    code: "TE5",
    label: "Thô",
    short: "Hạt lớn, ranh giới rõ, kém liền mạch",
    description:
      "Hạt tinh thể lớn và ranh giới khá rõ; cấu trúc bên trong dễ quan sát, tạo cảm giác thô và kém liền mạch hơn.",
    image: q1_dau,
  },
];

export const GRAIN_QUESTION = {
  title: "Kích thước vi hạt / cấu trúc bên trong ngọc trông như thế nào?",
  hint: "Hướng vòng về phía cửa sổ, tránh để ánh sáng chiếu trực diện vào vòng.",
};

/* ─────────────────────────────────────────────
   C1. CLASSIFICATION MATRIX (T × TE → 1/9 chủng)
   null = tổ hợp không hợp lệ (UI phải chặn)
   ───────────────────────────────────────────── */
export type ChungName =
  | "Đậu"
  | "Đậu Mịn"
  | "Nếp"
  | "Nếp Mịn"
  | "Nếp Hóa"
  | "Nếp Băng"
  | "Băng"
  | "Cao Băng"
  | "Thuỷ Tinh";

export const CLASSIFICATION_MATRIX: Record<
  GrainCode,
  Record<TranslucencyCode, ChungName | null>
> = {
  TE1: { T1: "Thuỷ Tinh", T2: "Cao Băng", T3: "Nếp Băng", T4: null,        T5: null },
  TE2: { T1: "Thuỷ Tinh", T2: "Băng",     T3: "Nếp Băng", T4: "Nếp Mịn",   T5: "Đậu Mịn" },
  TE3: { T1: "Cao Băng",  T2: "Băng",     T3: "Nếp Hóa",  T4: "Nếp Mịn",   T5: "Đậu Mịn" },
  TE4: { T1: null,        T2: "Nếp Băng", T3: "Nếp Hóa",  T4: "Nếp",       T5: "Đậu" },
  TE5: { T1: null,        T2: "Nếp Hóa",  T3: "Nếp",      T4: "Nếp",       T5: "Đậu" },
};

export function classifyChung(
  t: TranslucencyCode | undefined,
  te: GrainCode | undefined,
): ChungName | null {
  if (!t || !te) return null;
  return CLASSIFICATION_MATRIX[te]?.[t] ?? null;
}

/** Các TE không hợp lệ khi đã chọn T */
export function invalidGrainCodes(t: TranslucencyCode | undefined): GrainCode[] {
  if (!t) return [];
  return (Object.keys(CLASSIFICATION_MATRIX) as GrainCode[]).filter(
    (te) => CLASSIFICATION_MATRIX[te][t] === null,
  );
}

/* ─────────────────────────────────────────────
   C2. TIER (Phong kết cấu)
   ───────────────────────────────────────────── */
export type TierKey = "thuong-tai" | "quy-nhan" | "phi-tan" | "quy-phi" | "hoang-hau";

export const TIER_ORDER: TierKey[] = [
  "thuong-tai",
  "quy-nhan",
  "phi-tan",
  "quy-phi",
  "hoang-hau",
];

export const CHUNG_TO_TIER: Record<ChungName, TierKey> = {
  "Đậu": "thuong-tai",
  "Đậu Mịn": "thuong-tai",
  "Nếp Mịn": "quy-nhan",
  "Nếp Hóa": "quy-nhan",
  "Nếp": "quy-nhan",
  "Nếp Băng": "phi-tan",
  "Băng": "quy-phi",
  "Thuỷ Tinh": "hoang-hau",
  "Cao Băng": "hoang-hau",
};

export const TIER_LABEL: Record<TierKey, string> = {
  "thuong-tai": "Thường Tại",
  "quy-nhan": "Quý Nhân",
  "phi-tan": "Phi Tần",
  "quy-phi": "Quý Phi",
  "hoang-hau": "Hoàng Hậu",
};

/* ─────────────────────────────────────────────
   D. NGỰ PHÊ (random 1/pool theo tier, seeded)
   — nguyên văn từ tierNarrative.ts, đã fix lỗi encoding dấu ngoặc kép
   ───────────────────────────────────────────── */
export const NGU_PHE: Record<TierKey, string[]> = {
  "thuong-tai": [
    "Nhan sắc thanh tú, an phận thủ thường. Phù hợp để đeo cày deadline mỗi ngày.",
    "Xinh xắn vừa mắt, ngoan ngoãn lành tính. Rất hợp đeo đi làm mỗi ngày, vừa đủ để sếp không soi mà đồng nghiệp vẫn khen.",
  ],
  "quy-nhan": [
    "Nước ngọc mướt rượt, dịu mắt mát tay. Nhưng chốt đơn thỉnh thoảng vẫn phải liếc nhẹ cái giá.",
    "Nước ngọc mướt rượt, dịu mắt mát tay. Đeo đi cafe cuối tuần với hội bạn là có cái để xòe tay ra giả vờ ngắm nghía rồi.",
  ],
  "phi-tan": [
    "Thần thái \u201cnửa kín nửa mở\u201d, trong trẻo vừa đủ xài. Mấy chị hay có câu miệng \u201cem đeo cho vui thôi\u201d, nhưng mắt thì liên tục liếc xuống cổ tay ngắm nghía.",
    "Mờ mờ ảo ảo, trong trẻo như sương sớm. Đeo vào tự nhiên thấy dẹp bớt tính nết tào lao, chuyển sang sống có gu hẳn.",
  ],
  "quy-phi": [
    "Khí chất sương mai, đang trên đà đắc sủng. \u201cEm không cố tình nổi bật đâu, tại chiếc vòng nó tự bắt đèn đó chứ.\u201d",
    "Độ bóng miên man, nhìn xa hay nhìn gần đều thấy đắt tiền.",
  ],
  "hoang-hau": [
    "Mẫu nghi thiên hạ, đeo vào tự động toát khí chất phú bà.",
    "Trùm cuối hậu cung. Không cần làm màu, chỉ cần xòe tay ra là thiên hạ tự biết đường hạ giọng.",
  ],
};

/* ─────────────────────────────────────────────
   E. MÀU SẮC & DÁNG (ColorName / Shape) — canonical source
   Đây là nguồn gốc literal union — nếu pricingEngine.ts định nghĩa
   lại, phải khớp 100% ký tự (đặc biệt "Lão Lam Thuỷ" dấu "uỷ").
   ───────────────────────────────────────────── */
export type ColorName =
  // LỤC
  | "Đế Vương Lục"
  | "Chính Dương Lục"
  | "Xanh Cay"
  | "Xanh Ngọt"
  | "Lục Táo"
  | "Đậu Lục"
  | "Thanh Thủy Lục"
  | "Xanh Dầu"
  | "Hồi Lục"
  // TÍM
  | "Tử La Lan"
  | "Tím Cà"
  | "Tím Lam"
  // LAM
  | "Lam Thiên Không"
  | "Lam Thanh"
  | "Lão Lam Thuỷ" // confirmed spelling: "Thuỷ" (dấu uỷ)
  // HỒNG
  | "Hồng Phỉ"
  // HOÀNG
  | "Hoàng Tông Phỉ"
  // BẠCH
  | "Bạch Nguyệt Quang"
  | "Trắng Cháo"
  // HẮC
  | "Mặc Thúy"
  | "Gà Đen"
  // TRUNG TÍNH
  | "Xám";

export type Shape = "Bản Đũa" | "Bản Dẹt" | "Bản Vuông" | "Khắc Hoa";

export type ColorFamily =
  | "Tím"
  | "Lục"
  | "Lam"
  | "Hồng"
  | "Hoàng"
  | "Bạch"
  | "Hắc"
  | "TrungTính"
  | "KhongMau";

export const COLOR_FAMILY_MAP: Record<ColorName, ColorFamily> = {
  "Đế Vương Lục": "Lục",
  "Chính Dương Lục": "Lục",
  "Xanh Cay": "Lục",
  "Xanh Ngọt": "Lục",
  "Lục Táo": "Lục",
  "Đậu Lục": "Lục",
  "Thanh Thủy Lục": "Lục",
  "Xanh Dầu": "Lục",
  "Hồi Lục": "Lục",

  "Tử La Lan": "Tím",
  "Tím Cà": "Tím",
  "Tím Lam": "Tím",

  "Lam Thiên Không": "Lam",
  "Lam Thanh": "Lam",
  "Lão Lam Thuỷ": "Lam",

  "Hồng Phỉ": "Hồng",

  "Hoàng Tông Phỉ": "Hoàng",

  "Bạch Nguyệt Quang": "Bạch",
  "Trắng Cháo": "Bạch",

  "Mặc Thúy": "Hắc",
  "Gà Đen": "Hắc",

  "Xám": "TrungTính",
};

export const COLOR_FAMILY_HASHTAGS: Record<ColorFamily, string[]> = {
  "Tím": ["#Sắc tím dịu dàng", "#Tử sắc mộng mơ", "#Tím ngọc thanh tao"],
  "Lục": ["#Sắc lục phồn vinh", "#Lục ngọc sinh khí", "#Thanh sắc ngọc xanh"],
  "Lam": ["#Lam sắc thanh nhã", "#Lam ngọc tĩnh lặng", "#Sắc lam trong trẻo"],
  "Hồng": ["#Sắc thắm quyến rũ", "#Huyết ngọc mê đắm", "#Hồng ngọc kiều diễm"],
  "Hoàng": ["#Ánh kim rực rỡ", "#Giọt nắng sang mùa", "#Hoàng kim phú quý"],
  "Bạch": ["#Sương trắng tinh khôi", "#Bạch sắc thanh sạch", "#Ngọc trắng thuần khiết"],
  "Hắc": ["#Mặc sắc uy nghi", "#Hắc ngọc trầm mặc", "#Sắc tối huyền bí"],
  "TrungTính": ["#Sắc xám điềm tĩnh", "#Nét ngọc trầm tĩnh", "#Thanh sắc trung hòa"],
  // Không có ColorName nào map vào "KhongMau" hiện tại — family này chỉ có ý
  // nghĩa nếu trigger từ translucency (T1 - trong suốt), chưa wiring trigger đó.
  "KhongMau": ["#Tuyết giữa mùa hạ"],
};

export const HASHTAG_HOA_BAY = "#Hoa bay yêu kiều";

// CONFIRMED — đủ 4/4 dáng, không còn shape nào ở trạng thái "proposed".
export const SHAPE_HASHTAGS: Record<Shape, string[]> = {
  "Bản Đũa": ["#Tròn đầy viên mãn", "#Duyên nguyên an lành"],
  "Bản Dẹt": ["#Thanh nhã duyên dáng", "#Nét ngọc thanh thoát"],
  "Bản Vuông": ["#Vững vàng phú quý", "#Khuôn ngọc đoan trang"],
  "Khắc Hoa": ["#Chạm khắc tinh tế"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Trả về đúng 2 hashtag: [colorTag, shapeTag].
 * Hoa bay KHÔNG override màu (spec đã chốt) → flaws không phải input.
 * Full 22 màu / 4 dáng — vẫn giữ throw phòng khi ColorName/Shape mở
 * rộng thêm trong tương lai mà quên update map.
 */
export function pickHashtags(params: {
  dominantColor: ColorName;
  shape: Shape;
}): [string, string] {
  const { dominantColor, shape } = params;

  const family = COLOR_FAMILY_MAP[dominantColor];
  if (!family) {
    throw new Error(`Missing COLOR_FAMILY_MAP entry for color: ${dominantColor}`);
  }

  const colorPool = COLOR_FAMILY_HASHTAGS[family];
  if (!colorPool?.length) {
    throw new Error(`Missing hashtag pool for color family: ${family}`);
  }

  const shapePool = SHAPE_HASHTAGS[shape];
  if (!shapePool?.length) {
    throw new Error(`Missing hashtag pool for shape: ${shape}`);
  }

  return [pick(colorPool), pick(shapePool)];
}

/* ─────────────────────────────────────────────
   E2. COLOR DICTIONARY (Sắc Diện narrative) — full 22/22
   defaultNarrative: nguyên văn từ content pool.
   ───────────────────────────────────────────── */
export type ColorTone = "nhạt" | "vừa" | "tươi" | "đậm";

export interface ColorDictionaryEntry {
  name: ColorName;
  family: ColorFamily;
  tone: ColorTone; // DEFAULT tone — user input override, xem getEffectiveTone()
  defaultNarrative: string;
}

export const COLOR_DICTIONARY: Record<ColorName, ColorDictionaryEntry> = {
  "Đế Vương Lục": { name: "Đế Vương Lục", family: "Lục", tone: "đậm", defaultNarrative: "sắc lục trầm sâu, uy lực và giàu sức hiện diện" },
  "Chính Dương Lục": { name: "Chính Dương Lục", family: "Lục", tone: "tươi", defaultNarrative: "sắc lục tươi sáng, rực rỡ và giàu sinh khí" },
  "Xanh Cay": { name: "Xanh Cay", family: "Lục", tone: "tươi", defaultNarrative: "sắc xanh sống động, trẻ trung và giàu năng lượng" },
  "Xanh Ngọt": { name: "Xanh Ngọt", family: "Lục", tone: "nhạt", defaultNarrative: "sắc xanh dịu, sáng và trong trẻo" },
  "Lục Táo": { name: "Lục Táo", family: "Lục", tone: "tươi", defaultNarrative: "sắc xanh sáng, tươi non và đầy sức sống" },
  "Đậu Lục": { name: "Đậu Lục", family: "Lục", tone: "vừa", defaultNarrative: "sắc lục trầm mềm, kín đáo và tự nhiên" },
  "Thanh Thủy Lục": { name: "Thanh Thủy Lục", family: "Lục", tone: "nhạt", defaultNarrative: "sắc xanh thanh nhẹ, gợi cảm giác mát và trong như nước" },
  "Xanh Dầu": { name: "Xanh Dầu", family: "Lục", tone: "đậm", defaultNarrative: "sắc xanh trầm, đặc biệt và có cá tính" },
  "Hồi Lục": { name: "Hồi Lục", family: "Lục", tone: "vừa", defaultNarrative: "sắc xanh pha trầm dịu, điềm tĩnh và cổ điển" },
  "Tử La Lan": { name: "Tử La Lan", family: "Tím", tone: "nhạt", defaultNarrative: "sắc tím mềm mại, thanh tao và có nét mộng" },
  "Tím Cà": { name: "Tím Cà", family: "Tím", tone: "đậm", defaultNarrative: "sắc tím đậm, trầm và giàu chiều sâu" },
  "Tím Lam": { name: "Tím Lam", family: "Tím", tone: "đậm", defaultNarrative: "sắc giao thoa giữa tím và lam, sâu và thanh" },
  "Lam Thiên Không": { name: "Lam Thiên Không", family: "Lam", tone: "nhạt", defaultNarrative: "sắc lam sáng, thanh thoát và nhẹ nhàng" },
  "Lam Thanh": { name: "Lam Thanh", family: "Lam", tone: "vừa", defaultNarrative: "sắc lam dịu, cân bằng giữa tươi sáng và trầm tĩnh" },
  "Lão Lam Thuỷ": { name: "Lão Lam Thuỷ", family: "Lam", tone: "đậm", defaultNarrative: "sắc lam trầm, mát và có chiều sâu" },
  "Hồng Phỉ": { name: "Hồng Phỉ", family: "Hồng", tone: "tươi", defaultNarrative: "sắc hồng ấm, giàu sức sống và mềm mại" },
  "Hoàng Tông Phỉ": { name: "Hoàng Tông Phỉ", family: "Hoàng", tone: "đậm", defaultNarrative: "sắc vàng ấm, sang trọng và cổ điển" },
  "Mặc Thúy": { name: "Mặc Thúy", family: "Hắc", tone: "đậm", defaultNarrative: "sắc tối sâu, trầm mặc và giàu cá tính" },
  "Bạch Nguyệt Quang": { name: "Bạch Nguyệt Quang", family: "Bạch", tone: "nhạt", defaultNarrative: "sắc trắng sáng, thanh sạch và nhẹ nhàng" },
  "Trắng Cháo": { name: "Trắng Cháo", family: "Bạch", tone: "nhạt", defaultNarrative: "sắc trắng dịu, đục nhẹ và mềm mại" },
  "Gà Đen": { name: "Gà Đen", family: "Hắc", tone: "đậm", defaultNarrative: "sắc tối trầm, mạnh và giàu tương phản" },
  "Xám": { name: "Xám", family: "TrungTính", tone: "vừa", defaultNarrative: "sắc trung tính, điềm tĩnh và làm nổi bật cấu trúc" },
};

export const COLOR_STORY: Record<ColorName, string> = {
  "Đế Vương Lục": "Đế Vương Lục đại diện cho đỉnh cao sắc xanh phỉ thúy, đậm đà, kiêu hãnh và tràn đầy uy lực.",
  "Chính Dương Lục": "Sắc xanh rực rỡ dưới ánh nắng, mang lại năng lượng tích cực và sự tươi mới bền lâu.",
  "Xanh Cay": "Tông xanh sắc nét, trẻ trung và đầy sức sống, tạo cá tính mạnh mẽ cho người sở hữu.",
  "Xanh Ngọt": "Dịu dàng và trong trẻo như làn nước thu, mang lại cảm giác bình yên, thư thái.",
  "Lục Táo": "Tươi non như chồi mới mọc, tràn đầy hơi thở mùa xuân và sức sống mãnh liệt.",
  "Đậu Lục": "Tông màu mộc mạc, gần gũi, mang nét đẹp cổ điển và trường tồn với thời gian.",
  "Thanh Thủy Lục": "Mát lành và mướt mắt như dòng suối nhỏ, thanh tao mà không phô trương.",
  "Xanh Dầu": "Sâu lắng, điềm tĩnh và đầy bí ẩn, phù hợp với những ai yêu thích chiều sâu nội tâm.",
  "Hồi Lục": "Nét xanh hoài niệm, trầm tĩnh và đĩnh đạc, đong đầy khí chất truyền thống.",
  "Tử La Lan": "Tử La Lan – Tuyệt sắc mùa xuân, mang nét mộng mơ, thanh tao và quý phái.",
  "Tím Cà": "Sắc tím đậm đà, sang trọng, tỏa ra sức hút quý phái và vô cùng quyến rũ.",
  "Tím Lam": "Sự giao thoa ảo diệu giữa tím và lam, tĩnh lặng, bí ẩn và độc đáo.",
  "Lam Thiên Không": "Mở ra khoảng trời rộng lớn, nhẹ nhàng và tự do như mây trời.",
  "Lam Thanh": "Sắc lam dịu mát, mang lại sự cân bằng, an yên cho tâm trí.",
  "Lão Lam Thuỷ": "Sâu thẫm như đáy biển cổ xưa, trầm tĩnh và vô cùng đắt giá.",
  "Hồng Phỉ": "Warm và rực rỡ, biểu trưng cho may mắn, thịnh vượng và tình yêu.",
  "Hoàng Tông Phỉ": "Rực rỡ ánh kim, mang vượng khí và nét sang trọng ấm áp.",
  "Mặc Thúy": "Đen trầm khi nhìn thường, nhưng bừng sáng xanh lục dưới ánh đèn soi – vẻ đẹp ẩn giấu kiêu hãnh.",
  "Bạch Nguyệt Quang": "Trong trẻo như ánh trăng rằm, thuần khiết, thanh sạch và dịu êm.",
  "Trắng Cháo": "Mềm mại, nhu hòa, mang lại cảm giác an toàn và mộc mạc.",
  "Gà Đen": "Sắc tối cá tính, góc cạnh và giàu tính nghệ thuật hiện đại.",
  "Xám": "Trung tính, hiện đại, tôn vinh trọn vẹn từng đường nét kết cấu.",
};
/**
 * userTone luôn override default tone của dictionary — không bao giờ
 * dùng ngược lại. Đây là input do user chọn trong survey (toneLevel/tones).
 */
export function getEffectiveTone(color: ColorName, userTone?: ColorTone): ColorTone {
  return userTone ?? COLOR_DICTIONARY[color].tone;
}

/* ─────────────────────────────────────────────
   E3. SATURATION / DISTRIBUTION TEMPLATES — nguyên văn từ content pool
   ───────────────────────────────────────────── */
export const SATURATION_TEMPLATES = {
  "nhạt": "Sắc độ nhẹ nhàng, tạo nên vẻ thanh thoát và dịu mắt.",
  "vừa": "Sắc độ vừa phải, giữ được sự cân bằng giữa độ nổi bật và nét mềm mại.",
  "tươi": "Sắc màu tươi sáng, tạo nên cảm giác giàu sức sống ngay từ ánh nhìn đầu tiên.",
  "đậm": "Sắc độ đậm giúp màu có sức hiện diện rõ ràng và tạo chiều sâu thị giác mạnh hơn.",
} as const;

export const DISTRIBUTION_TEMPLATES = {
  "đều": "Màu phân bố tương đối đồng đều, tạo nên tổng thể ổn định và hài hòa.",
  "loang nhẹ": "Những chuyển sắc nhẹ khiến diện ngọc có chuyển động mà vẫn giữ được sự hài hòa.",
  "loang mạnh": "Các vùng màu chuyển động rõ rệt, tạo nên một bố cục giàu biến hóa và khó lặp lại hoàn toàn.",
  "thành mảng": "Những mảng màu tạo nên bố cục rõ ràng, khiến từng vùng sắc trở thành một phần của diện ngọc.",
  "thành vệt": "Những vệt màu tự nhiên tạo nên hướng chuyển động cho bề mặt, khiến ánh nhìn không dừng lại ở một điểm duy nhất.",
  "điểm xuyết": "Những vùng màu nhỏ xuất hiện như các điểm nhấn, tạo thêm nhịp điệu cho tổng thể.",
  "chuyển màu": "Các sắc màu chuyển tiếp tự nhiên, tạo nên cảm giác liền mạch và giàu chiều sâu.",
} as const;

/* ─────────────────────────────────────────────
   F. STRUCTURAL FEATURES
   ───────────────────────────────────────────── */
export type AestheticEffect =
  | "positive"
  | "negative_minor"
  | "negative_medium"
  | "negative_high";

export type DurabilityAttention = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

export interface FeatureContent {
  code: string;
  name: string;
  hook?: string;               // câu mở đầu ngắn
  description: string;         // giữ nguyên — mô tả chính
  aestheticNote?: string;      // "Ảnh hưởng thẩm mỹ: ..."
  durabilityNote?: string;     // "Độ bền" / "Mức cần lưu ý" / "Cần lưu ý"
  aesthetic_effect: AestheticEffect;
  durability_attention: DurabilityAttention;
  warning: boolean;
  internal_score: number;
}

export const FEATURES: Record<string, FeatureContent> = {
  hoa_bay: {
    code: "hoa_bay",
    name: "Hoa bay",
    hook: "Tập hợp các vệt màu trôi nổi tự do trong lòng ngọc.",
    description: "Các vệt màu đan xen như cánh hoa trôi, tạo điểm nhấn tự nhiên và sinh động cho khối đá.",
    aestheticNote: "Tăng tính thẩm mỹ, tạo nét uyển chuyển độc đáo cho tổng thể.",
    durabilityNote: "Không ảnh hưởng đến kết cấu hay độ bền của ngọc.",
    aesthetic_effect: "positive",
    durability_attention: "NONE",
    warning: false,
    internal_score: 1,
  },
  chi_mau: {
    code: "chi_mau",
    name: "Chỉ màu",
    hook: "Tập hợp các dải màu tập trung thành đường mảnh.",
    description: "Đường màu kéo dài trong lòng ngọc, thường có sắc độ đậm hơn nền.",
    aestheticNote: "Tạo vệt nhấn thị giác, phụ thuộc vào hướng chạy của dải màu.",
    durabilityNote: "Không ảnh hưởng đến kết cấu chịu lực.",
    aesthetic_effect: "negative_minor",
    durability_attention: "LOW",
    warning: false,
    internal_score: -1,
  },
  gan_non: {
    code: "gan_non",
    name: "Gân ngọc non",
    hook: "Mạng lưới đường gân nhạt màu phân nhánh.",
    description: "Các đường gân nhỏ xuất hiện rải rác, thể hiện giai đoạn kết tinh chưa hoàn toàn đồng nhất.",
    aestheticNote: "Có thể làm giảm đôi chút độ mướt và độ đồng màu bề mặt.",
    durabilityNote: "Cần lưu ý nhẹ khi va chạm mạnh.",
    aesthetic_effect: "negative_minor",
    durability_attention: "LOW",
    warning: false,
    internal_score: -2,
  },
  gan_gia: {
    code: "gan_gia",
    name: "Gân ngọc già",
    hook: "Đường gân sẫm màu đan xen rắn chắc.",
    description: "Mạng lưới đường gân đã biến chất hoàn toàn, tiệm cận với độ cứng của nền đá.",
    aestheticNote: "Tạo phong vị cổ kính, tuy nhiên có thể chia cắt mảng màu.",
    durabilityNote: "Kết cấu tương đối ổn định.",
    aesthetic_effect: "negative_minor",
    durability_attention: "LOW",
    warning: false,
    internal_score: -1,
  },
  so_bong: {
    code: "so_bong",
    name: "Sớ bông",
    hook: "Đừng hoảng, sớ bông không phải vết nứt.",
    description: "Các cụm tinh thể dạng bông tuyết lơ lửng, tạo độ mờ tự nhiên.",
    aestheticNote: "Làm giảm độ trong suốt nhưng tạo hiệu ứng sương mờ dịu mắt.",
    durabilityNote: "An toàn, không làm giảm khả năng chịu lực.",
    aesthetic_effect: "negative_minor",
    durability_attention: "LOW",
    warning: false,
    internal_score: -1,
  },
  so_ngan: {
    code: "so_ngan",
    name: "Sớ ngắn",
    description:
      "Những đường sớ ngắn và rời trong lòng ngọc. Đây là đặc điểm khá thường gặp, đặc biệt ở vòng bản; sớ ngắn dưới khoảng 1cm thường ít đáng lo ngại.",
    aesthetic_effect: "negative_minor",
    durability_attention: "LOW",
    warning: false,
    internal_score: -1,
  },
  so_am: {
    code: "so_am",
    name: "Sớ âm",
    hook: "Đường sớ nằm hoàn toàn bên trong lòng ngọc.",
    description: "Đường kết cấu ẩn sâu bên trong, rờ tay trên bề mặt hoàn toàn trơn láng.",
    aestheticNote: "Có thể quan sát thấy dưới ánh sáng soi đèn.",
    durabilityNote: "Cần theo dõi nếu có lực tác động trực tiếp.",
    aesthetic_effect: "negative_medium",
    durability_attention: "MEDIUM",
    warning: true,
    internal_score: -2,
  },
  so_am_dai: {
    code: "so_am_dai",
    name: "Sớ âm dài",
    description:
      "Tương tự sớ âm nhưng có chiều dài đáng kể hơn. Độ dài và vị trí cần được cân nhắc vì có thể ảnh hưởng cả tính thẩm mỹ lẫn độ bền.",
    aesthetic_effect: "negative_medium",
    durability_attention: "MEDIUM",
    warning: true,
    internal_score: -3,
  },
  so_can: {
    code: "so_can",
    name: "Sớ cấn",
    description:
      "Đường sớ nằm trên hoặc sát bề mặt, có thể cảm nhận được bằng móng tay. Dễ bám bụi bẩn và cần được lưu ý hơn trong quá trình sử dụng.",
    aesthetic_effect: "negative_medium",
    durability_attention: "HIGH",
    warning: true,
    internal_score: -3,
  },
  so_luoi_ga: {
    code: "so_luoi_ga",
    name: "Sớ lưỡi gà",
    hook: "Vệt sớ nhọn góc ôm theo thành vòng.",
    description: "Đường sớ vót nhọn ăn sâu theo hình chữ V hoặc dạng lưỡi gạt.",
    aestheticNote: "Gây gián đoạn nhịp màu tại góc nhọn của sớ.",
    durabilityNote: "Khu vực tập trung ứng suất, cần tránh va đập góc.",
    aesthetic_effect: "negative_high",
    durability_attention: "HIGH",
    warning: true,
    internal_score: -4,
  },
  so_doc: {
    code: "so_doc",
    name: "Sớ dọc",
    hook: "Đường sớ chạy song song theo chu vi vòng.",
    description: "Đường kết cấu phát triển dọc theo chiều dài của bản ngọc.",
    aestheticNote: "Ít gây chú ý nếu chạy trùng với vệt màu.",
    durabilityNote: "Ít nguy hiểm hơn sớ ngang nhưng vẫn cần giữ gìn.",
    aesthetic_effect: "negative_medium",
    durability_attention: "MEDIUM",
    warning: true,
    internal_score: -2,
  },
  so_doc_dai: {
    code: "so_doc_dai",
    name: "Sớ dọc dài",
    description:
      "Đường sớ chạy dọc theo bản vòng với chiều dài đáng kể. Nếu đồng thời là sớ cấn hoặc kéo dài qua vùng nhạy cảm, cần đặc biệt lưu ý khi sử dụng.",
    aesthetic_effect: "negative_high",
    durability_attention: "HIGH",
    warning: true,
    internal_score: -4,
  },
  so_cheo: {
    code: "so_cheo",
    name: "Sớ chéo",
    hook: "Đường sớ đâm xiên qua thân ngọc.",
    description: "Đường kết cấu chéo góc so với hướng của bản vòng.",
    aestheticNote: "Tạo cảm giác mất cân đối cục bộ.",
    durabilityNote: "Đỏi hỏi cẩn trọng trong quá trình đeo hàng ngày.",
    aesthetic_effect: "negative_high",
    durability_attention: "HIGH",
    warning: true,
    internal_score: -5,
  },
  so_ngang: {
    code: "so_ngang",
    name: "Sớ ngang",
    hook: "Đường sớ cắt vuông góc qua bản vòng.",
    description: "Vệt kết cấu đứt đoạn chạy cắt ngang chiều rộng chiếc vòng.",
    aestheticNote: "Tạo vệt cắt rõ rệt trên diện ngọc.",
    durabilityNote: "Mức độ rủi ro cao khi rơi hoặc va chạm ngang.",
    aesthetic_effect: "negative_high",
    durability_attention: "HIGH",
    warning: true,
    internal_score: -5,
  },
  mat_cat: {
    code: "mat_cat",
    name: "Mắt cát",
    hook: "Điểm khoáng thô khác màu lẫn trên bề mặt.",
    description: "Hạt khoáng tạp chất cứng hoặc mềm hơn tập trung thành điểm lẻ.",
    aestheticNote: "Tạo điểm tì vết nhỏ trên mặt mài bóng.",
    durabilityNote: "Có thể tạo vị trí dơ hoặc bong nhẹ nếu bị tác động.",
    aesthetic_effect: "negative_high",
    durability_attention: "MEDIUM",
    warning: true,
    internal_score: -4,
  },
  vet_san_lom_nhe: {
    code: "vet_san_lom_nhe",
    name: "Vết sần / lõm (nhẹ)",
    description:
      "Một vùng bề mặt hơi sần hoặc lõm, thường liên quan đến đặc điểm của ngọc thô và quá trình mài đánh bóng. Ở mức nhẹ, chủ yếu ảnh hưởng đến thẩm mỹ.",
    aesthetic_effect: "negative_medium",
    durability_attention: "LOW",
    warning: false,
    internal_score: -2,
  },
  vet_san_lom_vua: {
    code: "vet_san_lom_vua",
    name: "Vết sần / lõm (vừa)",
    description:
      "Vùng bề mặt sần hoặc lõm ở mức vừa. Có thể ảnh hưởng đến thẩm mỹ và dễ giữ bụi bẩn theo thời gian.",
    aesthetic_effect: "negative_medium",
    durability_attention: "LOW",
    warning: false,
    internal_score: -2.5,
  },
  vet_san_lom_ro: {
    code: "vet_san_lom_ro",
    name: "Vết sần / lõm (rõ)",
    description:
      "Vùng bề mặt sần hoặc lõm thấy rõ. Ảnh hưởng đến thẩm mỹ và dễ giữ bụi bẩn theo thời gian, là yếu tố cần cân nhắc khi định giá.",
    aesthetic_effect: "negative_medium",
    durability_attention: "LOW",
    warning: false,
    internal_score: -3,
  },
vet_nut: {
    code: "vet_nut",
    name: "Vết nứt",
    hook: "Đường rạn tách biệt hoàn toàn kết cấu ngọc.",
    description: "Vết rạn có thể cảm nhận bằng móng tay hoặc soi đèn thấy ranh giới hở.",
    aestheticNote: "Ảnh hưởng rõ rệt đến giá trị và vẻ đẹp tổng thể.",
    durabilityNote: "Rất nguy hiểm, rủi ro vỡ cao khi chịu lực.",
    aesthetic_effect: "negative_high",
    durability_attention: "VERY_HIGH",
    warning: true,
    internal_score: -5,
  },
};

export const CRACK_RED_WARNING =
  "Nếu ghi nhận vết nứt rõ, kết quả giá tham khảo không nên được hiểu là đánh giá an toàn của chiếc vòng. Nên có đánh giá trực tiếp bởi người có chuyên môn trước khi tiếp tục sử dụng.";

export const FEATURE_GROUPS: { qid: number; title: string; hint: string; codes: string[] }[] = [
  {
    qid: 5,
    title: "Hoa văn & chỉ màu",
    hint: "Có những đặc điểm nào xuất hiện trên vòng?",
    codes: ["hoa_bay", "chi_mau", "gan_non", "gan_gia"],
  },
  {
    qid: 6,
    title: "Sớ",
    hint: "Vòng có sớ nào không?",
    codes: [
      "so_bong",
      "so_ngan",
      "so_am",
      "so_am_dai",
      "so_can",
      "so_luoi_ga",
      "so_doc",
      "so_doc_dai",
      "so_cheo",
      "so_ngang",
    ],
  },
  {
    qid: 7,
    title: "Khuyết điểm bề mặt",
    hint: "Vòng có khuyết điểm bề mặt nào không?",
    codes: ["mat_cat", "vet_san_lom_nhe", "vet_san_lom_vua", "vet_san_lom_ro", "vet_nut"],
  },
];

/* Nhãn hiển thị mức độ (không bao giờ hiện internal_score) */
export const AESTHETIC_LABEL: Record<AestheticEffect, string> = {
  positive: "Điểm nhấn",
  negative_minor: "Không đáng kể",
  negative_medium: "Trung bình",
  negative_high: "Cao",
};

export const ATTENTION_LABEL: Record<DurabilityAttention, string> = {
  NONE: "Không ghi nhận",
  LOW: "Thấp",
  MEDIUM: "Trung bình",
  HIGH: "Cao",
  VERY_HIGH: "Rất cao",
};

export const ATTENTION_RANK: Record<DurabilityAttention, number> = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  VERY_HIGH: 4,
};

/* ─────────────────────────────────────────────
   B. COPY TRANG CHỦ
   ───────────────────────────────────────────── */
export const HOME_COPY = {
  ctaSub:
    "Hiểu Ngọc giúp bạn hiểu những đặc điểm của món Ngọc và có thêm một mức giá tham khảo để cân nhắc trước khi xuống tiền.",
  cotNgocDemo:
    "Phẩm ngọc đạt chủng Nếp Băng. Cấu trúc liên kết chặt chẽ, chất ngọc mướt mát, ngậm nước như sương sớm. Lựa chọn hoàn mỹ cho những ai tìm kiếm chiều sâu của ngọc với một mức ngân sách tối ưu.",
  mission: {
    title: "SỨ MỆNH HIỂU NGỌC",
    lead: "Mua món Ngọc mình thích. Đừng mua vì một lời rao giá.",
    paragraphs: [
      "Phỉ Thúy đẹp, nhưng để hiểu một món Ngọc đẹp ở đâu, thuộc phẩm chất nào và mức giá được đưa ra có hợp lý hay không lại không hề dễ.",
      "Hiểu Ngọc giúp bạn từng bước hiểu những đặc điểm của món Ngọc, tự phân loại và có thêm một điểm tham chiếu về giá — để bạn có thể đưa ra quyết định của riêng mình, thay vì chỉ dựa vào tên gọi, lời quảng cáo hay cảm tính.",
      "Chúng mình không quyết định thay bạn. Chúng mình chỉ muốn bạn hiểu món Ngọc trước khi xuống tiền.",
    ],
  },
  commitments: [
    {
      icon: "🔒",
      title: "Tự do & An toàn",
      body: "Không cần đăng nhập hay cung cấp tên, số điện thoại hoặc email. Bạn có thể sử dụng Hiểu Ngọc mà không phải để lại thông tin cá nhân.",
    },
    {
      icon: "🤝",
      title: "Độc lập với người bán",
      body: "Hiểu Ngọc không bán Ngọc, không nhận hoa hồng từ giao dịch và được xây dựng với mục tiêu phi thương mại để kết quả không nhằm thúc đẩy bạn mua một món hàng cụ thể.",
    },
    {
      icon: "📊",
      title: "Một điểm tham chiếu",
      body: "Kết quả không phải \u201cgiá đúng\u201d. Nó là một thông tin bên cạnh kiến thức và đánh giá của bạn, giúp bạn có thêm một điểm phanh trước khi xuống tiền.",
    },
  ],
  methodLinkLabel: "Tìm hiểu cách chúng tôi định giá & các giới hạn của công cụ →",
  footerMeta: [
    "Ngày cập nhật dữ liệu: 08/2026",
    "Phiên bản mô hình: v1.0",
    "Phạm vi: Giá tham khảo tại thị trường Việt Nam",
  ],
  footerNote:
    "Hiểu Ngọc liên tục cải thiện dữ liệu và phương pháp. Khi mô hình hoặc dữ liệu thay đổi, kết quả tham khảo cũng có thể thay đổi.",
};

export const METHOD_PAGE_COPY = {
  title: "Cách chúng tôi định giá & giới hạn của công cụ",
  body: [
    "Phần này đang được hoàn thiện.",
    "Chúng mình đang tiếp tục xây dựng và kiểm chứng phương pháp phía sau Hiểu Ngọc.",
    "Quay lại sớm nhé.",
  ],
};

/* ─────────────────────────────────────────────
   HELPERS — random có seed để không đổi khi refresh
   ───────────────────────────────────────────── */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function seededPick<T>(pool: T[], seed: string): T | undefined {
  if (!pool.length) return undefined;
  return pool[hashSeed(seed) % pool.length];
}

/** Mô tả chi tiết chủng cho phần Cốt Ngọc */
export const CHUNG_BASE_COPY: Record<ChungName, string> = {
  "Thuỷ Tinh":
    "Phẩm ngọc đạt cảnh giới Thủy Tinh. Độ xuyên sáng rất cao, kết hợp cùng cấu trúc hạt {grain}, tạo nên cảm giác sáng, sạch và liền khối. Chất ngọc nổi bật ở khả năng đón và truyền ánh sáng sâu vào lòng đá.",
  "Cao Băng":
    "Phẩm ngọc đạt cảnh giới Cao Băng. Độ trong nổi bật cùng cấu trúc vi hạt {grain} tạo nên vẻ sáng trong nhưng vẫn giữ được chiều sâu của chất ngọc. Đây là sự cân bằng đẹp giữa độ xuyên sáng và cấu trúc bên trong.",
  "Băng":
    "Phẩm ngọc đạt cảnh giới Băng. Độ xuyên sáng cao cùng cấu trúc hạt {grain} tạo nên chất ngọc sáng, trong và có chiều sâu. Ánh sáng đi sâu vào lòng đá, đem lại cảm giác mềm mại và liền khối.",
  "Nếp Băng":
    "Phẩm ngọc đạt cảnh giới Nếp Băng. Độ trong mờ kết hợp cùng cấu trúc hạt {grain}, tạo nên chất ngọc mềm, mượt và có cảm giác như lớp sương được giữ lại trong lòng đá. Vẻ đẹp nằm ở sự cân bằng giữa độ dịu của ánh sáng và độ chặt của cấu trúc.",
  "Nếp Hóa":
    "Phẩm ngọc đạt cảnh giới Nếp Hóa. Chất ngọc mang độ trong vừa phải, trong khi cấu trúc {grain} bắt đầu tạo nên dấu ấn rõ hơn bên trong. Tổng thể giữ được vẻ mềm mại nhưng đồng thời cho phép người xem cảm nhận rõ hơn "thịt ngọc".",
  "Nếp Mịn":
    "Phẩm ngọc đạt cảnh giới Nếp Mịn. Độ trong dịu kết hợp với cấu trúc hạt {grain}, tạo nên chất ngọc mềm, đều và tương đối liền khối. Đây là vẻ đẹp thiên về sự mượt mà, cân bằng và tự nhiên.",
  "Nếp":
    "Phẩm ngọc đạt cảnh giới Nếp. Độ xuyên sáng vừa phải cùng cấu trúc {grain} khiến "thịt ngọc" biểu hiện rõ hơn. Chất ngọc không phô diễn bằng độ trong mà gây ấn tượng bởi độ đặc và kết cấu tự nhiên.",
  "Đậu Mịn":
    "Phẩm ngọc đạt cảnh giới Đậu Mịn. Độ trong thấp khiến ánh sáng khó đi sâu, nhưng cấu trúc {grain} vẫn giữ cho tổng thể tương đối đều và mềm. Vẻ đẹp của nhóm này nằm ở độ đặc và sự ổn định của chất ngọc.",
  "Đậu":
    "Phẩm ngọc đạt cảnh giới Đậu. Độ xuyên sáng thấp kết hợp cùng cấu trúc {grain} tạo nên chất ngọc đặc và có kết cấu rõ rệt. Thay vì vẻ trong sáng, điểm cuốn hút nằm ở sự hiện diện mạnh của "thịt ngọc" và cấu trúc tự nhiên.",
};

export const GRAIN_MODIFIER: Record<GrainCode, string> = {
  TE1: "vi hạt cực mịn, liên kết chặt và khó nhận biết ranh giới từng hạt",
  TE2: "hạt mịn, tương đối liên kết và tạo cảm giác khá liền khối",
  TE3: "hạt khá mịn, bắt đầu có thể cảm nhận rõ hơn cấu trúc bên trong",
  TE4: "hạt khá lớn, khiến cấu trúc bên trong biểu hiện rõ hơn",
  TE5: "hạt lớn và dễ nhận biết, tạo nên cảm giác "thịt ngọc" rõ rệt",
};

export const CHUNG_DESCRIPTOR: Record<ChungName, { grain: string; texture: string; value: string }> = {
  "Thuỷ Tinh": { grain: "liền khối gần như không thấy hạt", texture: "trong veo, có chiều sâu", value: "sự thanh sạch tuyệt đối" },
  "Cao Băng": { grain: "cực mịn, liên kết chặt", texture: "trong trẻo, ánh nước rõ", value: "chiều sâu và độ trong" },
  "Băng": { grain: "mịn và đồng đều", texture: "mát mắt, ngậm nước", value: "vẻ trong trẻo cân bằng" },
  "Nếp Băng": { grain: "liên kết chặt chẽ", texture: "mướt mát, ngậm nước như sương sớm", value: "chiều sâu của ngọc" },
  "Nếp Hóa": { grain: "khá mịn, ranh giới hạt nhẹ nhàng", texture: "mềm mại, hài hòa", value: "sự cân bằng giữa chất và giá" },
  "Nếp Mịn": { grain: "hạt nhỏ, đều tay", texture: "êm dịu, mịn như sứ", value: "vẻ đẹp ôn nhu" },
  "Nếp": { grain: "hạt nhận thấy được", texture: "tự nhiên, mộc mạc", value: "nét thuần phác của đá" },
  "Đậu Mịn": { grain: "hạt nhỏ nhưng thấy rõ", texture: "khô ráo, chắc tay", value: "sự bền bỉ thường ngày" },
  "Đậu": { grain: "hạt lớn, ranh giới rõ", texture: "thuần mộc, chắc chắn", value: "vẻ đẹp giản dị" },
};
