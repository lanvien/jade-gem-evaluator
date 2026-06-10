import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Info } from "lucide-react";

export interface IntrinsicInfo {
  title: string;
  body: string;
}

export const INTRINSIC_INFO: Record<string, IntrinsicInfo> = {
  "van-ngoc": {
    title: "Vân ngọc — Hồn của đá",
    body:
      "Vân ngọc là dấu vết thời gian đọng lại trong cốt ngọc, tựa như những áng mây mỏng trôi giữa lòng đá. Vân càng nhẹ, càng tự nhiên thì càng tôn lên vẻ thanh thoát — phong thuỷ gọi đó là 'khí mạch' của ngọc.",
  },
  "gan-ngoc": {
    title: "Gân ngọc — Mạch sống của ngọc",
    body:
      "Gân là những đường tinh thể chạy theo cấu trúc khoáng. Nếu đường gân mảnh, đều, mướt tay thì là gân già, làm tôn thêm chiều sâu cho ngọc. Gân thô, lõm thì là gân non, dễ tạo cảm giác khô.",
  },
  "so-bong": {
    title: "Sớ bông — Đoá tuyết trong đá",
    body:
      "Sớ bông trông tựa cụm tuyết hay sợi bông mảnh nằm lửng giữa thân ngọc. Với người sành chơi, sớ bông tự nhiên là nét duyên — không phải khiếm khuyết, miễn là không sờ thấy cấn tay.",
  },
  "mat-cat": {
    title: "Mắt cát — Hạt sao trong cốt",
    body:
      "Mắt cát là các tinh thể li ti phản chiếu ánh sáng như hạt cát trên cát biển. Mật độ ít, phân bố thưa thì giữ được vẻ trong; nhiều quá sẽ khiến cốt ngọc đục và khô.",
  },
  "so-am": {
    title: "Sớ âm — Nét chìm khẽ khàng",
    body:
      "Sớ âm chỉ thấy được khi soi đèn xuyên, không cấn tay. Đây là vết hàn liền tự nhiên — không phải nứt — nhưng giá trị giảm nhẹ vì làm giảm độ trong tổng thể.",
  },
  "so-luoi-ga": {
    title: "Sớ lưỡi gà — Đường cong tế nhị",
    body:
      "Sớ uốn hình lưỡi gà, thường mảnh. Nếu chỉ là vệt mờ không cấn móng tay thì còn chấp nhận; nếu cấn rõ là mầm rạn, cần thận trọng khi đeo.",
  },
  "so-doc": {
    title: "Sớ dọc — Mạch chạy thẳng",
    body:
      "Sớ chạy dọc theo chiều cao vòng. Sớ dọc dài hơn 1/3 thân vòng và cấn tay là tín hiệu cảnh báo nứt tiềm tàng.",
  },
  "so-ngang-cheo": {
    title: "Sớ ngang/chéo — Lằn cắt thân vòng",
    body:
      "Sớ ngang hoặc chéo cắt qua thân vòng là điểm yếu kết cấu nguy hiểm nhất. Dù không cấn tay, vẫn nên cân nhắc kỹ trước khi giao dịch.",
  },
  "vet-nut": {
    title: "Vết nứt — Hồi chuông cảnh tỉnh",
    body:
      "Vết nứt sờ thấy rõ là dấu hiệu cấu trúc đã bị phá vỡ. Giá trị giảm sâu, và rủi ro vỡ khi va đập rất cao.",
  },
};

export default function IntrinsicInfoIcon({ id, label }: { id: string; label: string }) {
  const [open, setOpen] = useState(false);
  const info = INTRINSIC_INFO[id];
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`Xem mô tả ${label}`}
        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-gold hover:bg-gold/10 transition-colors"
      >
        <Info className="h-4 w-4" />
      </button>
      {info && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-foreground">{info.title}</DialogTitle>
              <DialogDescription className="text-base leading-relaxed text-foreground/80 pt-2 font-serif italic">
                {info.body}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
