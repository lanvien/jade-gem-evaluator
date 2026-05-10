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

const SESSION_OPENED_KEY = "jadeVault:openedThisSession";

export default function JadeVault() {
  const navigate = useNavigate();
  const [items] = useVaultItems();
  const [selected, setSelected] = useState<JadeItem | null>(null);
  const [opened, setOpened] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_OPENED_KEY) === "1",
  );

  useEffect(() => {
    if (!opened) {
      const t = setTimeout(() => {
        setOpened(true);
        sessionStorage.setItem(SESSION_OPENED_KEY, "1");
      }, 1100);
      return () => clearTimeout(t);
    }
  }, [opened]);

  const isEmpty = items.length === 0;

  // Wood grain background via CSS gradients only
  const woodBg: React.CSSProperties = {
    backgroundColor: "#2b1d12",
    backgroundImage: `
      repeating-linear-gradient(
        90deg,
        rgba(255,255,255,0.02) 0 2px,
        rgba(0,0,0,0.05) 2px 6px,
        rgba(255,255,255,0.015) 6px 14px
      ),
      repeating-linear-gradient(
        180deg,
        rgba(0,0,0,0.08) 0 1px,
        transparent 1px 40px
      ),
      radial-gradient(ellipse at 30% 20%, #4a2f1c 0%, #2b1d12 60%, #1a1108 100%)
    `,
  };

  const GOLD = "#C9A84C";

  return (
    <div className="min-h-screen" style={woodBg}>
      <header className="sticky top-0 z-30 backdrop-blur" style={{ backgroundColor: "rgba(20,12,6,0.85)", borderBottom: `1px solid ${GOLD}55` }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl md:text-2xl font-bold" style={{ color: GOLD }}>
            ← Hiểu Ngọc
          </Link>
          <h1 className="font-serif text-base md:text-xl font-bold" style={{ color: GOLD }}>
            🏺 Cốp Ngọc
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-10">
        {/* Opening box animation */}
        {!opened && (
          <div className="flex flex-col items-center justify-center py-12">
            <BoxLid open={false} />
            <p className="mt-4 text-sm" style={{ color: GOLD }}>Đang mở cốp...</p>
          </div>
        )}

        {opened && isEmpty && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BoxLid open={false} />
            <p className="mt-6 text-lg max-w-sm" style={{ color: "#f5e8c8" }}>
              Cốp ngọc của bạn đang trống.
              <br />
              Hãy định giá một chiếc vòng và cất vào đây.
            </p>
            <button
              onClick={() => navigate("/assessment")}
              className="mt-6 rounded-full px-7 py-3 font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: GOLD, color: "#1a1108" }}
            >
              Định giá vòng mới
            </button>
          </div>
        )}

        {opened && !isEmpty && (
          <div
            className="rounded-2xl p-4 md:p-6"
            style={{
              backgroundColor: "#3a1a14",
              border: `2px solid ${GOLD}`,
              boxShadow: `0 0 0 4px #2b1d12 inset, 0 10px 40px rgba(0,0,0,0.5)`,
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {items.map((it, idx) => (
                <button
                  key={it.id}
                  onClick={() => setSelected(it)}
                  className="group relative rounded-xl p-4 flex flex-col items-center transition-transform hover:scale-[1.03]"
                  style={{
                    backgroundColor: "#8B1A1A",
                    boxShadow: "inset 0 4px 18px rgba(0,0,0,0.55), inset 0 -2px 8px rgba(0,0,0,0.4)",
                    border: `1px solid ${GOLD}66`,
                    animation: `vaultRise 420ms ease-out ${idx * 80}ms both`,
                  }}
                >
                  <div className="rounded-full p-1" style={{ backgroundColor: "rgba(0,0,0,0.25)" }}>
                    <JadeRingMini
                      segments={it.segments}
                      hasPhieuHoa={it.hasPhieuHoa}
                      isMuna={it.isMuna}
                      size={92}
                    />
                  </div>
                  <p className="font-serif text-sm md:text-base font-bold mt-2 truncate w-full" style={{ color: "#f9e6b8" }}>
                    {it.name}
                  </p>
                  <p className="text-[11px]" style={{ color: "#f9e6b888" }}>
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
        @keyframes lidOpen {
          0%   { transform: rotateX(0deg); }
          100% { transform: rotateX(-110deg); }
        }
        @keyframes innerGlow {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Wooden box illustration ───
function BoxLid({ open }: { open: boolean }) {
  const GOLD = "#C9A84C";
  return (
    <div className="relative" style={{ perspective: "800px", width: 220, height: 160 }}>
      {/* Inner glow */}
      <div
        className="absolute inset-x-4 top-10 bottom-2 rounded"
        style={{
          background: "radial-gradient(ellipse at center, #f9d77a 0%, #d49a2c 40%, transparent 70%)",
          opacity: open ? 1 : 0,
          animation: open ? "innerGlow 600ms ease-out forwards" : undefined,
        }}
      />
      {/* Box body */}
      <div
        className="absolute left-2 right-2 bottom-0 h-24 rounded-md"
        style={{
          backgroundColor: "#5a3a20",
          border: `2px solid ${GOLD}`,
          boxShadow: "inset 0 6px 14px rgba(0,0,0,0.4)",
        }}
      />
      {/* Lid */}
      <div
        className="absolute left-2 right-2 top-2 h-16 rounded-md origin-bottom"
        style={{
          backgroundColor: "#704a28",
          border: `2px solid ${GOLD}`,
          transformStyle: "preserve-3d",
          animation: "lidOpen 600ms ease-out forwards",
          animationPlayState: open ? "paused" : "running",
        }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2"
          style={{ borderColor: GOLD, backgroundColor: "#a07840" }} />
      </div>
    </div>
  );
}

// ─── Detail Sheet ───
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
  const GOLD = "#C9A84C";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl p-6 animate-fade-in-up"
        style={{ backgroundColor: "#1a1108", border: `1px solid ${GOLD}`, color: "#f5e8c8" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center">
          <JadeRingMini
            segments={item.segments}
            hasPhieuHoa={item.hasPhieuHoa}
            isMuna={item.isMuna}
            size={160}
          />
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name.trim() && onSave({ name: name.trim() })}
          className="mt-5 w-full bg-transparent text-center font-serif text-xl font-bold outline-none border-b"
          style={{ borderColor: `${GOLD}66`, color: "#f9e6b8" }}
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onSave({ notes })}
          placeholder="Ghi chú cá nhân..."
          rows={3}
          className="mt-4 w-full rounded-lg bg-transparent border p-3 text-sm outline-none focus:border-gold"
          style={{ borderColor: `${GOLD}55`, color: "#f5e8c8" }}
        />

        <div className="mt-5 space-y-2 text-sm" style={{ color: "#f5e8c8" }}>
          <Row k="ID" v={item.id} />
          <Row k="Ngày định giá" v={formatVaultDate(item.createdAt)} />
          <Row k="Chủng đỉnh / nền" v={`${item.assessment.chungPeak || "—"} / ${item.assessment.chungBase || "—"}`} />
          <Row k="Màu chủ" v={item.assessment.baseColor || "—"} />
          <Row k="Hình dạng" v={item.assessment.shape || "—"} />
          <Row k="Tỳ vết" v={item.assessment.flaws?.length ? item.assessment.flaws.join(", ") : "Không có"} />
          <Row k="Giá ước tính" v={item.assessment.estimatedPrice || "—"} />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg py-2.5 font-semibold"
            style={{ border: `1px solid ${GOLD}`, color: "#f9e6b8" }}
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
    <div className="flex justify-between gap-3 border-b border-dashed py-1.5" style={{ borderColor: "#C9A84C33" }}>
      <span className="opacity-70">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}
