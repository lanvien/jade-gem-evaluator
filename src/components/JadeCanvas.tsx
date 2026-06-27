import { useRef, useState, useEffect } from "react";

const COLORS = [
  { key: "de_vuong_luc",  label: "Lục Đế Vương", hex: "#2A7A2A" },
  { key: "xanh_cay",      label: "Lục Cay",       hex: "#3DAA3D" },
  { key: "xanh_ngot",     label: "Lục Ngọt",      hex: "#6DC46D" },
  { key: "dau_luc",       label: "Đậu Lục",       hex: "#A8CCA8" },
  { key: "tu_la_lan",     label: "Tử La Lan",     hex: "#9B45C8" },
  { key: "tim_ca",        label: "Tím Cà",        hex: "#7B3F9E" },
  { key: "tim_lam",       label: "Tím Lam",       hex: "#6060CC" },
  { key: "lam",           label: "Lam",           hex: "#4A90D9" },
  { key: "vang",          label: "Vàng",          hex: "#E8B84B" },
  { key: "hong_phi",      label: "Hồng Phỉ",      hex: "#E85D7A" },
  { key: "den",           label: "Đen",           hex: "#2A2A2A" },
  { key: "trang",         label: "Trắng",         hex: "#F5F0E8" },
  { key: "xam",           label: "Xám",           hex: "#9E9E9E" },
];

const BRUSH_SIZES = [
  { label: "Chấm nhỏ", size: 12 },
  { label: "Vệt vừa",  size: 28 },
  { label: "Mảng lớn", size: 55 },
];

const COLOR_SCORE: Record<string, number> = {
  de_vuong_luc: 100, xanh_cay: 92, xanh_ngot: 80, dau_luc: 45,
  tu_la_lan: 90, tim_ca: 82, tim_lam: 65,
  lam: 75, vang: 60, hong_phi: 72,
  den: 40, trang: 10, xam: 8,
};

export interface JadeCanvasResult {
  baseColors: string[];
  colorLayout: "solid" | "hoa_bay" | "loang" | "multi";
  topColor: string;
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
    const empty: JadeCanvasResult = { baseColors: ["trang"], colorLayout: "solid", topColor: "trang" };
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
      const empty: JadeCanvasResult = { baseColors: ["trang"], colorLayout: "solid", topColor: "trang" };
      setAnalysis(empty);
      onChange(empty);
      return;
    }

    const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
    const topColor = sorted[0][0];
    const topPct = (sorted[0][1] / totalColored) * 100;
    const baseColors = sorted.slice(0, 3).map(([c]) => c);

    let colorLayout: JadeCanvasResult["colorLayout"];
    if (sorted.length >= 3) colorLayout = "multi";
    else if (topPct < 15) colorLayout = "hoa_bay";
    else if (topPct < 50) colorLayout = "loang";
    else colorLayout = "solid";

    const result: JadeCanvasResult = { baseColors, colorLayout, topColor };
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
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      <div>
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          style={{ borderRadius: 8, touchAction: "none", cursor: "crosshair",
            width: "min(260px, 90vw)", height: "min(260px, 90vw)" }}
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

      <div style={{ flex: 1, minWidth: 200 }}>
        <p style={{ fontWeight: 500, marginBottom: 6 }}>Kích thước cọ</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {BRUSH_SIZES.map(b => (
            <button key={b.label} type="button"
              onClick={() => setBrushSize(b)}
              style={{
                padding: "6px 12px", borderRadius: 8, border: "1.5px solid",
                borderColor: brushSize.label === b.label ? "#2A7A2A" : "#ccc",
                background: brushSize.label === b.label ? "#E8F5E8" : "white",
                fontWeight: brushSize.label === b.label ? 500 : 400,
                cursor: "pointer", fontSize: 13,
              }}>
              {b.label}
            </button>
          ))}
        </div>

        <p style={{ fontWeight: 500, marginBottom: 6 }}>Chọn màu</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
          {COLORS.map(c => (
            <button key={c.key} type="button" onClick={() => setSelectedColor(c)}
              title={c.label}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 4, padding: "8px 4px", borderRadius: 10,
                border: selectedColor.key === c.key ? "2.5px solid #2A7A2A" : "1.5px solid #ddd",
                background: selectedColor.key === c.key ? "#E8F5E8" : "white",
                cursor: "pointer",
              }}>
              <div style={{ width: 32, height: 32, borderRadius: 6,
                background: c.hex, border: "1px solid #ccc" }} />
              <span style={{ fontSize: 10, color: "#555", textAlign: "center", lineHeight: 1.2 }}>
                {c.label}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button type="button" onClick={undo} style={{ flex: 1, padding: "8px", borderRadius: 8,
            border: "1.5px solid #ddd", background: "white", cursor: "pointer" }}>
            ↩ Xóa bước
          </button>
          <button type="button" onClick={clear} style={{ flex: 1, padding: "8px", borderRadius: 8,
            border: "1.5px solid #ddd", background: "white", cursor: "pointer" }}>
            🗑 Xóa sạch
          </button>
        </div>

        {analysis && (
          <div style={{ background: "#F9F6F0", borderRadius: 10, padding: 14, fontSize: 13 }}>
            <p style={{ fontWeight: 500, marginBottom: 8 }}>Phân tích màu sắc</p>
            <Row label="Màu đắt nhất" value={COLORS.find(c => c.key === analysis.topColor)?.label ?? "—"} />
            <Row label="Điểm Base Hue" value={topScore > 0 ? String(topScore) : "—"} />
            <Row label="Layout tự phát hiện" value={LAYOUT_LABEL[analysis.colorLayout] ?? "—"} />
            <Row label="Màu tìm thấy" value={analysis.baseColors
              .map(k => COLORS.find(c => c.key === k)?.label ?? k).join(", ")} />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between",
      padding: "4px 0", borderBottom: "1px solid #EEE" }}>
      <span style={{ color: "#666" }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}
