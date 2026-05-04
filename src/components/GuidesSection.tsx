import { ArrowRight } from "lucide-react";

const guides = [
  { title: "Cách soi đèn ngọc", subtitle: "Kỹ thuật cơ bản" },
  { title: "Phân biệt Type A/B/C", subtitle: "Ngọc tự nhiên vs xử lý" },
  { title: "Đánh giá màu sắc", subtitle: "Thang đo chuyên gia" },
  { title: "Chọn vòng phù hợp", subtitle: "Theo kích cỡ & phong thủy" },
];

const GuidesSection = () => {
  return (
    <section id="guides" className="bg-beige-dark py-16 md:py-24">
      <div className="container mx-auto px-8 md:px-16">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-14">
          Cẩm nang cho người yêu Ngọc
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {guides.map((g, i) => (
            <div
              key={i}
              className="flex items-center gap-6 rounded-xl border border-border bg-card p-6 md:p-8 min-h-[140px] shadow-sm hover:shadow-md hover:border-gold transition-all cursor-pointer group"
            >
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-md bg-muted flex-shrink-0" />
              <div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground group-hover:text-accent transition-colors">{g.title}</h3>
                <p className="text-base text-muted-foreground mt-1">{g.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold tracking-wide text-primary-foreground hover:bg-gold-dark transition-colors">
            Xem thêm <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-12 max-w-3xl mx-auto">
          <div className="h-px flex-1 bg-border" />
          <span className="font-serif italic text-accent font-semibold">Hiểu ngọc</span>
        </div>
      </div>
    </section>
  );
};

export default GuidesSection;
