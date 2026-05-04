import splash from "@/assets/jade/ui_splash_2.png";

const MissionSection = () => {
  return (
    <section id="mission" className="relative bg-beige-dark py-16 md:py-24 overflow-hidden">
      {/* Decorative splashes */}
      <img
        src={splash}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-8 w-56 md:w-72 opacity-60 select-none"
      />
      <img
        src={splash}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-0 w-64 md:w-80 opacity-50 -scale-x-100 select-none"
      />

      <div className="container mx-auto px-8 md:px-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-12 md:gap-16">
          <div className="md:col-span-1 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">Sứ mệnh</h2>
            <p className="font-serif italic text-lg text-muted-foreground">
              Nhìn thấu cốt ngọc<br />– định đúng giá trị.
            </p>
          </div>

          <div className="md:col-span-2 space-y-6 text-muted-foreground leading-relaxed text-justify pr-2 md:pr-8">
            <p>
              Thị trường ngọc Phỉ Thúy vốn mập mờ, nơi người mua thường phải đặt niềm tin vào cảm tính và những lời hoa mỹ. Chúng mình mong muốn thay đổi điều đó.
            </p>
            <p>
              Bằng cách đưa Toán học và Dữ liệu vào từng thớ đá, chúng mình mong muốn giúp bạn tự tìm thấy câu trả lời khách quan nhất. Không còn những con số mơ hồ, chỉ còn giá trị thực được minh bạch hóa.
            </p>
            <p>
              Dự án Hiểu Ngọc ra đời để minh bạch hóa thị trường bằng dữ liệu thực. Tại đây, bạn được tự do ẩn danh (không tài khoản), an toàn tuyệt đối (không lưu dữ liệu) và nhận kết quả khách quan 100% (độc lập và phi thương mại).
            </p>

            <div className="flex items-center gap-3 pt-4">
              <div className="h-px flex-1 bg-border" />
              <span className="font-serif text-accent font-bold text-xl">Hiểu ngọc</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
