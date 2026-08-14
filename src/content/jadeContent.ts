// ============================================================
// HIỂU NGỌC — CONTENT CONFIG (v2)
// Toàn bộ nội dung hiển thị tách khỏi logic component.
// Logic chỉ: đọc field code → tra bảng ở đây → render.
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
   E. HASHTAGS — luôn đúng 2: 1 màu (hoặc hoa bay) + 1 dáng
   ───────────────────────────────────────────── */
export type ColorFamily = "tim" | "luc" | "khong_mau" | "trang" | "do_cam" | "vang";

export const HASHTAG_COLOR: Record<ColorFamily, string[]> = {
  tim: ["#Sắc tím dịu dàng"],
  luc: ["#Sắc lục phồn vinh"],
  khong_mau: ["#Tuyết giữa mùa hạ"],
  trang: ["#Sương trắng tinh khôi"],
  do_cam: ["#Sắc thắm quyến rũ", "#Huyết ngọc mê đắm"],
  vang: ["#Ánh kim rực rỡ", "#Giọt nắng sang mùa", "#Hoàng kim phú quý"],
};

export const HASHTAG_HOA_BAY = "#Hoa bay yêu kiều";

export type ShapeType = "ban_dua" | "ban_he" | "ban_vuong" | "cham_khac";

export const HASHTAG_SHAPE: Record<ShapeType, string[]> = {
  ban_dua: ["#Tròn đầy viên mãn", "#Duyên nguyên an lành"],
  ban_he: ["#Tròn đầy viên mãn", "#Duyên nguyên an lành"],
  ban_vuong: ["#Tròn đầy viên mãn", "#Duyên nguyên an lành"],
  cham_khac: ["#Chạm khắc tinh tế"],
};

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
  description: string;
  aesthetic_effect: AestheticEffect;
  durability_attention: DurabilityAttention;
  warning: boolean;
  internal_score: number; // heuristic nội bộ — KHÔNG hiển thị dạng số
}

export const FEATURES: Record<string, FeatureContent> = {
  hoa_bay: {
    code: "hoa_bay",
    name: "Hoa bay",
    description:
      "Sợi màu và những vệt mềm tạo cảm giác sống động như những cánh hoa đang trôi trong nước. Đây là một đặc điểm thẩm mỹ tự nhiên và được xem là điểm cộng.",
    aesthetic_effect: "positive",
    durability_attention: "NONE",
    warning: false,
    internal_score: 1,
  },
  chi_mau: {
    code: "chi_mau",
    name: "Chỉ màu",
    description:
      "Đường màu đậm hơn nền ngọc, thường xuất hiện thành những sợi mảnh chạy trong lòng đá. Có thể dễ nhầm với đường nứt hoặc sớ. Khi soi đèn, ánh sáng vẫn truyền liền qua đường màu thay vì bị cắt.",
    aesthetic_effect: "negative_minor",
    durability_attention: "LOW",
    warning: false,
    internal_score: -1,
  },
  gan_non: {
    code: "gan_non",
    name: "Gân ngọc non",
    description:
      "Những đường chằng chịt như rễ cây, thường có màu trắng nhạt và thường gặp ở ngọc non. Chủ yếu ảnh hưởng đến tính thẩm mỹ và là một dấu hiệu cần được cân nhắc khi đánh giá cấu trúc tổng thể.",
    aesthetic_effect: "negative_minor",
    durability_attention: "LOW",
    warning: false,
    internal_score: -2,
  },
  gan_gia: {
    code: "gan_gia",
    name: "Gân ngọc già",
    description:
      "Những đường chằng chịt như rễ cây, thường có màu đậm hơn và thường gặp ở ngọc già. Thường ít ảnh hưởng đến độ bền nhưng có thể ảnh hưởng đến tính thẩm mỹ.",
    aesthetic_effect: "negative_minor",
    durability_attention: "LOW",
    warning: false,
    internal_score: -1,
  },
  so_bong: {
    code: "so_bong",
    name: "Sớ bông",
    description:
      "Đường sớ không sắc nét mà mờ và lấm tấm như cụm tuyết hoặc sợi bông. Thường không ảnh hưởng đến độ bền.",
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
    description:
      "Đường sớ nằm sâu trong lòng ngọc; khi rà nhẹ móng tay trên bề mặt không cảm thấy gợn nhưng khi soi đèn có thể nhận biết đường này qua sự thay đổi của ánh sáng.",
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
    description:
      "Đường sớ có hình dáng nhọn như lưỡi gà và ôm quanh bản vòng. Đây là dạng cần đặc biệt lưu ý vì vị trí và hình thái có thể khiến khu vực này nhạy cảm hơn khi va chạm.",
    aesthetic_effect: "negative_high",
    durability_attention: "HIGH",
    warning: true,
    internal_score: -4,
  },
  so_doc: {
    code: "so_doc",
    name: "Sớ dọc",
    description:
      "Đường sớ chạy dọc theo bản vòng. Hướng này thường thuận hơn về phương chịu lực, nhưng vẫn có thể ảnh hưởng đến tính thẩm mỹ tùy chiều dài và vị trí.",
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
    description:
      "Đường sớ vắt chéo qua bản vòng. Mức độ cần lưu ý phụ thuộc vào chiều dài, vị trí và việc đường sớ nằm sâu hay đã chạm bề mặt.",
    aesthetic_effect: "negative_high",
    durability_attention: "HIGH",
    warning: true,
    internal_score: -5,
  },
  so_ngang: {
    code: "so_ngang",
    name: "Sớ ngang",
    description:
      "Đường sớ chạy ngang bản vòng và có thể tạo thành một hướng yếu hơn khi chịu va chạm. Đặc biệt cần lưu ý nếu đường sớ kéo dài từ mặt trong ra mặt ngoài.",
    aesthetic_effect: "negative_high",
    durability_attention: "HIGH",
    warning: true,
    internal_score: -5,
  },
  mat_cat: {
    code: "mat_cat",
    name: "Mắt cát",
    description:
      "Mảng hoặc cụm hạt thô khác màu do có khoáng chất khác lẫn trong lòng hoặc trên bề mặt ngọc. Vị trí này có thể ảnh hưởng đến cả thẩm mỹ và độ liền mạch của cấu trúc.",
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
    description:
      "Đường nứt có thể hình thành tự nhiên hoặc xuất hiện trong quá trình khai thác, vận chuyển, chế tác hay sử dụng. Khi nhìn rõ hoặc cảm nhận được trên bề mặt, đây là yếu tố có thể ảnh hưởng đáng kể đến độ bền và tính thẩm mỹ.",
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
