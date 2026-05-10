import { useId } from "react";
import type { VaultSegment } from "@/lib/jadeVault";

interface Props {
  segments: VaultSegment[];
  size?: number;
  hasPhieuHoa?: boolean;
  isMuna?: boolean;
}

const SEGMENTS = 12;
const VB = 280;
const CX = 140;
const CY = 140;
const OUTER_R = 120;
const INNER_R = 75;

function polar(r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function path(i: number) {
  const a0 = (i * 360) / SEGMENTS;
  const a1 = ((i + 1) * 360) / SEGMENTS;
  const oS = polar(OUTER_R, a0);
  const oE = polar(OUTER_R, a1);
  const iS = polar(INNER_R, a0);
  const iE = polar(INNER_R, a1);
  return `M ${oS.x} ${oS.y} A ${OUTER_R} ${OUTER_R} 0 0 1 ${oE.x} ${oE.y} L ${iE.x} ${iE.y} A ${INNER_R} ${INNER_R} 0 0 0 ${iS.x} ${iS.y} Z`;
}

export default function JadeRingMini({ segments, size = 90, hasPhieuHoa, isMuna }: Props) {
  const idBase = useId().replace(/[^a-zA-Z0-9]/g, "");
  const phieuId = `phv-${idBase}`;
  const clipId = `clip-${idBase}`;
  const veinColor = isMuna ? "#3a4a3a" : "#1a4331";

  const safe = segments.length === SEGMENTS
    ? segments
    : Array.from({ length: SEGMENTS }, () => ({ hex: "#e5e7eb", opacity: 1, colorName: "" }));

  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size} aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <path
            d={`M ${CX - OUTER_R},${CY} a ${OUTER_R},${OUTER_R} 0 1,0 ${OUTER_R * 2},0 a ${OUTER_R},${OUTER_R} 0 1,0 -${OUTER_R * 2},0 M ${CX - INNER_R},${CY} a ${INNER_R},${INNER_R} 0 1,1 ${INNER_R * 2},0 a ${INNER_R},${INNER_R} 0 1,1 -${INNER_R * 2},0`}
            fillRule="evenodd"
          />
        </clipPath>
        {hasPhieuHoa && (
          <filter id={phieuId} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06 0.045" numOctaves={5} seed={7} result="raw" />
            <feColorMatrix in="raw" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -1.2" result="mask" />
            <feFlood floodColor={veinColor} floodOpacity="1" result="cf" />
            <feComposite in="cf" in2="mask" operator="in" />
          </filter>
        )}
      </defs>

      {safe.map((seg, i) => (
        <path
          key={i}
          d={path(i)}
          fill={seg.hex}
          fillOpacity={seg.opacity}
          stroke="rgba(0,0,0,0.25)"
          strokeWidth={1}
        />
      ))}

      {hasPhieuHoa && (
        <g clipPath={`url(#${clipId})`} pointerEvents="none">
          <rect x="0" y="0" width={VB} height={VB} filter={`url(#${phieuId})`} opacity={0.6} />
        </g>
      )}
    </svg>
  );
}
