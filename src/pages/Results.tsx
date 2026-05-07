// ─────────────────────────────────────────────────────────────
// Thay toàn bộ hàm computeResults trong Results.tsx bằng đoạn này
// Giữ nguyên mọi thứ khác trong file
// ─────────────────────────────────────────────────────────────

function computeResults(data: any) {
  const numberInputs = data.numberInputs || {};

  // 1. Chạy engine thật
  const jadeInput = buildJadeInputFromSurvey(data);
  const pricing = calculateJadePrice(jadeInput);

  // 2. Tính tierIndex từ qJade (thay avgScore)
  let tierIndex = 0;
  if (pricing.qJade >= 92)      tierIndex = 4; // Hoàng hậu
  else if (pricing.qJade >= 82) tierIndex = 3; // Quý phi
  else if (pricing.qJade >= 70) tierIndex = 2; // Phi tần
  else if (pricing.qJade >= 55) tierIndex = 1; // Quý nhân
  else                          tierIndex = 0; // Thường tại

  const tier = TIERS[tierIndex];

  // 3. Text phân tích dựa trên kết quả engine thật
  const cotText = `Phẩm ngọc đạt ${pricing.chungLabel}. ${
    pricing.scoreChung >= 75
      ? "Cấu trúc liên kết chặt chẽ, chất ngọc mướt mát, ngậm nước như sương sớm. Lựa chọn hoàn mỹ cho những ai tìm kiếm chiều sâu của ngọc với mức ngân sách tối ưu."
      : pricing.scoreChung >= 50
      ? "Hạt tinh thể mịn, ánh ngọc êm dịu. Phân khúc trung-cao, phù hợp đeo hàng ngày."
      : "Hạt tinh thể rõ nét, vẻ đẹp thuần mộc. Thích hợp cho người mới tìm hiểu ngọc."
  }`;

  const sacText = `Sở hữu sắc diện: ${pricing.colorLabel}. ${
    pricing.scoreSac >= 80
      ? "Màu sắc tươi tắn, vượng khí. Không màng đến sự rập khuôn, chính nét màu này thổi hồn vào khối đá, tạo nên tuyệt tác thiên nhiên không thể sao chép."
      : pricing.scoreSac >= 50
      ? "Màu sắc dịu dàng, thanh nhã, đem lại cảm giác thư thái khi ngắm nhìn."
      : "Màu sắc nhạt, nhã nhặn — phong cách tối giản, dễ phối đồ hàng ngày."
  }`;

  const hasStructuralFlaw = pricing.warnings.some(
    (w) => w.includes("nứt") || w.includes("Crack") || w.includes("Sớ")
  );
  const noiTaiText = hasStructuralFlaw
    ? "Ngọc quý ắt trải qua phong hóa, chút tỳ vết là lẽ thường. Vết sớ tự nhiên là bằng chứng nguồn gốc — và là chìa khóa vàng để bạn làm chủ cuộc thương lượng (kỳ vọng giảm 15-20% giá)."
    : "Ngọc sạch, ít tạp chất. Bề mặt và nội tại đạt tiêu chuẩn tốt, độ bền cao cho phân khúc này.";

  // 4. Độ hiếm động theo qJade
  const rarity =
    pricing.qJade >= 92 ? 3
    : pricing.qJade >= 82 ? 7
    : pricing.qJade >= 70 ? 15
    : pricing.qJade >= 55 ? 35
    : 60;

  const quotes: Record<string, string> = {
    "thuong-tai": "Nhan sắc thanh tú, an phận thủ thường, phù hợp để đeo cày deadline mỗi ngày. 😊",
    "quy-nhan":   "Ôn nhu hiền thục, sắc ngọc đoan trang – xứng danh người biết chọn ngọc.",
    "phi-tan":    "Phi tần kiều diễm, sắc ngọc vẹn toàn – xứng đáng chiếm trọn ánh nhìn.",
    "quy-phi":    "Quý phái tựa ngọc trong sương, sắc đẹp khiến người ta phải ngoái nhìn.",
    "hoang-hau":  "Mẫu nghi thiên hạ, ngọc quý hiếm có – xứng danh bảo vật truyền đời.",
  };

  // 5. Giữ lại diameter/thickness để ring SVG vẫn render đúng
  const diameter = parseFloat(numberInputs[9] || numberInputs[11]) || 56;
  const thickness = parseFloat(numberInputs[11] || numberInputs[13]) || 8;

  return {
    tier,
    tierIndex,
    priceLow:  pricing.minPrice,
    priceHigh: pricing.maxPrice,
    rarity,
    cotText,
    sacText,
    noiTaiText,
    quote: quotes[tier.key] ?? quotes["phi-tan"],
    diameter,
    thickness,
    pricing, // object đầy đủ, UI dùng r.pricing.* như cũ
  };
}
