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
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
          Cẩm nang cho người yêu Ngọc
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {guides.map((g, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md hover:border-gold transition-all cursor-pointer group"
            >
              <div className="h-20 w-20 rounded-md bg-muted flex-shrink-0" />
              <div>
                <h3 className="font-bold text-foreground group-hover:text-accent transition-colors">{g.title}</h3>
                <p className="text-sm text-muted-foreground">{g.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-gold-dark transition-colors">
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
