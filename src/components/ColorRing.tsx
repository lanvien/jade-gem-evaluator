import { useId, useMemo, useState } from "react";
import { toast } from "sonner";

const SEGMENTS = 12;
const OUTER_R = 120;
const INNER_R = 75;
const CX = 140;
const CY = 140;

export type ColorTone = "light" | "medium" | "dark";
const TONE_OPACITY: Record<ColorTone, number> = { light: 0.4, medium: 0.75, dark: 1 };

const JADE_COLORS = [
  { group: "Lục sắc hệ", name: "Đế Vương Lục", hex: "#1B5E20" },
  { group: "Lục sắc hệ", name: "Chính Dương Lục", hex: "#2E7D32" },
  { group: "Lục sắc hệ", name: "Xanh Cay", hex: "#1A3A0A" },
  { group: "Lục sắc hệ", name: "Xanh Ngọt", hex: "#A5D6A7" },
  { group: "Lục sắc hệ", name: "Lục Táo", hex: "#66BB6A" },
  { group: "Lục sắc hệ", name: "Xanh Rau Bina", hex: "#2E5A1C" },
  { group: "Lục sắc hệ", name: "Đậu Lục", hex: "#558B2F" },
  { group: "Lục sắc hệ", name: "Thanh Thủy Lục", hex: "#26A69A" },
  { group: "Lục sắc hệ", name: "Du Thanh", hex: "#33691E" },
  { group: "Lục sắc hệ", name: "Hồi Lục", hex: "#78909C" },
  { group: "Lục sắc hệ", name: "Mặc Thúy", hex: "#1B2B1B" },
  { group: "Tử sắc hệ", name: "Tử La Lan", hex: "#CE93D8" },
  { group: "Tử sắc hệ", name: "Tím Cà", hex: "#7B1FA2" },
  { group: "Tử sắc hệ", name: "Tím Lam", hex: "#5C6BC0" },
  { group: "Hồng Hoàng sắc hệ", name: "Hồng Phỉ", hex: "#E53935" },
  { group: "Hồng Hoàng sắc hệ", name: "Hoàng Tông Phỉ", hex: "#FB8C00" },
  { group: "Hồng Hoàng sắc hệ", name: "Phấn Hồng", hex: "#F48FB1" },
  { group: "Lam sắc hệ", name: "Lam Thiên Không", hex: "#0277BD" },
  { group: "Lam sắc hệ", name: "Lam Thanh", hex: "#4FC3F7" },
  { group: "Lam sắc hệ", name: "Lão Lam Thủy", hex: "#1A3A5C" },
  { group: "Bạch Hắc sắc hệ", name: "Bạch Nguyệt Quang", hex: "#F5F5F5", noTone: true },
  { group: "Bạch Hắc sắc hệ", name: "Xương Gà Đen", hex: "#9E9E9E" },
  { group: "Bạch Hắc sắc hệ", name: "Mặc Thúy (Hắc)", hex: "#212121" },
  { group: "Đa sắc hệ", name: "Hoàng Lục Phỉ", special: true, colors: ["#F9A825", "#2E7D32"] },
  { group: "Đa sắc hệ", name: "Xuân Đới Thái", special: true, colors: ["#2E7D32", "#CE93D8"] },
  { group: "Đa sắc hệ", name: "Phúc Lộc Thọ", special: true, colors: ["#2E7D32", "#F9A825", "#CE93D8"] },
] as const;

type SwatchData = (typeof JADE_COLORS)[number];

const TONE_OPTIONS: { value: ColorTone; label: string }[] = [
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

interface ColorRingProps {
  value: string[];
  onChange: (colors: string[]) => void;
  /** key: segment index ("0".."11"), value: tone */
  tones?: Record<string, ColorTone>;
  onTonesChange?: (tones: Record<string, ColorTone>) => void;
  /** Optional AI context to drive overlays */
  aiContext?: {
    isMuna?: boolean;
    chungPeak?: string;
    hasBlackFlaw?: boolean;
  };
}

const findColorByHex = (hex: string): any =>
  (JADE_COLORS as readonly any[]).find((c) => !c.special && c.hex?.toLowerCase() === hex.toLowerCase());

const ColorRing = ({ value, onChange, tones = {}, onTonesChange, aiContext }: ColorRingProps) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentTone, setCurrentTone] = useState<ColorTone>("medium");
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const [phieuOn, setPhieuOn] = useState(false);
  const [phieuSeed, setPhieuSeed] = useState<number>(() => Math.floor(Math.random() * 1000));
  const filterIdBase = useId().replace(/[^a-zA-Z0-9]/g, "");

  const colors = value.length === SEGMENTS ? value : Array(SEGMENTS).fill("#e5e7eb");

  const grouped = useMemo(() => {
    const map = new Map<string, SwatchData[]>();
    JADE_COLORS.forEach((c) => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group)!.push(c);
    });
    return Array.from(map.entries());
  }, []);

  const paintSegment = (idx: number, hex: string, tone: ColorTone) => {
    const next = [...colors];
    next[idx] = hex;
    onChange(next);
    if (onTonesChange) onTonesChange({ ...tones, [String(idx)]: tone });
  };

  const handleSegmentClick = (idx: number) => {
    if (selectedColor) {
      const swatch = findColorByHex(selectedColor);
      const tone: ColorTone = swatch?.noTone ? "dark" : currentTone;
      paintSegment(idx, selectedColor, tone);
      setSelectedSegment(idx);
    } else if (colors[idx] !== "#e5e7eb") {
      setSelectedSegment(idx);
    }
  };

  const handleToneClick = (tone: ColorTone) => {
    if (selectedSegment !== null && colors[selectedSegment] !== "#e5e7eb") {
      const swatch = findColorByHex(colors[selectedSegment]);
      if (swatch?.noTone) return;
      if (onTonesChange) onTonesChange({ ...tones, [String(selectedSegment)]: tone });
    } else {
      setCurrentTone(tone);
    }
  };

  const fillAll = () => {
    if (!selectedColor) return;
    const swatch = findColorByHex(selectedColor);
    const tone: ColorTone = swatch?.noTone ? "dark" : currentTone;
    onChange(Array(SEGMENTS).fill(selectedColor));
    if (onTonesChange) {
      const next: Record<string, ColorTone> = { ...tones };
      for (let i = 0; i < SEGMENTS; i++) next[String(i)] = tone;
      onTonesChange(next);
    }
  };

  const segmentOpacity = (idx: number) => {
    const c = colors[idx];
    if (c === "#e5e7eb") return 1;
    const sw = findColorByHex(c);
    if (sw?.noTone) return 1;
    const t = tones[String(idx)] || "medium";
    return TONE_OPACITY[t];
  };

  // Phiêu hoa filter
  const isMuna = !!aiContext?.isMuna;
  const veinColor = isMuna ? "#3a4a3a" : "#1a4331";
  const phieuFilterId = `phieu-${filterIdBase}`;
  const clipId = `donut-clip-${filterIdBase}`;

  // Bông inclusion overlay selection
  const chungPeak = aiContext?.chungPeak || "";
  const showBongTrangNon = /Đậu/i.test(chungPeak);
  const showBongTuyetMuna = /Nếp Băng|Nếp Hóa/i.test(chungPeak) && isMuna;
  const showBongDen = !!aiContext?.hasBlackFlaw;

  const togglePhieu = () => {
    setPhieuOn((on) => {
      if (!on) setPhieuSeed(Math.floor(Math.random() * 10000));
      return !on;
    });
  };

  const activeToneForControls: ColorTone = (() => {
    if (selectedSegment !== null && colors[selectedSegment] !== "#e5e7eb") {
      return tones[String(selectedSegment)] || "medium";
    }
    return currentTone;
  })();

  const renderSwatch = (c: SwatchData) => {
    if ((c as any).special) {
      const cols = (c as any).colors as string[];
      const id = `grad-${filterIdBase}-${c.name.replace(/\s+/g, "")}`;
      return (
        <button
          key={c.name}
          type="button"
          onClick={() =>
            toast("Chọn từng màu riêng lẻ rồi tô vào các múi tương ứng", {
              description: c.name,
            })
          }
          title={c.name}
          className="group flex flex-col items-center w-[58px]"
        >
          <svg viewBox="0 0 36 36" className="w-9 h-9 rounded-full border-2 border-border group-hover:border-gold transition-all">
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                {cols.map((col, i) => (
                  <stop key={i} offset={`${(i / cols.length) * 100}%`} stopColor={col} />
                ))}
                {cols.map((col, i) => (
                  <stop key={`end${i}`} offset={`${((i + 1) / cols.length) * 100}%`} stopColor={col} />
                ))}
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="17" fill={`url(#${id})`} />
          </svg>
          <span className="text-[10px] text-foreground mt-1 text-center leading-tight">{c.name}</span>
        </button>
      );
    }
    const hex = (c as any).hex as string;
    const isSel = selectedColor === hex;
    return (
      <button
        key={c.name}
        type="button"
        onClick={() => setSelectedColor(hex)}
        title={c.name}
        className="group flex flex-col items-center w-[58px]"
      >
        <span
          className={`w-9 h-9 rounded-full border-2 transition-all ${
            isSel ? "border-gold scale-110 shadow-md" : "border-border group-hover:border-gold/60"
          }`}
          style={{ backgroundColor: hex }}
        />
        <span className="text-[10px] text-foreground mt-1 text-center leading-tight">{c.name}</span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
        {/* SVG Ring */}
        <div className="flex flex-col items-center mx-auto md:mx-0">
          <svg viewBox="0 0 280 280" className="w-56 h-56 md:w-64 md:h-64 shrink-0">
            <defs>
              <clipPath id={clipId}>
                <path
                  d={`M ${CX - OUTER_R},${CY} a ${OUTER_R},${OUTER_R} 0 1,0 ${OUTER_R * 2},0 a ${OUTER_R},${OUTER_R} 0 1,0 -${OUTER_R * 2},0 M ${CX - INNER_R},${CY} a ${INNER_R},${INNER_R} 0 1,1 ${INNER_R * 2},0 a ${INNER_R},${INNER_R} 0 1,1 -${INNER_R * 2},0`}
                  fillRule="evenodd"
                />
              </clipPath>

              {/* Phiêu hoa filter — monochrome single-color */}
              <filter id={phieuFilterId} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.06 0.045" numOctaves={5} seed={phieuSeed} result="raw" />
                <feColorMatrix
                  in="raw"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -1.2"
                  result="mask"
                />
                <feFlood floodColor={veinColor} floodOpacity="1" result="colorflood" />
                <feComposite in="colorflood" in2="mask" operator="in" />
              </filter>

              {/* Bông trắng non */}
              <filter id={`bong-non-${filterIdBase}`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves={2} seed={phieuSeed + 1} result="raw" />
                <feColorMatrix in="raw" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -1.2" result="mask" />
                <feFlood floodColor="#e8e8e8" floodOpacity="0.75" result="cf" />
                <feComposite in="cf" in2="mask" operator="in" />
              </filter>

              {/* Bông tuyết Muna */}
              <filter id={`bong-muna-${filterIdBase}`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves={1} seed={phieuSeed + 2} result="raw" />
                <feColorMatrix in="raw" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  8 0 0 0 -5.5" result="mask" />
                <feFlood floodColor="#ffffff" floodOpacity="0.9" result="cf" />
                <feComposite in="cf" in2="mask" operator="in" />
              </filter>

              {/* Bông đen */}
              <filter id={`bong-den-${filterIdBase}`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves={2} seed={phieuSeed + 3} result="raw" />
                <feColorMatrix in="raw" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -1.2" result="mask" />
                <feFlood floodColor="#1a1a1a" floodOpacity="0.6" result="cf" />
                <feComposite in="cf" in2="mask" operator="in" />
              </filter>
            </defs>

            {/* Base segments */}
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <path
                key={i}
                d={segmentPath(i)}
                fill={colors[i]}
                fillOpacity={segmentOpacity(i)}
                stroke={selectedSegment === i ? "hsl(var(--gold, 45 78% 52%))" : "hsl(var(--foreground))"}
                strokeWidth={selectedSegment === i ? 2.5 : 1.5}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleSegmentClick(i)}
              />
            ))}

            {/* Overlays clipped to donut */}
            <g clipPath={`url(#${clipId})`} pointerEvents="none">
              {phieuOn && (
                <rect x="0" y="0" width="280" height="280" filter={`url(#${phieuFilterId})`} opacity={0.65} />
              )}
              {showBongTrangNon && (
                <rect x="0" y="0" width="280" height="280" filter={`url(#bong-non-${filterIdBase})`} />
              )}
              {showBongTuyetMuna && (
                <rect x="0" y="0" width="280" height="280" filter={`url(#bong-muna-${filterIdBase})`} />
              )}
              {showBongDen && (
                <rect x="0" y="0" width="280" height="280" filter={`url(#bong-den-${filterIdBase})`} />
              )}
            </g>
          </svg>

          {/* Phiêu hoa toggle */}
          <button
            type="button"
            onClick={togglePhieu}
            className={`mt-3 inline-flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-xs font-semibold transition-all ${
              phieuOn
                ? "bg-gold text-primary-foreground border-gold"
                : "bg-card text-foreground border-border hover:border-gold"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${phieuOn ? "bg-primary-foreground" : "bg-muted-foreground"}`} />
            🌸 Phiêu hoa {phieuOn ? "ON" : "OFF"}
          </button>
        </div>

        {/* Palette */}
        <div className="flex-1 min-w-0 space-y-4">
          {grouped.map(([group, items]) => (
            <div key={group}>
              <p className="text-sm font-bold text-foreground mb-2">{group}</p>
              <div className="flex flex-wrap gap-2">
                {items.map(renderSwatch)}
              </div>
            </div>
          ))}

          <button
            onClick={fillAll}
            disabled={!selectedColor}
            className="mt-2 rounded-lg bg-gold px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-30 hover:bg-gold-dark transition-colors"
          >
            Tô tất cả
          </button>
        </div>
      </div>

      {/* Tone controls — always visible */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-2">
        <p className="text-sm font-semibold text-foreground">
          🎨 Độ đậm/nhạt
          {selectedSegment !== null && colors[selectedSegment] !== "#e5e7eb" ? (
            <span className="text-xs text-muted-foreground ml-2">— áp dụng cho múi #{selectedSegment + 1}</span>
          ) : (
            <span className="text-xs text-muted-foreground ml-2">— mặc định cho lần tô tiếp theo</span>
          )}
        </p>
        <div className="flex rounded-lg border border-border overflow-hidden w-fit">
          {TONE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleToneClick(opt.value)}
              className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeToneForControls === opt.value
                  ? "bg-gold text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {selectedSegment !== null && (
          <button
            type="button"
            onClick={() => setSelectedSegment(null)}
            className="text-xs text-muted-foreground underline hover:text-gold"
          >
            Bỏ chọn múi
          </button>
        )}
      </div>
    </div>
  );
};

export default ColorRing;
