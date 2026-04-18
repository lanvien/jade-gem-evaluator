import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import iconCopNgoc from "@/assets/jade/icon_copngoc.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-serif text-2xl font-bold text-accent">
          Hiểu ngọc
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold uppercase tracking-wider">
          <Link to="/assessment" className="text-foreground hover:text-accent transition-colors">Kiểm tra</Link>
          <a href="#mission" className="text-foreground hover:text-accent transition-colors">Về Hiểu Ngọc</a>
          <a href="#guides" className="text-foreground hover:text-accent transition-colors">Cẩm Nang</a>
        </nav>

        <Link
          to="/assessment"
          className="hidden md:flex items-center gap-3 rounded-full border-2 border-gold bg-background px-5 py-2 text-base font-semibold text-foreground animate-pulse-gentle hover:bg-gold hover:text-primary-foreground transition-colors"
        >
          Cốp ngọc của bạn
          <img src={iconCopNgoc} alt="" className="h-8 w-8 object-contain" />
        </Link>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-fade-in-up">
          <Link to="/assessment" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase">Kiểm tra</Link>
          <a href="#mission" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase">Về Hiểu Ngọc</a>
          <a href="#guides" onClick={() => setMobileOpen(false)} className="block text-sm font-semibold uppercase">Cẩm Nang</a>
          <Link
            to="/assessment"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-2 rounded-full border-2 border-gold px-4 py-2 text-base font-semibold"
          >
            Cốp ngọc của bạn
            <img src={iconCopNgoc} alt="" className="h-7 w-7 object-contain" />
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
