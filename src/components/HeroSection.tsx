import { Link } from "react-router-dom";
import jadeBangle from "@/assets/jade/ui_hero_bangle.png";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-10 md:gap-16">
        {/* Image column — height matches text column via items-stretch */}
        <div className="flex justify-center md:justify-start items-stretch">
          <img
            src={jadeBangle}
            alt="Vòng ngọc phỉ thúy"
            className="h-full w-auto max-h-[640px] object-contain animate-float drop-shadow-2xl"
          />
        </div>

        {/* Text column */}
        <div className="flex flex-col justify-center text-center md:text-left space-y-7">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground uppercase">
            Giải mã giá trị thực<br />
            <span className="text-accent">của Ngọc Phỉ Thúy</span>
          </h1>

          <p className="font-sans text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
            Hệ thống phân tích dữ liệu giúp bạn tự thẩm định chất lượng và định giá ngọc phỉ thúy (Jadeite) một cách khách quan, hoàn toàn miễn phí.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/assessment"
              className="shimmer-cta relative overflow-hidden inline-flex items-center justify-center rounded-md bg-gold px-12 py-5 font-serif text-lg md:text-xl font-bold uppercase tracking-wider text-primary-foreground shadow-lg hover:bg-gold-dark transition-colors"
            >
              <span className="relative z-10">Định giá Phỉ Thuý</span>
            </Link>
            <button className="inline-flex items-center justify-center rounded-md border border-border bg-secondary px-10 py-4 font-serif text-base font-semibold tracking-wide text-secondary-foreground hover:bg-muted transition-colors">
              Kiểm tra Hạng ngọc (Type A/B/C)
            </button>
          </div>

          <p className="text-xs text-muted-foreground italic">
            *Lưu ý: Tính năng định giá áp dụng cho ngọc phỉ thúy tự nhiên hoàn toàn
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
