// ============================================================
// JADE PRICING ENGINE v2.0
// Logic: AHP + Bayesian Risk + Behavioral Economics
// ============================================================
// NOTE: Đặt ở file riêng (jadePriceEngine.ts) để không phá vỡ
// `src/lib/jadePrice.ts` cũ đang được ThamDinh.tsx sử dụng.

// ─── TYPES ───────────────────────────────────────────────────

export interface JadeInput {
  crystalStructure: 1 | 2 | 3;
  transparency: 1 | 2 | 3 | 4 | 5;
  peakCoverage: "full" | "major" | "half" | "minor";

  colorLayout: "solid" | "hoa_bay" | "loang" | "multi";
  baseColors: ColorKey[];
  accentColors: ColorKey[];
  colorTone: 1 | 2 | 3 | 4;

  surfaceFeel: "smooth" | "rough";
  flaws: FlawKey[];
  flawSize: "under3cm" | "over3cm" | null;

  ni: number;
  shape: "dua" | "dep" | "vuong" | "khac_hoa";
  chot: number;

  hasCertificate: "reputable" | "unclear" | "none";
  sellerPressure: number;
  hasVideo: boolean;
}

export type ColorKey =
  | "de_vuong_luc" | "chinh_duong_luc" | "xanh_cay" | "xanh_ngot"
  | "luc_tao" | "dau_luc" | "thanh_thuy_luc" | "xanh_dau" | "hoi_luc"
  | "mac_thuy"
  | "tu_la_lan" | "tim_ca" | "tim_lam"
  | "hong_phi" | "hoang_tong_phi"
  | "lam_thien_khong" | "lam_thanh" | "lao_lam_thuy"
  | "trang" | "xam" | "ga_den"
  | "hoang_luc_phi" | "xuan_doi_tai" | "phuc_loc_tho"
  | "phieu_hoa";

export type FlawKey =
  | "van_ngoc" | "so_bong" | "gan_gia" | "chi_mau" | "gan_non"
  | "so_am" | "so_doc" | "so_luoi_ga" | "so_ngang_cheo" | "vet_nut"
  | "mat_cat" | "san_lom";

export interface PricingResult {
  priceMin: number;
  priceMax: number;
  qScore: number;
  confidenceLevel: number;
  phongKetCau: string;
  truongPhai: TruongPhai;
  truongPhaiDesc: string;
  warnings: string[];
  healthWarning: string | null;
  isImperialCandidate: boolean;
  tags: string[];
  radar: {
    doDong: number;
    sacDien: number;
    doLanhLan: number;
    damTay: number;
    thamMy: number;
  };
}

export type TruongPhai =
  | "classic_harmony"
  | "bold_statement"
  | "everyday_companion"
  | "natures_canvas";

// ─── BẢNG DỮ LIỆU ────────────────────────────────────────────

const COLOR_SCORE: Record<ColorKey, number> = {
  de_vuong_luc: 100,
  chinh_duong_luc: 95,
  xanh_cay: 80,
  xanh_ngot: 70,
  luc_tao: 65,
  dau_luc: 40,
  thanh_thuy_luc: 45,
  xanh_dau: 30,
  hoi_luc: 20,
  mac_thuy: 75,
  tu_la_lan: 90,
  tim_ca: 85,
  tim_lam: 60,
  hong_phi: 80,
  hoang_tong_phi: 55,
  lam_thien_khong: 88,
  lam_thanh: 50,
  lao_lam_thuy: 35,
  trang: 15,
  xam: 5,
  ga_den: 20,
  hoang_luc_phi: 85,
  xuan_doi_tai: 92,
  phuc_loc_tho: 88,
  phieu_hoa: 0,
};

function calcCotScore(crystal: number, transparency: number): number {
  const base: Record<number, Record<number, number>> = {
    1: { 1: 20, 2: 28, 3: 35, 4: 42, 5: 48 },
    2: { 1: 40, 2: 52, 3: 62, 4: 72, 5: 80 },
    3: { 1: 65, 2: 75, 3: 82, 4: 88, 5: 94 },
  };
  return base[crystal]?.[transparency] ?? 30;
}

const COVERAGE_COEFF: Record<string, number> = {
  full: 1.0, major: 0.85, half: 0.75, minor: 0.65,
};

function niCoeff(ni: number): number {
  if (ni < 50) return 0.95;
  if (ni <= 56) return 1.0;
  if (ni <= 60) return 1.005;
  if (ni <= 62) return 1.01;
  return 1.015;
}

const SHAPE_COEFF: Record<string, number> = {
  dua: 1.003, dep: 1.0, vuong: 1.0, khac_hoa: 0.7,
};

function chotCoeff(chot: number): number {
  if (chot < 6.5) return 0.9;
  if (chot < 10) return 0.95;
  if (chot < 12) return 1.0;
  if (chot <= 13.5) return 1.0005;
  if (chot <= 15.5) return 1.005;
  return 1.05;
}

const FLAW_RISK: Record<FlawKey, number> = {
  van_ngoc: 1.0,
  so_bong: 0.9888,
  gan_gia: 0.9888,
  chi_mau: 0.9555,
  gan_non: 0.9555,
  so_am: 0.9555,
  mat_cat: 0.88,
  san_lom: 0.88,
  so_doc: 0.88,
  so_luoi_ga: 0.75,
  so_ngang_cheo: 0.73,
  vet_nut: 0.5,
};

function adjustedFlawRisk(flaws: FlawKey[], flawSize: string | null, qScore: number): number {
  if (flaws.length === 0) return 1.0;
  const riskValues = flaws.map((f) => {
    let r = FLAW_RISK[f] ?? 1.0;
    if (flawSize === "over3cm") {
      if (f === "so_doc") r = 0.75;
      if (f === "vet_nut") r = 0.45;
    }
    return r;
  });
  let worstRisk = Math.min(...riskValues);
  if (qScore < 40) worstRisk = Math.max(0.1, worstRisk - 0.1);
  return worstRisk;
}

function getVBase(qScore: number): number {
  if (qScore >= 95) return 200_000_000;
  if (qScore >= 85) return 100_000_000;
  if (qScore >= 75) return 30_000_000;
  if (qScore >= 55) return 15_000_000;
  if (qScore >= 30) return 3_000_000;
  return 800_000;
}

function applyHardCap(v: number, qScore: number): number {
  if (qScore < 30) return Math.min(v, 3_000_000);
  if (qScore < 55) return Math.min(v, 9_000_000);
  if (qScore < 75) return Math.min(v, 80_000_000);
  if (qScore < 85) return Math.min(v, 150_000_000);
  return v;
}

// ─── MAIN ENGINE ─────────────────────────────────────────────

export function calculateJadePrice(input: JadeInput): PricingResult {
  const warnings: string[] = [];
  let healthWarning: string | null = null;

  const rawCotScore = calcCotScore(input.crystalStructure, input.transparency);
  const cotScore = rawCotScore * COVERAGE_COEFF[input.peakCoverage];

  const allColors = [...input.baseColors, ...input.accentColors];
  const isImperialCandidate = allColors.some((c) =>
    ["de_vuong_luc", "chinh_duong_luc", "xanh_cay", "xanh_ngot", "luc_tao", "mac_thuy"].includes(c),
  );
  const hasYellowSpots = allColors.some((c) =>
    ["hong_phi", "hoang_tong_phi", "hoang_luc_phi"].includes(c),
  );

  let maxColorScore = allColors.reduce(
    (max, c) => Math.max(max, COLOR_SCORE[c] ?? 0),
    0,
  );

  if (
    allColors.includes("xuan_doi_tai") ||
    (allColors.some((c) => ["de_vuong_luc", "chinh_duong_luc", "xanh_cay", "luc_tao"].includes(c)) &&
      allColors.some((c) => ["tu_la_lan", "tim_ca", "tim_lam"].includes(c)))
  ) {
    maxColorScore = Math.max(maxColorScore, 92);
    warnings.push("✨ Xuân Đới Tài! Combo Lục + Tím là cực phẩm thiên nhiên, giá trị tăng vọt.");
  }

  const layoutCoeff: Record<string, number> = {
    solid: 1.0, hoa_bay: 0.85, loang: 0.9, multi: 1.05,
  };
  const toneCoeff: Record<number, number> = { 1: 0.6, 2: 0.8, 3: 1.0, 4: 1.2 };
  const grayPenalty = input.baseColors.includes("xam") ? 0.9 : 1.0;

  const sacScore =
    maxColorScore *
    layoutCoeff[input.colorLayout] *
    toneCoeff[input.colorTone] *
    grayPenalty;

  let wCot = 0.65, wSac = 0.35;
  if (isImperialCandidate && input.colorTone >= 3) {
    wCot = 0.3; wSac = 0.7;
  }

  const qScore = cotScore * wCot + sacScore * wSac;

  const riskMultiplier = adjustedFlawRisk(input.flaws, input.flawSize, qScore);

  let cLevel = 1.0;
  if (input.hasCertificate === "reputable") cLevel = 1.0;
  else if (input.hasCertificate === "unclear") cLevel = 0.85;
  else cLevel = 0.75;

  if (!input.hasVideo) cLevel = Math.max(0.6, cLevel - 0.15);
  if (input.hasCertificate === "none" && !input.hasVideo) {
    warnings.push("⚠️ Scam Alert: Không giấy, không video — Đây là tổ hợp rủi ro cao nhất. Yêu cầu ngay trước khi chốt!");
    cLevel = 0.6;
  }

  const lambda = 0.15;
  const fomoDecay = Math.exp(-lambda * input.sellerPressure);
  if (input.sellerPressure >= 2) {
    warnings.push(
      `🚨 Phát hiện ${input.sellerPressure} Red Flag thao túng tâm lý. Hệ thống đã giảm giá trị khuyến nghị xuống ${Math.round(fomoDecay * 100)}% để bảo vệ bạn.`,
    );
  }

  const kPhysic = niCoeff(input.ni) * SHAPE_COEFF[input.shape] * chotCoeff(input.chot);
  const vBase = getVBase(qScore);
  const vRaw = vBase * kPhysic * riskMultiplier * fomoDecay;
  const vCapped = applyHardCap(vRaw, qScore);
  const vFinal = vCapped * cLevel;

  const priceMin = Math.round((vFinal * Math.max(0.5, cLevel - 0.1)) / 100_000) * 100_000;
  const priceMax = Math.round((vFinal * (cLevel + 0.1)) / 100_000) * 100_000;

  if (isImperialCandidate && input.colorTone >= 3) {
    warnings.push("🚨 Ngọc Lục đạt độ này thuộc hàng cực phẩm (hàng trăm triệu đến tỷ). Nếu được chào dưới 10 triệu, 99% là ngọc nhuộm Type C hoặc đá giả!");
  }
  if (allColors.some((c) => ["tu_la_lan", "tim_ca", "tim_lam"].includes(c))) {
    warnings.push("⚠️ Ngọc ăn đèn: Sắc Tím/Lam trên app/livestream thường ảo hơn thực tế 30-50%. Yêu cầu video dưới nắng tự nhiên trước khi chốt!");
  }
  if (riskMultiplier <= 0.73) {
    healthWarning = "⛔ Cảnh báo cấu trúc: Vết nứt/sớ chéo nghiêm trọng. Vòng có nguy cơ gãy khi va đập. Cân nhắc kỹ trước khi đeo thường xuyên.";
  }
  if (input.shape === "khac_hoa") {
    warnings.push("🔍 Vòng khắc hoa thường dùng để che lỗi đá. Yêu cầu xem phần ngọc dưới họa tiết dưới đèn UV.");
  }

  const phongKetCau = getPhongKetCau(cotScore);
  const { truongPhai, truongPhaiDesc } = getTruongPhai(cotScore, sacScore, input, riskMultiplier);

  const radar = {
    doDong: Math.min(100, cotScore),
    sacDien: Math.min(100, sacScore),
    doLanhLan: Math.round(riskMultiplier * 100),
    damTay: Math.min(100, kPhysic * 80),
    thamMy: Math.min(100, cotScore * 0.4 + sacScore * 0.6),
  };

  const tags: string[] = [];
  if (isImperialCandidate) tags.push("💎 Lục Đế Vương");
  if (allColors.includes("xuan_doi_tai")) tags.push("🌺 Xuân Đới Tài");
  if (input.transparency >= 4) tags.push("❄️ Băng Chủng");
  if (input.colorLayout === "hoa_bay") tags.push("🌸 Hoa Bay");
  if (hasYellowSpots) tags.push("🏅 Hoàng Phỉ Tài Lộc");
  if (input.sellerPressure >= 2) tags.push("🚩 Red Flag x" + input.sellerPressure);

  return {
    priceMin,
    priceMax,
    qScore: Math.round(qScore),
    confidenceLevel: cLevel,
    phongKetCau,
    truongPhai,
    truongPhaiDesc,
    warnings,
    healthWarning,
    isImperialCandidate,
    tags,
    radar,
  };
}

function getPhongKetCau(cotScore: number): string {
  if (cotScore >= 85) return "Hoàng Hậu – Kính/Băng Chủng";
  if (cotScore >= 75) return "Quý Phi – Băng Chủng";
  if (cotScore >= 55) return "Phi Tần – Nếp Băng";
  if (cotScore >= 30) return "Quý Nhân – Nếp Mịn";
  return "Thường Tại – Chủng Đậu";
}

function getTruongPhai(
  cotScore: number,
  sacScore: number,
  input: JadeInput,
  riskMultiplier: number,
): { truongPhai: TruongPhai; truongPhaiDesc: string } {
  const isMultiColor =
    input.colorLayout === "multi" ||
    input.baseColors.includes("xuan_doi_tai") ||
    input.baseColors.includes("phuc_loc_tho");
  const isHoaBay = input.colorLayout === "hoa_bay";
  const hasSeriousFlaw = riskMultiplier < 0.8;
  const isRareColor = sacScore >= 70;
  const isThinSmall = input.chot < 10 || input.ni < 50;

  if (isMultiColor || isHoaBay) {
    return {
      truongPhai: "natures_canvas",
      truongPhaiDesc:
        "Phóng khoáng và không theo quy tắc. Mỗi vệt loang màu đều là nét vẽ ngẫu hứng của tự nhiên — chiếc vòng duy nhất trên đời không thể sao chép.",
    };
  }
  if (hasSeriousFlaw && isRareColor) {
    return {
      truongPhai: "bold_statement",
      truongPhaiDesc:
        'Vượt ra khỏi quy chuẩn thông thường. Sức hút nằm ở sắc độ đột phá, rực rỡ và duy nhất — chiếc vòng dành cho người chơi hệ "Gu mạnh".',
    };
  }
  if (isThinSmall && cotScore < 65) {
    return {
      truongPhai: "everyday_companion",
      truongPhaiDesc:
        "Thanh thoát, nhẹ nhàng và mang tính ứng dụng cao. Không phải chiếc vòng để cất tủ kính, mà là tri kỷ để mang theo mỗi ngày.",
    };
  }
  return {
    truongPhai: "classic_harmony",
    truongPhaiDesc:
      "Sự cân bằng hoàn hảo giữa Cốt và Sắc. Không có điểm nào quá chói lóa nhưng lại cực kỳ toàn vẹn — nền tảng vững chãi vượt thời gian.",
  };
}

export function formatPrice(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + " tỷ";
  if (n >= 1_000_000) return Math.round(n / 1_000_000) + " triệu";
  return n.toLocaleString("vi-VN") + " đ";
}
