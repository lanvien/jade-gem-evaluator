import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { hasAssessmentInProgress, resetAssessmentSession } from "@/lib/resetAssessment";
import VaultIconButton from "@/components/jadevault/VaultIconButton";
import AppSidebarSheet from "@/components/AppSidebarSheet";
import UsernameChip from "@/components/UsernameChip";
import UsernameModal from "@/components/UsernameModal";
import { getUsername } from "@/lib/username";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [firstVisitOpen, setFirstVisitOpen] = useState(false);
  const navigate = useNavigate();

  // Trigger the "what should we call you?" modal on first visit ever.
  useEffect(() => {
    if (!getUsername()) {
      const t = setTimeout(() => setFirstVisitOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

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
        <div className="flex items-center gap-3">
          <AppSidebarSheet />
          <Link to="/" className="font-serif text-2xl font-bold text-accent">
            Hiểu Ngọc
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
          <a href="/assessment" onClick={guardedGoToAssessment} className="text-foreground hover:text-accent transition-colors cursor-pointer">Định giá phỉ thúy</a>
          <Link to="/cong-dong" className="text-foreground hover:text-accent transition-colors">Cộng đồng</Link>
          <a href="#mission" className="text-foreground hover:text-accent transition-colors">Về Hiểu Ngọc</a>
          <a href="#guides" className="text-foreground hover:text-accent transition-colors">Cẩm Nang</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <UsernameChip />
          <Link
            to="/jade-vault"
            className="text-sm font-semibold uppercase tracking-wider text-foreground hover:text-accent transition-colors"
          >
            Cốp ngọc
          </Link>
          <VaultIconButton />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <UsernameChip />
          <VaultIconButton />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground" aria-label="Mở menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in-up">
          <a href="/assessment" onClick={guardedGoToAssessment} className="block text-sm font-semibold uppercase cursor-pointer">Định giá phỉ thúy</a>
          <Link to="/cong-dong" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase">Cộng đồng</Link>
          <a href="#mission" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase">Về Hiểu Ngọc</a>
          <a href="#guides" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase">Cẩm Nang</a>
          <Link to="/jade-vault" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase text-accent">
            Cốp ngọc của tôi
          </Link>
        </nav>
      )}

      <UsernameModal open={firstVisitOpen} onOpenChange={setFirstVisitOpen} />
    </header>
  );
};

export default Header;
