interface ColorRingAlertsProps {
  colors: string[];
}

interface AlertItem {
  match: (c: string) => boolean;
  messages: { text: string; type: "success" | "warning" | "info" }[];
}

const PURPLE_COLORS = ["#7b2d8b", "#6a1b9a", "#9c27b0", "#ab47bc", "#ce93d8", "#4a148c"];
const BLUE_COLORS = ["#1565c0", "#1976d2", "#2196f3", "#42a5f5", "#0d47a1"];
const GREEN_BRIGHT = ["#388e3c", "#66bb6a", "#2e7d32", "#4caf50", "#81c784"];
const YELLOW_COLORS = ["#c7b8a1", "#8b7355", "#f9a825", "#fbc02d", "#ff8f00", "#e65100", "#bf360c", "#d84315"];

const ALERTS: AlertItem[] = [
  {
    match: (c) => {
      const lower = c.toLowerCase();
      return PURPLE_COLORS.includes(lower) || BLUE_COLORS.includes(lower) || lower.includes("8b") || lower.includes("9c27");
    },
    messages: [
      { text: "✨ Sắc Tím Hoàng Gia (Tử La Lan)! Quyến rũ, quyền quý và hiếm có. Đây là sắc ngọc dành riêng cho những ai có gu thẩm mỹ độc bản!", type: "success" },
      { text: "⚠️ Cảnh báo \"Ngọc ăn đèn\": Sắc Tím/Lam trên app/livestream thường ảo và rực hơn thực tế 30-50%. Hãy yêu cầu xem video dưới nắng tự nhiên (không qua kính) trước khi chốt đơn!", type: "warning" },
    ],
  },
  {
    match: (c) => GREEN_BRIGHT.includes(c.toLowerCase()),
    messages: [
      { text: "💎 Chân ái của Phỉ Thúy! Tuyệt vời! Sắc Lục luôn giữ ngôi vương trong thế giới ngọc, mang lại sinh khí và sự sang trọng bậc nhất.", type: "success" },
      { text: "🚨 Báo động giá ảo! Ngọc đạt độ Lục này thuộc hàng cực phẩm sưu tầm (giá hàng trăm triệu đến cả tỷ đồng). Nếu bạn được chào giá dưới 10 triệu, 99% đây là ngọc nhuộm (Type C) hoặc đá giả.", type: "warning" },
    ],
  },
  {
    match: (c) => YELLOW_COLORS.includes(c.toLowerCase()),
    messages: [
      { text: "✨ Điểm cộng Tài lộc! Ngọc mang sắc Vàng/Đỏ (Hoàng/Phỉ) là biểu tượng mạnh mẽ của sự thịnh vượng và may mắn.", type: "success" },
      { text: "🔍 Mẹo test nhanh: Sắc vàng/nâu rất dễ nhầm với tạp chất. Hãy lướt móng tay qua vết màu đó — Trơn láng: phỉ tự nhiên (cộng điểm). Lợn cợn, cào móng: lỗi mắt cát/rỗ (trừ điểm).", type: "info" },
    ],
  },
];

const ColorRingAlerts = ({ colors }: ColorRingAlertsProps) => {
  const activeAlerts = ALERTS.filter((alert) => colors.some(alert.match));

  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      {activeAlerts.flatMap((alert, i) =>
        alert.messages.map((msg, j) => (
          <div
            key={`${i}-${j}`}
            className={`rounded-lg px-4 py-3 text-sm font-medium leading-relaxed ${
              msg.type === "warning"
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : msg.type === "success"
                ? "bg-jade-light/50 text-accent border border-accent/20"
                : "bg-gold/10 text-foreground border border-gold/30"
            }`}
          >
            {msg.text}
          </div>
        ))
      )}
    </div>
  );
};

export default ColorRingAlerts;
