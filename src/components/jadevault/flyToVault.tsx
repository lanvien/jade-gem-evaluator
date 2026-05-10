// Animates a mini SVG ring from a source rect to the vault icon (top-right).
import { createRoot } from "react-dom/client";
import JadeRingMini from "./JadeRingMini";
import type { VaultSegment } from "@/lib/jadeVault";

interface FlyOptions {
  segments: VaultSegment[];
  hasPhieuHoa: boolean;
  isMuna: boolean;
  onArrive?: () => void;
}

export function flyToVault(opts: FlyOptions) {
  if (typeof document === "undefined") return;

  const target = document.getElementById("vault-icon-anchor");
  const startX = window.innerWidth / 2 - 40;
  const startY = window.innerHeight / 2 - 40;
  let endX = window.innerWidth - 40;
  let endY = 30;

  if (target) {
    const r = target.getBoundingClientRect();
    endX = r.left + r.width / 2 - 12;
    endY = r.top + r.height / 2 - 12;
  }

  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:${startX}px;top:${startY}px;z-index:9999;pointer-events:none;width:80px;height:80px;`;
  document.body.appendChild(host);

  const root = createRoot(host);
  root.render(
    <JadeRingMini
      segments={opts.segments}
      hasPhieuHoa={opts.hasPhieuHoa}
      isMuna={opts.isMuna}
      size={80}
    />,
  );

  const dx = endX - startX;
  const dy = endY - startY;

  const anim = host.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.3}px) scale(0.7)`, opacity: 0.95, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0.9 },
    ],
    { duration: 900, easing: "cubic-bezier(.6,.05,.9,.4)", fill: "forwards" },
  );

  anim.onfinish = () => {
    if (target) {
      target.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.3)" },
          { transform: "scale(1)" },
        ],
        { duration: 380, easing: "ease-out" },
      );
    }
    root.unmount();
    host.remove();
    opts.onArrive?.();
  };
}
