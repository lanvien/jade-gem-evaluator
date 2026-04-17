import { Link } from "react-router-dom";
import jadeBangle from "@/assets/jade/ui_hero_bangle.png";

const HeroSection = () => {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="flex-1 flex justify-center">
          <img
            src={jadeBangle}
            alt="Vòng ngọc phỉ thúy"
            width={400}
            height={400}
            className="w-64 md:w-96 animate-float drop-shadow-2xl"
          />
        </div>

        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground uppercase">
            Giải mã giá trị thực<br />
            <span className="text-accent">của Ngọc Phỉ Thúy</span>
          </h1>

          <p className="text-muted-foreground leading-relaxed max-w-lg">
            Hệ thống phân tích dữ liệu giúp bạn tự thẩm định chất lượng và định giá ngọc phỉ thúy (Jadeite) một cách khách quan, hoàn toàn miễn phí.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/assessment"
              className="inline-flex items-center justify-center rounded-lg bg-gold px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:bg-gold-dark transition-colors"
            >
              Định giá Phỉ thuỷ
            </Link>
            <button className="inline-flex items-center justify-center rounded-lg border-2 border-border bg-secondary px-8 py-3 text-sm font-bold text-secondary-foreground hover:bg-muted transition-colors">
              Kiểm tra Hạng ngọc (Type A/B/C)
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            *Lưu ý: Tính năng định giá áp dụng cho ngọc phỉ thúy tự nhiên hoàn toàn
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
