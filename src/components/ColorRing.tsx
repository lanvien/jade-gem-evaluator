import { useState } from "react";

const SEGMENTS = 12;
const OUTER_R = 120;
const INNER_R = 75;
const CX = 140;
const CY = 140;

const BASE_COLORS = [
  { id: "bg1", color: "#2d6a4f", label: "Xanh đậm" },
  { id: "bg2", color: "#40916c", label: "Xanh lá" },
  { id: "bg3", color: "#52b788", label: "Xanh nhạt" },
  { id: "bg4", color: "#74c69d", label: "Xanh pastel" },
  { id: "bg5", color: "#95d5b2", label: "Xanh rất nhạt" },
  { id: "bg6", color: "#b7e4c7", label: "Xanh mint" },
  { id: "bg7", color: "#d8f3dc", label: "Trắng xanh" },
  { id: "bg8", color: "#f0f7f4", label: "Trắng ngà" },
  { id: "bg9", color: "#c7b8a1", label: "Nâu nhạt" },
  { id: "bg10", color: "#8b7355", label: "Nâu" },
];

const TOPPING_COLORS = [
  { id: "tp1", color: "#1b4332", label: "Xanh rêu đậm" },
  { id: "tp2", color: "#2d6a4f", label: "Xanh rêu" },
  { id: "tp3", color: "#388e3c", label: "Xanh lá cây" },
  { id: "tp4", color: "#66bb6a", label: "Xanh lá sáng" },
  { id: "tp5", color: "#a5d6a7", label: "Xanh lá nhạt" },
];

const TONE_OPTIONS: { value: "light" | "medium" | "dark"; label: string }[] = [
  { value: "light", label: "Nhạt" },
  { value: "medium", label: "Vừa" },
  { value: "dark", label: "Đậm" },
];

function polarToCart(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(index: number) {
  const startAngle = (index * 360) / SEGMENTS;
  const endAngle = ((index + 1) * 360) / SEGMENTS;
  const outerStart = polarToCart(CX, CY, OUTER_R, startAngle);
  const outerEnd = polarToCart(CX, CY, OUTER_R, endAngle);
  const innerStart = polarToCart(CX, CY, INNER_R, startAngle);
  const innerEnd = polarToCart(CX, CY, INNER_R, endAngle);
  return `M ${outerStart.x} ${outerStart.y} A ${OUTER_R} ${OUTER_R} 0 0 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A ${INNER_R} ${INNER_R} 0 0 0 ${innerStart.x} ${innerStart.y} Z`;
}

export type ColorTone = "light" | "medium" | "dark";

interface ColorRingProps {
  value: string[];
  onChange: (colors: string[]) => void;
  tones?: Record<string, ColorTone>;
  onTonesChange?: (tones: Record<string, ColorTone>) => void;
}

const ColorRing = ({ value, onChange, tones = {}, onTonesChange }: ColorRingProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const colors = value.length === SEGMENTS ? value : Array(SEGMENTS).fill("#e5e7eb");

  const handleSegmentClick = (index: number) => {
    if (!selectedColor) return;
    const next = [...colors];
    next[index] = selectedColor;
    onChange(next);
    // Initialize tone for this color if not set
    if (onTonesChange && !tones[selectedColor]) {
      onTonesChange({ ...tones, [selectedColor]: "medium" });
    }
  };

  const fillAll = () => {
    if (!selectedColor) return;
    onChange(Array(SEGMENTS).fill(selectedColor));
    if (onTonesChange && !tones[selectedColor]) {
      onTonesChange({ ...tones, [selectedColor]: "medium" });
    }
  };

  // Unique colors that have been applied (excluding default gray)
  const appliedColors = Array.from(new Set(colors.filter((c) => c !== "#e5e7eb")));

  const setTone = (color: string, tone: ColorTone) => {
    if (!onTonesChange) return;
    onTonesChange({ ...tones, [color]: tone });
  };

  const getColorLabel = (color: string) => {
    const all = [...BASE_COLORS, ...TOPPING_COLORS];
    return all.find((c) => c.color.toLowerCase() === color.toLowerCase())?.label || color;
  };

  // Tone → fill opacity (dark = full, medium = slight, light = more dim)
  const toneOpacity = (color: string) => {
    if (color === "#e5e7eb") return 1;
    const t = tones[color] || "medium";
    return t === "dark" ? 1 : t === "medium" ? 0.7 : 0.45;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* SVG Ring */}
        <svg viewBox="0 0 280 280" className="w-56 h-56 md:w-64 md:h-64 shrink-0">
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <path
              key={i}
              d={segmentPath(i)}
              fill={colors[i]}
              fillOpacity={toneOpacity(colors[i])}
              stroke="hsl(var(--foreground))"
              strokeWidth="1.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleSegmentClick(i)}
            />
          ))}
        </svg>

        {/* Palette */}
        <div className="space-y-4 flex-1 min-w-0">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Màu nền &gt;</p>
            <div className="flex flex-wrap gap-2">
              {BASE_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.color)}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${selectedColor === c.color ? "border-gold scale-110 shadow-md" : "border-border"}`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Topping hoa bay &gt;</p>
            <div className="flex flex-wrap gap-2">
              {TOPPING_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.color)}
                  className={`w-9 h-9 rounded border-2 transition-all ${selectedColor === c.color ? "border-gold scale-110 shadow-md" : "border-border"}`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <button
            onClick={fillAll}
            disabled={!selectedColor}
            className="mt-2 rounded-lg bg-gold px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-30 hover:bg-gold-dark transition-colors"
          >
            Tô tất cả
          </button>
        </div>
      </div>

      {/* Per-color tone segmented controls */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          appliedColors.length > 0 ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-sm font-semibold text-foreground">
            🎨 Độ đậm/nhạt của từng sắc đã tô:
          </p>
          {appliedColors.map((color) => (
            <div
              key={color}
              className="flex items-center justify-between gap-3 animate-fade-in-up"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-7 h-7 rounded-full border border-border shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-foreground truncate">
                  {getColorLabel(color)}
                </span>
              </div>
              <div className="flex rounded-lg border border-border overflow-hidden shrink-0">
                {TONE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTone(color, opt.value)}
                    className={`px-3 py-1 text-xs font-medium transition-colors ${
                      (tones[color] || "medium") === opt.value
                        ? "bg-gold text-primary-foreground"
                        : "bg-card text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorRing;
