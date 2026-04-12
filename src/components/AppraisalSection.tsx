import { Upload, Image } from "lucide-react";

const AppraisalSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="space-y-3 mb-10">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Thẩm định thực tế</h2>
        <p className="text-muted-foreground italic">
          Nơi cộng đồng chuyên gia định giá giúp bạn. Hoàn toàn ẩn danh, không lộ thông tin
        </p>
      </div>

      <div className="rounded-xl border-2 border-dashed border-border bg-card p-12 text-center space-y-4 hover:border-gold transition-colors cursor-pointer">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <p className="text-foreground font-medium flex items-center justify-center gap-2">
          <Image className="h-5 w-5" />
          Kéo thả hoặc chọn ảnh vòng của bạn tại đây.
        </p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Gợi ý: Hãy gửi ít nhất 3 ảnh (Ảnh tổng thể, ảnh soi đèn xuyên thấu, ảnh chụp cận cảnh sơ ngọc) để chuyên gia có cái nhìn chính xác nhất.
        </p>
      </div>
    </section>
  );
};

export default AppraisalSection;
