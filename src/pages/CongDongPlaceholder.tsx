import { Link } from "react-router-dom";
import { Users } from "lucide-react";

export default function CongDongPlaceholder() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <Users className="h-14 w-14 text-gold mb-5" />
      <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
        Phòng Trà Thưởng Ngọc
      </h1>
      <p className="text-muted-foreground max-w-md leading-relaxed">
        Nơi cộng đồng cùng thưởng lãm, bình phẩm những chiếc vòng đã được chia sẻ.
        <br />
        <span className="text-gold font-semibold">Sắp ra mắt</span> — hãy ghé lại sớm.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-gold-dark"
      >
        ← Về Trang chủ
      </Link>
    </div>
  );
}
