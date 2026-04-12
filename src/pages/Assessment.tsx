import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "@/data/questions";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SectionDivider from "@/components/SectionDivider";
import ColorRing from "@/components/ColorRing";

const TOTAL = questions.length;

// Build ordered steps: divider before each new category, then questions
type Step = { type: "divider"; category: string } | { type: "question"; index: number };

function buildSteps(): Step[] {
  const steps: Step[] = [];
  let lastCat = "";
  questions.forEach((q, i) => {
    if (q.category !== lastCat) {
      steps.push({ type: "divider", category: q.category });
      lastCat = q.category;
    }
    steps.push({ type: "question", index: i });
  });
  return steps;
}

// Color-ring question id (question 3 = color distribution on ring)
const COLOR_RING_QUESTION_ID = 3;

const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-jade-light px-4 text-center animate-fade-in-up">
      <p className="text-lg font-semibold text-foreground mb-6">Loading...</p>
      <p className="font-serif italic text-lg text-foreground max-w-md leading-relaxed">
        "Ngọc dưỡng người 3 năm, người dưỡng ngọc một đời."
      </p>
      <p className="font-serif italic text-sm text-muted-foreground mt-2">
        Hãy thả lỏng tâm trí để bắt đầu hành trình hiểu Ngọc.
      </p>
    </div>
  );
};

const Assessment = () => {
  const navigate = useNavigate();
  const steps = useMemo(buildSteps, []);

  const [loading, setLoading] = useState(true);
  const [stepIdx, setStepIdx] = useState(() => {
    const saved = localStorage.getItem("jade-assessment-step");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("jade-assessment-answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [ringColors, setRingColors] = useState<string[]>(() => {
    const saved = localStorage.getItem("jade-ring-colors");
    return saved ? JSON.parse(saved) : Array(12).fill("#e5e7eb");
  });
  const [guideOpen, setGuideOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("jade-assessment-step", String(stepIdx));
    localStorage.setItem("jade-assessment-answers", JSON.stringify(answers));
    localStorage.setItem("jade-ring-colors", JSON.stringify(ringColors));
  }, [stepIdx, answers, ringColors]);

  const handleDividerDone = useCallback(() => {
    setStepIdx((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  if (loading) return <LoadingScreen onDone={() => setLoading(false)} />;

  const currentStep = steps[stepIdx];

  if (currentStep.type === "divider") {
    return <SectionDivider title={currentStep.category} onDone={handleDividerDone} />;
  }

  const qIndex = currentStep.index;
  const q = questions[qIndex];
  const selectedAnswer = answers[q.id];
  const questionNumber = qIndex + 1;
  const isColorRing = q.id === COLOR_RING_QUESTION_ID;

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
  };

  const next = () => {
    if (stepIdx < steps.length - 1) setStepIdx((s) => s + 1);
  };

  const prev = () => {
    // Go back, skipping dividers
    let target = stepIdx - 1;
    while (target >= 0 && steps[target].type === "divider") target--;
    if (target >= 0) setStepIdx(target);
  };

  const canGoNext = isColorRing ? ringColors.some((c) => c !== "#e5e7eb") : !!selectedAnswer;

  return (
    <div className="min-h-screen bg-background">
      {/* Progress */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-gold">{questionNumber}/{TOTAL}</span>
          <div />
        </div>
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-gold transition-all duration-300"
            style={{ width: `${(questionNumber / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in-up" key={stepIdx}>
        {/* Category */}
        <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-8">{q.category}</h2>

        {/* Question card */}
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <span className="text-sm text-gold font-semibold">{questionNumber}/{TOTAL}</span>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">{q.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Lightbulb className="h-4 w-4 text-gold" />
              Gợi ý: {q.hint}
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => setGuideOpen(true)}
              className="rounded-lg bg-gold px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-gold-dark transition-colors"
            >
              Hướng dẫn
            </button>
          </div>

          <div className="border-t border-border" />

          {isColorRing ? (
            <ColorRing value={ringColors} onChange={setRingColors} />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {q.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                    selectedAnswer === opt.id
                      ? "border-gold bg-gold/10 shadow-md"
                      : "border-border bg-card hover:border-gold/50"
                  }`}
                >
                  <div className="aspect-square rounded-md bg-muted mb-3" />
                  <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                  {opt.description && (
                    <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prev}
            disabled={qIndex === 0}
            className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground disabled:opacity-30 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>
          <button
            onClick={next}
            disabled={!canGoNext}
            className="flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-30 hover:bg-gold-dark transition-colors"
          >
            {questionNumber === TOTAL ? "Hoàn thành" : "Tiếp theo"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Guide Modal */}
      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif">Hướng dẫn</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            <p>Nội dung hướng dẫn sẽ được cập nhật sớm.</p>
            <p className="text-sm mt-2">Video hoặc hình ảnh hướng dẫn kỹ thuật soi đèn sẽ hiển thị tại đây.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assessment;
