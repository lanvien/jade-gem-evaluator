import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("jade-survey-data");
    if (data) setSurveyData(JSON.parse(data));
    const t = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center animate-fade-in-up">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-lg font-semibold text-foreground mb-4">Đang tính toán kết quả...</p>
        <p className="font-serif italic text-lg text-foreground max-w-md leading-relaxed">
          "Người biết ngọc, ngọc biết người."
        </p>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <p className="text-foreground mb-4">Không tìm thấy dữ liệu khảo sát.</p>
        <button
          onClick={() => navigate("/assessment")}
          className="rounded-lg bg-gold px-6 py-3 font-bold text-primary-foreground hover:bg-gold-dark transition-colors"
        >
          Bắt đầu định giá
        </button>
      </div>
    );
  }

  const answers = surveyData.answers || {};
  const numberInputs = surveyData.numberInputs || {};
  const answeredCount = Object.keys(answers).length + Object.keys(numberInputs).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl animate-fade-in-up">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
          Kết quả Định giá
        </h1>
        <p className="text-center text-muted-foreground mb-10">
          Dựa trên {answeredCount} tiêu chí đánh giá
        </p>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm space-y-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-4xl">💎</span>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Khoảng giá ước tính</p>
            <p className="font-serif text-3xl font-bold text-accent">Đang phát triển</p>
            <p className="text-xs text-muted-foreground mt-2">
              Hệ thống tính giá đang được hoàn thiện. Kết quả chi tiết sẽ sớm ra mắt.
            </p>
          </div>

          <div className="border-t border-border pt-6 space-y-3 text-left">
            <h3 className="font-serif text-lg font-bold text-foreground">Tóm tắt khảo sát</h3>
            {numberInputs[11] && (
              <p className="text-sm text-muted-foreground">Đường kính: <span className="text-foreground font-semibold">{numberInputs[11]}mm</span></p>
            )}
            {numberInputs[13] && (
              <p className="text-sm text-muted-foreground">Độ dày: <span className="text-foreground font-semibold">{numberInputs[13]}mm</span></p>
            )}
            <p className="text-sm text-muted-foreground">Số câu đã trả lời: <span className="text-foreground font-semibold">{answeredCount}/14</span></p>
          </div>
        </div>

        <div className="flex gap-4 mt-8 justify-center">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Về trang chủ
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("jade-assessment-step");
              localStorage.removeItem("jade-assessment-answers");
              localStorage.removeItem("jade-ring-colors");
              localStorage.removeItem("jade-number-inputs");
              localStorage.removeItem("jade-sub-checks");
              localStorage.removeItem("jade-survey-data");
              navigate("/assessment");
            }}
            className="rounded-lg bg-gold px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-gold-dark transition-colors"
          >
            Định giá lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
