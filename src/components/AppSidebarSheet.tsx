import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Home, Users, BookOpen, KeyRound, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

export default function AppSidebarSheet() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const submitCode = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 4) {
      toast.error("Mã không hợp lệ");
      return;
    }
    setOpen(false);
    navigate(`/vong/${trimmed}`);
  };

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Mở menu"
          className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-border hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0">
        <div className="h-full flex flex-col bg-background">
          <SheetHeader className="px-5 py-4 border-b border-border">
            <SheetTitle className="font-serif text-xl text-accent">Hiểu Ngọc</SheetTitle>
          </SheetHeader>

          {/* Code input section */}
          <div className="px-5 py-4 border-b border-border">
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-gold mb-2">
              <KeyRound className="h-3.5 w-3.5" />
              Nhập mã Cốp Ngọc
            </label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitCode()}
                placeholder="VD: ABC23XYZ"
                className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm uppercase tracking-wider focus:border-gold focus:outline-none"
              />
              <button
                onClick={submitCode}
                className="rounded-md bg-gold px-3 py-2 text-xs font-bold text-primary-foreground hover:bg-gold-dark transition-colors"
              >
                Mở
              </button>
            </div>
          </div>

          {/* Nav items — tabs & outlines style */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
            <SidebarItem to="/" onClick={close} icon={<Home className="h-4 w-4" />} label="Trang chủ" />
            <SidebarItem to="/phong-tra" onClick={close} icon={<Users className="h-4 w-4" />} label="Cộng đồng thẩm định" />
            <SidebarItem
              to="/#guides"
              onClick={() => {
                close();
                setTimeout(() => {
                  const el = document.getElementById("guides");
                  el?.scrollIntoView({ behavior: "smooth" });
                }, 200);
              }}
              icon={<BookOpen className="h-4 w-4" />}
              label="Cẩm nang"
            />
          </nav>

          <div className="px-5 py-3 border-t border-border text-[11px] text-muted-foreground text-center">
            © Hiểu Ngọc — Hồn ngọc, hồn người.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SidebarItem({
  to,
  onClick,
  icon,
  label,
}: {
  to: string;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border border-border bg-card hover:border-gold hover:bg-gold/5 transition-all group"
    >
      <span className="flex items-center gap-3">
        <span className="text-gold">{icon}</span>
        <span className="text-sm font-semibold text-foreground">{label}</span>
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-gold transition-colors" />
    </Link>
  );
}
