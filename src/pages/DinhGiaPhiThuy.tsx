import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Seo from "@/components/Seo";

const factors = [
  { title: "Độ xuyên sáng", text: "Mức ánh sáng đi qua thân vòng, từ trong suốt đến đục." },
  { title: "Cấu trúc vi hạt", text: "Độ mịn của hạt ngọc, yếu tố quyết định cảm giác “cốt” của vòng." },
  { title: "Màu sắc", text: "Sắc chính, độ đậm nhạt và cách màu phân bố quanh vòng." },
  { title: "Đặc điểm nội tại", text: "Hoa bay, chỉ màu, gân ngọc, các dạng sớ và vết nứt nếu có." },
  { title: "Hình dáng", text: "Kiểu vòng và độ dày, ảnh hưởng đến tính ứng dụng và giá trị." },
];

const steps = [
  "Trả lời các câu hỏi ngắn về đặc điểm vòng ngọc, có ảnh minh hoạ cho từng lựa chọn.",
  "Tô màu vòng trên mô phỏng để thể hiện sắc độ thực tế.",
  "Nhận phẩm cấp, phân tích chi tiết và khoảng giá tham khảo.",
];

const DinhGiaPhiThuy = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Định Giá Ngọc Phỉ Thúy Online | Hiểu Ngọc"
      description="Công cụ miễn phí giúp bạn phân tích đặc điểm vòng ngọc phỉ thúy như độ xuyên sáng, vi hạt, màu sắc, nội tại và nhận khoảng giá tham khảo."
      path="/dinh-gia-phi-thuy"
    />
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Định giá ngọc phỉ thúy - Hiểu Ngọc",
          url: "https://hieungoc.lovable.app/dinh-gia-phi-thuy",
          applicationCategory: "UtilitiesApplication",
          inLanguage: "vi",
          offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
        })}
      </script>
    </Helmet>
    <Header />
    <main className="container mx-auto px-6 py-12 md:py-20 max-w-4xl space-y-16">
      <section className="text-center space-y-6">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground uppercase leading-tight">
          Định giá ngọc phỉ thúy <span className="text-accent">online</span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Hiểu Ngọc giúp bạn tự đánh giá một chiếc vòng phỉ thúy dựa trên những đặc điểm mà người chơi ngọc vẫn
          quan sát, rồi đưa ra một khoảng giá tham khảo để bạn có thêm cơ sở trước khi mua hoặc bán.
        </p>
        <Link
          to="/assessment"
          className="inline-flex items-center justify-center rounded-md bg-gold px-12 py-5 font-serif text-lg font-bold uppercase tracking-wider text-primary-foreground shadow-lg hover:bg-gold-dark transition-colors"
        >
          Bắt đầu định giá
        </Link>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Cách công cụ hoạt động</h2>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4 rounded-xl border border-border bg-card p-5">
              <span className="font-serif text-2xl font-bold text-accent">{i + 1}</span>
              <p className="text-foreground leading-relaxed">{s}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Các yếu tố được phân tích</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {factors.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-serif text-lg font-bold text-accent mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-gold/40 bg-gold/5 p-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">Giới hạn của định giá qua ảnh và mô tả</h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
          <li>Kết quả chỉ là khoảng giá tham khảo, không thay thế giám định trực tiếp.</li>
          <li>Công cụ áp dụng cho ngọc phỉ thúy tự nhiên (Type A); không xác định được ngọc xử lý B/C.</li>
          <li>Ánh sáng, máy ảnh và cách quan sát có thể làm sai lệch màu sắc và độ trong.</li>
          <li>Giá thực tế còn phụ thuộc thị trường, nguồn gốc và thoả thuận giữa người mua và người bán.</li>
        </ul>
      </section>

      <section className="text-center space-y-4">
        <p className="text-muted-foreground">Muốn nghe thêm ý kiến? Ghé <Link to="/cong-dong" className="text-accent underline">cộng đồng Hiểu Ngọc</Link>.</p>
        <Link
          to="/assessment"
          className="inline-flex items-center justify-center rounded-md bg-gold px-10 py-4 font-serif text-base font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold-dark transition-colors"
        >
          Bắt đầu định giá
        </Link>
      </section>
    </main>
  </div>
);

export default DinhGiaPhiThuy;
