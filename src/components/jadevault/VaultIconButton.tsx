import { Link } from "react-router-dom";
import { useVaultCount } from "@/lib/jadeVault";

export default function VaultIconButton({ className = "" }: { className?: string }) {
  const count = useVaultCount();
  return (
    <Link
      to="/jade-vault"
      id="vault-icon-anchor"
      aria-label="Mở Cốp Ngọc"
      className={`relative inline-flex items-center justify-center rounded-full border-2 border-gold bg-background hover:bg-gold/10 transition-colors w-11 h-11 ${className}`}
    >
      <span className="text-xl leading-none" aria-hidden>🏺</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-gold text-primary-foreground text-[11px] font-bold flex items-center justify-center shadow">
          {count}
        </span>
      )}
    </Link>
  );
}
