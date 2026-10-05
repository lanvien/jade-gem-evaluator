import { Link } from "react-router-dom";
import splash from "@/assets/jade/ui_splash_3.png";
import SubmitJadeForm from "@/components/community/SubmitJadeForm";

const AppraisalSection = () => {
  return (
    <section className="relative container mx-auto px-4 py-16 md:py-24 overflow-hidden">
      <img
        src={splash}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-4 w-56 md:w-72 opacity-50 select-none"
      />
      <img
        src={splash}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-0 w-56 md:w-72 opacity-40 -scale-x-100 select-none"
      />

      <div className="relative max-w-2xl mx-auto">
        <div className="space-y-3 mb-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Gửi vòng lên Phòng Trà</h2>
          <p className="text-muted-foreground italic">
            Chia sẻ chiếc vòng của bạn để cộng đồng cùng thưởng lãm và góp ý. Hoàn toàn ẩn danh.{" "}
            <Link to="/cong-dong" className="text-accent underline not-italic">Xem Phòng Trà Thưởng Ngọc</Link>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6">
          <SubmitJadeForm />
        </div>
      </div>
    </section>
  );
};

export default AppraisalSection;
