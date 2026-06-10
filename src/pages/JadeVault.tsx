import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useVaultItems,
  removeFromVault,
  updateVaultItem,
  formatVaultDate,
  type JadeItem,
} from "@/lib/jadeVault";
import JadeRingMini from "@/components/jadevault/JadeRingMini";

const SESSION_OPENED_KEY = "vaultOpened";
const GOLD = "#C9A84C";
const CREAM = "#E8D5A3";

// Dark Rosewood
const woodBg: React.CSSProperties = {
  backgroundColor: "#1a0f0a",
  backgroundImage: `
    repeating-linear-gradient(
      92deg,
      transparent,
      transparent 2px,
      rgba(80,35,10,0.18) 2px,
      rgba(80,35,10,0.18) 3px
    ),
    repeating-linear-gradient(
      180deg,
      transparent,
      transparent 40px,
      rgba(60,20,5,0.12) 40px,
      rgba(60,20,5,0.12) 41px
    )`,
};

export default function JadeVault() {
  const navigate = useNavigate();
  const [items] = useVaultItems();
  const [selected, setSelected] = useState<JadeItem | null>(null);
  const [lidGone, setLidGone] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_OPENED_KEY) === "1",
  );

  useEffect(() => {
    if (!lidGone) {
      const t = setTimeout(() => {
        setLidGone(true);
        sessionStorage.setItem(SESSION_OPENED_KEY, "1");
      }, 950);
      return () => clearTimeout(t);
    }
  }, [lidGone]);

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen relative" style={woodBg}>
      <header
        className="sticky top-0 z-30 backdrop-blur"
        style={{ backgroundColor: "rgba(10,6,3,0.85)", borderBottom: `1px solid ${GOLD}55` }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl md:text-2xl font-bold" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>
            ← Hiểu Ngọc
          </Link>
          <h1 className="font-serif text-base md:text-xl font-bold" style={{ color: GOLD, fontFamily: "'Playfair Display', Georgia, serif" }}>
            🏺 Cốp Ngọc
          </h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Lid overlay — slides up + fades out on first visit */}
      {!lidGone && (
        <div
          className="fixed inset-0 z-40 pointer-events-none"
          style={{ animation: "lidSlide 700ms ease-out forwards" }}
        >
          <svg viewBox="0 0 400 280" preserveAspectRatio="none" className="w-full h-[50vh]">
            <defs>
              <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a1d10" />
                <stop offset="50%" stopColor="#2a140a" />
                <stop offset="100%" stopColor="#1a0d06" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="400" height="280" fill="url(#lidGrad)" />
            <rect x="12" y="12" width="376" height="256" fill="none" stroke={GOLD} strokeWidth="2" opacity="0.85" />
            <rect x="22" y="22" width="356" height="236" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.5" />
            <circle cx="200" cy="140" r="14" fill="#704a28" stroke={GOLD} strokeWidth="2" />
            <circle cx="200" cy="140" r="4" fill={GOLD} />
          </svg>
        </div>
      )}

      <main
        className="container mx-auto max-w-5xl px-4 py-10"
        style={{ animation: lidGone ? "vaultFadeIn 300ms 0ms ease-out both" : undefined }}
      >
        {isEmpty && lidGone && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BoxIllustration />
            <p className="mt-6 text-lg max-w-sm" style={{ color: CREAM, fontFamily: "'Playfair Display', Georgia, serif" }}>
              Cốp ngọc của bạn đang trống.
              <br />
              Hãy định giá một chiếc vòng và cất vào đây.
            </p>
            <button
              onClick={() => navigate("/assessment")}
              className="mt-6 rounded-full px-7 py-3 font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: GOLD, color: "#1a0f0a" }}
            >
              Định giá vòng mới
            </button>
          </div>
        )}

        {!isEmpty && lidGone && (
          <div
            className="rounded-2xl p-4 md:p-6"
            style={{
              backgroundColor: "#2a1208",
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 0 4px #1a0f0a inset, 0 12px 50px rgba(0,0,0,0.65)`,
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  onClick={() => setSelected(it)}
                  className="vault-slot group relative rounded-xl flex flex-col items-center transition-transform hover:scale-[1.03]"
                  style={{
                    backgroundColor: "#5c1010",
                    boxShadow:
                      "inset 0 4px 12px rgba(0,0,0,0.6), inset 0 1px 3px rgba(0,0,0,0.8)",
                    border: `1.5px solid ${GOLD}`,
                    padding: "16px 12px 12px",
                    animation: `vaultRise 420ms ease-out ${idx * 70}ms both`,
                  }}
                >
                  <div
                    className="rounded-full overflow-hidden flex items-center justify-center"
                    style={{ width: 90, height: 90, filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.7))" }}
                  >
                    {it.userImage ? (
                      <img src={it.userImage} alt={it.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <JadeRingMini
                        segments={it.segments}
                        hasPhieuHoa={it.hasPhieuHoa}
                        isMuna={it.isMuna}
                        size={90}
                      />
                    )}
                  </div>
                  <p
                    className="text-sm md:text-base font-bold mt-2 truncate w-full"
                    style={{ color: CREAM, fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {it.name}
                  </p>
                  <p className="text-[11px]" style={{ color: GOLD }}>
                    {formatVaultDate(it.createdAt)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {selected && (
        <DetailSheet
          item={selected}
          onClose={() => setSelected(null)}
          onSave={(patch) => {
            updateVaultItem(selected.id, patch);
            setSelected({ ...selected, ...patch });
          }}
          onDelete={() => {
            if (window.confirm(`Xóa "${selected.name}" khỏi cốp?`)) {
              removeFromVault(selected.id);
              toast.success("Đã xóa khỏi cốp");
              setSelected(null);
            }
          }}
        />
      )}

      <style>{`
        @keyframes vaultRise {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes lidSlide {
          0%   { transform: translateY(0);     opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes vaultFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Cloud pattern in compartment corners */
        .vault-slot::before,
        .vault-slot::after {
          content: '';
          position: absolute;
          width: 28px; height: 28px;
          border: 2px solid ${GOLD};
          opacity: 0.18;
          pointer-events: none;
        }
        .vault-slot::before {
          top: 4px; left: 4px;
          border-right: none; border-bottom: none;
          border-top-left-radius: 14px;
        }
        .vault-slot::after {
          bottom: 4px; right: 4px;
          border-left: none; border-top: none;
          border-bottom-right-radius: 14px;
        }
      `}</style>
    </div>
  );
}

function BoxIllustration() {
  return (
    <div className="relative" style={{ width: 220, height: 160 }}>
      <div
        className="absolute left-2 right-2 bottom-0 h-24 rounded-md"
        style={{ backgroundColor: "#3a1d10", border: `2px solid ${GOLD}`, boxShadow: "inset 0 6px 14px rgba(0,0,0,0.6)" }}
      />
      <div
        className="absolute left-2 right-2 top-2 h-16 rounded-md"
        style={{ backgroundColor: "#4d2814", border: `2px solid ${GOLD}` }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2"
          style={{ borderColor: GOLD, backgroundColor: "#704a28" }}
        />
      </div>
    </div>
  );
}

function DetailSheet({
  item,
  onClose,
  onSave,
  onDelete,
}: {
  item: JadeItem;
  onClose: () => void;
  onSave: (patch: Partial<JadeItem>) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [notes, setNotes] = useState(item.notes);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl p-6 animate-fade-in-up"
        style={{ ...woodBg, border: `1px solid ${GOLD}`, color: CREAM }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3" style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.7))" }}>
          {item.userImage ? (
            <img
              src={item.userImage}
              alt={item.name}
              className="w-40 h-40 rounded-full object-cover border-2"
              style={{ borderColor: GOLD }}
            />
          ) : (
            <JadeRingMini
              segments={item.segments}
              hasPhieuHoa={item.hasPhieuHoa}
              isMuna={item.isMuna}
              size={160}
            />
          )}
          <label
            className="cursor-pointer text-xs px-3 py-1.5 rounded-md transition-opacity hover:opacity-90"
            style={{ border: `1px solid ${GOLD}`, color: GOLD }}
          >
            {item.userImage ? "📷 Đổi ảnh thật" : "📷 Tải ảnh thật của vòng"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 4 * 1024 * 1024) {
                  toast.error("Ảnh quá lớn (tối đa 4MB).");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  const dataUrl = reader.result as string;
                  onSave({ userImage: dataUrl });
                  toast.success("Đã lưu ảnh thật của vòng ✨");
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          {item.userImage && (
            <button
              onClick={() => onSave({ userImage: undefined })}
              className="text-[11px] underline"
              style={{ color: `${CREAM}99` }}
            >
              Xoá ảnh, dùng lại hoạ tiết SVG
            </button>
          )}
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name.trim() && onSave({ name: name.trim() })}
          className="mt-5 w-full bg-transparent text-center text-xl font-bold outline-none border-b"
          style={{ borderColor: `${GOLD}66`, color: CREAM, fontFamily: "'Playfair Display', Georgia, serif" }}
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onSave({ notes })}
          placeholder="Ghi chú về chiếc vòng..."
          rows={3}
          className="mt-4 w-full rounded-lg bg-transparent border p-3 text-sm outline-none"
          style={{ borderColor: `${GOLD}55`, color: CREAM }}
        />

        <div className="mt-5 space-y-2 text-sm">
          <Row k="Mã định danh" v={item.id} />
          <Row k="Ngày định giá" v={formatVaultDate(item.createdAt)} />
          <Row k="Chủng đỉnh / nền" v={`${item.assessment.chungPeak || "—"} / ${item.assessment.chungBase || "—"}`} />
          <Row k="Màu chủ" v={item.assessment.baseColor || "—"} />
          <Row k="Hình dạng" v={item.assessment.shape || "—"} />
          <Row k="Tỳ vết" v={item.assessment.flaws?.length ? item.assessment.flaws.join(", ") : "Không có"} />
          <Row k="Giá ước tính" v={item.assessment.estimatedPrice || "—"} />
        </div>

        {/* Share block */}
        <div
          className="mt-5 rounded-lg p-4"
          style={{ border: `1px solid ${GOLD}55`, backgroundColor: "rgba(201,168,76,0.06)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider" style={{ color: GOLD }}>
              Chia sẻ / Truy cập
            </span>
            <label className="inline-flex items-center gap-2 text-xs cursor-pointer" style={{ color: CREAM }}>
              <input
                type="checkbox"
                checked={item.isPublic !== false}
                onChange={(e) => onSave({ isPublic: e.target.checked })}
                className="accent-current"
              />
              Công khai bằng link
            </label>
          </div>
          <p className="font-mono text-base font-bold mt-2 tracking-widest" style={{ color: GOLD }}>
            {item.id}
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(item.id);
                toast.success("Đã copy mã code");
              }}
              className="flex-1 rounded-md py-1.5 text-xs font-semibold"
              style={{ border: `1px solid ${GOLD}`, color: CREAM }}
            >
              📋 Copy Code
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/vong/${item.id}`);
                toast.success("Đã copy link chia sẻ");
              }}
              className="flex-1 rounded-md py-1.5 text-xs font-semibold"
              style={{ border: `1px solid ${GOLD}`, color: CREAM }}
            >
              🔗 Copy Link
            </button>
          </div>
          <p className="text-[10px] mt-2 italic" style={{ color: `${CREAM}88` }}>
            * Hiện tại chỉ ai mở link trên cùng thiết bị mới xem được. Chia sẻ liên thiết bị sẽ có ở bước sau.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg py-2.5 font-semibold"
            style={{ border: `1px solid ${GOLD}`, color: CREAM }}
          >
            Đóng
          </button>
          <button
            onClick={onDelete}
            className="flex-1 rounded-lg py-2.5 font-semibold"
            style={{ backgroundColor: "#8B1A1A", color: "#fff" }}
          >
            Xóa khỏi Cốp
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-dashed py-1.5" style={{ borderColor: `${GOLD}33` }}>
      <span style={{ color: GOLD }}>{k}</span>
      <span className="text-right font-medium" style={{ color: CREAM }}>{v}</span>
    </div>
  );
}
