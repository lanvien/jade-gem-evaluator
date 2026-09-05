import { useRef, useState, useEffect } from "react";

// 22 màu chuẩn, chia 5 nhóm
const COLOR_GROUPS: { group: string; items: { key: string; label: string; hex: string }[] }[] = [
  {
    group: "Lục",
    items: [
      { key: "de_vuong_luc",    label: "Đế Vương Lục",    hex: "#1a5c2a" },
      { key: "chinh_duong_luc", label: "Chính Dương Lục", hex: "#2d7a3a" },
      { key: "xanh_cay",        label: "Xanh Cay",        hex: "#1e6b30" },
      { key: "xanh_ngot",       label: "Xanh Ngọt",       hex: "#4a9e5c" },
      { key: "luc_tao",         label: "Lục Táo",         hex: "#6ab87a" },
      { key: "dau_luc",         label: "Đậu Lục",         hex: "#8bc99a" },
      { key: "thanh_thuy_luc",  label: "Thanh Thủy Lục",  hex: "#7ab5a8" },
      { key: "xanh_dau",        label: "Xanh Dầu",        hex: "#3d6b58" },
      { key: "hoi_luc",         label: "Hồi Lục",         hex: "#8aaa94" },
    ],
  },
  {
    group: "Tử",
    items: [
      { key: "tu_la_lan", label: "Tử La Lan", hex: "#b088c4" },
      { key: "tim_ca",    label: "Tím Cà",    hex: "#7a4fa0" },
      { key: "tim_lam",   label: "Tím Lam",   hex: "#7080c0" },
    ],
  },
  {
    group: "Lam",
    items: [
      { key: "lam_thien_khong", label: "Lam Thiên Không", hex: "#4a7fc4" },
      { key: "lam_thanh",       label: "Lam Thanh",       hex: "#7aaad4" },
      { key: "lao_lam_thuy",    label: "Lão Lam Thủy",    hex: "#6090a8" },
    ],
  },
  {
    group: "Hồng / Hoàng",
    items: [
      { key: "hong_phi",       label: "Hồng Phỉ",       hex: "#c45a3a" },
      { key: "hoang_tong_phi", label: "Hoàng Tông Phỉ", hex: "#c89040" },
    ],
  },
  {
    group: "Bạch hắc sắc",
    items: [
      { key: "mac_thuy",          label: "Mặc Thúy",          hex: "#1a1a2e" },
      { key: "bach_nguyet_quang", label: "Bạch Nguyệt Quang", hex: "#f0ece4" },
      { key: "trang_chao",        label: "Trắng Cháo",        hex: "#e8e2d8" },
      { key: "ga_den",            label: "Gà Đen",            hex: "#c8c0b0" },
      { key: "xam",               label: "Xám",               hex: "#a0a0a0" },
    ],
  },
];

const COLORS = COLOR_GROUPS.flatMap((g) => g.items);

const BRUSH_SIZES = [
  { label: "Chấm nhỏ", size: 12 },
  { label: "Vệt vừa",  size: 28 },
  { label: "Mảng lớn", size: 55 },
];

const COLOR_SCORE: Record<string, number> = {
  de_vuong_luc: 100, chinh_duong_luc: 95, xanh_cay: 92, xanh_ngot: 80,
  luc_tao: 70, dau_luc: 45, thanh_thuy_luc: 65, xanh_dau: 55, hoi_luc: 40,
  tu_la_lan: 90, tim_ca: 82, tim_lam: 65,
  lam_thien_khong: 75, lam_thanh: 60, lao_lam_thuy: 55,
  hong_phi: 72, hoang_tong_phi: 68,
  mac_thuy: 40, bach_nguyet_quang: 20, trang_chao: 15, ga_den: 12, xam: 8,
};

export interface JadeCanvasResult {
  baseColors: string[];
  colorLayout: "solid" | "hoa_bay" | "loang" | "multi";
  topColor: string;
  snapshot?: string;
}

interface JadeCanvasProps {
  onChange: (result: JadeCanvasResult) => void;
}

export default function JadeCanvas({ onChange }: JadeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [analysis, setAnalysis] = useState<JadeCanvasResult | null>(null);

  const SIZE = 260;
  const CX = SIZE / 2, CY = SIZE / 2;
  const R_OUT = 118, R_IN = 68;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#F5F0E8";
    ctx.fillRect(0, 0, SIZE, SIZE);
    drawRingOutline(ctx);
  }, []);

  function drawRingOutline(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, R_OUT, 0, Math.PI * 2);
    ctx.arc(CX, CY, R_IN, 0, Math.PI * 2, true);
    ctx.strokeStyle = "#5A3E2B";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function isInsideRing(x: number, y: number) {
    const d = Math.sqrt((x - CX) ** 2 + (y - CY) ** 2);
    return d >= R_IN && d <= R_OUT;
  }

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = SIZE / rect.width;
    const scaleY = SIZE / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function paint(x: number, y: number) {
    if (!isInsideRing(x, y)) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.save();
    ctx.beginPath();
    ctx.arc(CX, CY, R_OUT, 0, Math.PI * 2);
    ctx.arc(CX, CY, R_IN, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.fillStyle = selectedColor.hex;
    ctx.beginPath();
    ctx.arc(x, y, brushSize.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawRingOutline(ctx);
  }

  function onStart(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const snap = ctx.getImageData(0, 0, SIZE, SIZE);
    setHistory(h => [...h.slice(-19), snap]);
    setIsDrawing(true);
    const { x, y } = getPos(e);
    paint(x, y);
  }

  function onMove(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    paint(x, y);
  }

  function onEnd() {
    setIsDrawing(false);
    analyzeAndReport();
  }

  function undo() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.putImageData(prev, 0, 0);
    setHistory(h => h.slice(0, -1));
    analyzeAndReport();
  }

  function clear() {
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.fillStyle = "#F5F0E8";
    ctx.fillRect(0, 0, SIZE, SIZE);
    drawRingOutline(ctx);
    setHistory([]);
    const empty: JadeCanvasResult = { baseColors: ["trang_chao"], colorLayout: "solid", topColor: "trang_chao" };
    setAnalysis(empty);
    onChange(empty);
  }

  function snapColor(r: number, g: number, b: number): string | null {
    let best: string | null = null;
    let minD = 80;
    for (const c of COLORS) {
      const pr = parseInt(c.hex.slice(1, 3), 16);
      const pg = parseInt(c.hex.slice(3, 5), 16);
      const pb = parseInt(c.hex.slice(5, 7), 16);
      const d = Math.sqrt((r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2);
      if (d < minD) { minD = d; best = c.key; }
    }
    return best;
  }

  function analyzeAndReport() {
    const ctx = canvasRef.current!.getContext("2d")!;
    const imgData = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const counts: Record<string, number> = {};
    let totalColored = 0;

    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i], g = imgData[i + 1], b = imgData[i + 2], a = imgData[i + 3];
      if (a < 50) continue;
      if (r > 230 && g > 225 && b > 215) continue;
      const px = (i / 4) % SIZE, py = Math.floor((i / 4) / SIZE);
      const dist = Math.sqrt((px - CX) ** 2 + (py - CY) ** 2);
      if (dist < R_IN || dist > R_OUT) continue;

      const colorKey = snapColor(r, g, b);
      if (!colorKey) continue;
      counts[colorKey] = (counts[colorKey] || 0) + 1;
      totalColored++;
    }

    if (totalColored < 50) {
      const empty: JadeCanvasResult = { baseColors: ["trang_chao"], colorLayout: "solid", topColor: "trang_chao" };
      setAnalysis(empty);
      onChange(empty);
      return;
    }

    const rawSorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const MIN_SHARE = 0.02;
    const filtered = rawSorted.filter(([, count]) => count / totalColored >= MIN_SHARE);
    const sorted = filtered.length > 0 ? filtered : rawSorted;
    const topColor = sorted[0][0];
    const topPct = (sorted[0][1] / totalColored) * 100;
    const baseColors = sorted.slice(0, 3).map(([c]) => c);

    let colorLayout: JadeCanvasResult["colorLayout"];
    if (sorted.length >= 3) colorLayout = "multi";
    else if (topPct < 15) colorLayout = "hoa_bay";
    else if (topPct < 50) colorLayout = "loang";
    else colorLayout = "solid";

    const snapshot = canvasRef.current!.toDataURL("image/png");
    const result: JadeCanvasResult = { baseColors, colorLayout, topColor, snapshot };
    setAnalysis(result);
    onChange(result);
  }

  const LAYOUT_LABEL: Record<string, string> = {
    solid: "Trơn đều — ×1.0",
    loang: "Loang / Dải — ×0.9",
    hoa_bay: "Hoa bay — ×0.85",
    multi: "Đa sắc — ×1.05",
  };

  const topScore = analysis ? (COLOR_SCORE[analysis.topColor] ?? 0) : 0;

  return (
    <div className="space-y-5">
      {/* Hàng 1: Canvas + công cụ cọ */}
      <div className="flex gap-6 flex-wrap items-start">
        <div>
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            style={{
              borderRadius: 8, touchAction: "none", cursor: "crosshair",
              width: "min(260px, 90vw)", height: "min(260px, 90vw)",
            }}
            onMouseDown={onStart}
            onMouseMove={onMove}
            onMouseUp={onEnd}
            onMouseLeave={onEnd}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
          />
          <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 4 }}>
            Click hoặc kéo để tô màu lên vòng
          </p>
        </div>

        <div className="flex-1 min-w-[180px] space-y-3">
          <div>
            <p className="font-medium mb-1.5 text-sm">Kích thước cọ</p>
            <div className="flex gap-2 flex-wrap">
              {BRUSH_SIZES.map((b) => (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => setBrushSize(b)}
                  className="px-3 py-1.5 rounded-lg border-[1.5px] text-sm transition-colors"
                  style={{
                    borderColor: brushSize.label === b.label ? "#2A7A2A" : "#ccc",
                    background: brushSize.label === b.label ? "#E8F5E8" : "white",
                    fontWeight: brushSize.label === b.label ? 500 : 400,
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={undo}
              className="flex-1 py-2 rounded-lg border-[1.5px] border-border bg-card text-sm hover:bg-muted transition-colors"
            >
              ↩ Xóa bước
            </button>
            <button
              type="button"
              onClick={clear}
              className="flex-1 py-2 rounded-lg border-[1.5px] border-border bg-card text-sm hover:bg-muted transition-colors"
            >
              🗑 Xóa sạch
            </button>
          </div>
        </div>
      </div>

      {/* Hàng 2: Lưới màu chia 5 nhóm */}
      <div className="space-y-4">
        {COLOR_GROUPS.map((g) => (
          <div key={g.group}>
            <p className="text-sm font-semibold text-foreground/80 mb-2">{g.group}</p>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(76px, 1fr))" }}
            >
              {g.items.map((c) => {
                const active = selectedColor.key === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    title={c.label}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-colors"
                    style={{
                      border: active ? "2.5px solid #2A7A2A" : "1.5px solid #ddd",
                      background: active ? "#E8F5E8" : "white",
                    }}
                  >
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: 6,
                        background: c.hex, border: "1px solid #ccc",
                      }}
                    />
                    <span className="text-[10px] text-foreground/70 text-center leading-tight">
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hàng 3: Kết quả phân tích (dưới lưới màu, KHÔNG còn tiêu đề "Phân tích màu sắc") */}
      {analysis && (
        <div className="bg-[#F9F6F0] rounded-xl p-4 text-sm">
          <Row label="Màu đắt nhất" value={COLORS.find((c) => c.key === analysis.topColor)?.label ?? "—"} />
          <Row label="Điểm Base Hue" value={topScore > 0 ? String(topScore) : "—"} />
          <Row label="Layout tự phát hiện" value={LAYOUT_LABEL[analysis.colorLayout] ?? "—"} />
          <Row
            label="Màu tìm thấy"
            value={analysis.baseColors
              .map((k) => COLORS.find((c) => c.key === k)?.label ?? k)
              .join(", ")}
          />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-[#EEE] last:border-0">
      <span className="text-foreground/60">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
