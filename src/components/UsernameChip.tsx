import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { getUsername } from "@/lib/username";
import UsernameModal from "./UsernameModal";

export default function UsernameChip() {
  const [name, setName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setName(getUsername());
    const onChange = (e: any) => setName(e.detail ?? getUsername());
    window.addEventListener("hieu-ngoc-username-changed", onChange);
    return () => window.removeEventListener("hieu-ngoc-username-changed", onChange);
  }, []);

  if (!name) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-dark hover:bg-gold/20 transition"
        title="Đổi danh xưng"
      >
        <span className="truncate max-w-[120px]">{name}</span>
        <Pencil size={12} />
      </button>
      <UsernameModal open={open} onOpenChange={setOpen} />
    </>
  );
}
