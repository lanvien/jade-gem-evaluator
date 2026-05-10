import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import iconCopNgoc from "@/assets/jade/icon_copngoc.png";
import { hasAssessmentInProgress, resetAssessmentSession } from "@/lib/resetAssessment";
import VaultIconButton from "@/components/jadevault/VaultIconButton";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const guardedGoToAssessment = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    if (hasAssessmentInProgress()) {
      const ok = window.confirm("Bạn có muốn hủy quá trình hiện tại để bắt đầu định giá mới không?");
      if (!ok) return;
      resetAssessmentSession();
    }
    navigate("/assessment");
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-serif text-2xl font-bold text-accent">
          Hiểu ngọc
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
          <a href="/assessment" onClick={guardedGoToAssessment} className="text-foreground hover:text-accent transition-colors cursor-pointer">Định giá phỉ thúy</a>
          <a href="#mission" className="text-foreground hover:text-accent transition-colors">Về Hiểu Ngọc</a>
          <a href="#guides" className="text-foreground hover:text-accent transition-colors">Cẩm Nang</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/assessment"
            onClick={guardedGoToAssessment}
            className="inline-flex items-center gap-2 rounded-full border-2 border-gold bg-background px-5 py-2 text-base font-semibold leading-none text-foreground animate-pulse-gentle hover:bg-gold hover:text-primary-foreground transition-colors cursor-pointer"
          >
            <span>Định giá ngay</span>
            <img src={iconCopNgoc} alt="" className="h-[1em] w-auto object-contain" />
          </a>
          <VaultIconButton />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <VaultIconButton />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in-up">
          <a href="/assessment" onClick={guardedGoToAssessment} className="block text-sm font-semibold uppercase cursor-pointer">Định giá phỉ thúy</a>
          <a href="#mission" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase">Về Hiểu Ngọc</a>
          <a href="#guides" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase">Cẩm Nang</a>
          <a
            href="/assessment"
            onClick={guardedGoToAssessment}
            className="inline-flex items-center gap-2 rounded-full border-2 border-gold px-4 py-2 text-base font-semibold leading-none cursor-pointer"
          >
            <span>Cốp ngọc của bạn</span>
            <img src={iconCopNgoc} alt="" className="h-[1em] w-auto object-contain" />
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
