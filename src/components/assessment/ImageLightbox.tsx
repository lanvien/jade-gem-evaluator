import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  caption?: string;
  onClose: () => void;
}

const ImageLightbox = ({ src, caption, onClose }: Props) => {
  const [scale, setScale] = useState(1);
  const [startY, setStartY] = useState<number | null>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [closing, setClosing] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 250);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Basic pinch-to-zoom detection
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setScale(Math.max(1, Math.min(3, dist / 200)));
    } else if (e.touches.length === 1 && startY !== null) {
      const dy = e.touches[0].clientY - startY;
      setOffsetY(dy);
    }
  };

  const handleTouchEnd = () => {
    if (Math.abs(offsetY) > 100) {
      handleClose();
    } else {
      setOffsetY(0);
    }
    setStartY(null);
    if (scale < 1.2) setScale(1);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-250 ${
        closing ? "opacity-0" : "opacity-100"
      }`}
      onClick={handleClose}
      style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <div
        ref={imgRef}
        className="relative max-w-[90vw] max-h-[80vh] transition-transform duration-150"
        style={{
          transform: `translateY(${offsetY}px) scale(${scale})`,
          opacity: 1 - Math.abs(offsetY) / 400,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="rounded-xl overflow-hidden bg-card shadow-2xl">
          <div className="aspect-video bg-muted flex items-center justify-center min-w-[280px]">
            {src ? (
              <img src={src} alt={caption || ""} className="w-full h-full object-contain" />
            ) : (
              <span className="text-muted-foreground text-sm">Ảnh minh họa</span>
            )}
          </div>
          {caption && (
            <div className="px-4 py-3 bg-card/90">
              <p className="text-sm text-foreground text-center">{caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;
