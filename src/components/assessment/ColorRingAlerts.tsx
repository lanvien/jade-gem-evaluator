interface ColorRingAlertsProps {
  colors: string[];
}

const ALERTS: { color: string; match: (c: string) => boolean; message: string; type: "info" | "warning" | "success" }[] = [
  {
    color: "purple",
    match: (c) => {
      const lower = c.toLowerCase();
      return lower.includes("8b") || lower === "#7b2d8b" || lower === "#6a1b9a" || lower === "#9c27b0";
    },
    message: "💜 Ngọc ăn đèn – Cần kiểm tra kỹ dưới ánh sáng tự nhiên",
    type: "info",
  },
  {
    color: "green-bright",
    match: (c) => c === "#388e3c" || c === "#66bb6a" || c === "#2e7d32",
    message: "🟢 Lục quá sáng – Báo động giá ảo, cần xác minh nguồn gốc",
    type: "warning",
  },
  {
    color: "yellow",
    match: (c) => c === "#c7b8a1" || c === "#8b7355",
    message: "🟡 Có đốm vàng/nâu – Mẹo: test rỗ bằng cách soi đèn từ cạnh",
    type: "info",
  },
];

const ColorRingAlerts = ({ colors }: ColorRingAlertsProps) => {
  const activeAlerts = ALERTS.filter((alert) => colors.some(alert.match));

  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-2 mt-4">
      {activeAlerts.map((alert, i) => (
        <div
          key={i}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            alert.type === "warning"
              ? "bg-destructive/10 text-destructive border border-destructive/20"
              : "bg-accent/10 text-accent border border-accent/20"
          }`}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default ColorRingAlerts;
