import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { questions, SECTIONS } from "@/data/questions";
import { ArrowLeft, ArrowRight, Lightbulb, HelpCircle, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SectionDivider from "@/components/SectionDivider";
import ColorRing from "@/components/ColorRing";
import ColorRingAlerts from "@/components/assessment/ColorRingAlerts";

const TOTAL = questions.length;

type Step =
  | { type: "divider"; label: string }
  | { type: "question"; index: number };

function buildSteps(): Step[] {
  const steps: Step[] = [];
  const sectionMap = new Map(SECTIONS.map((s) => [s.before, s.label]));

  questions.forEach((q, i) => {
    const dividerLabel = sectionMap.get(q.id);
    if (dividerLabel) steps.push({ type: "divider", label: dividerLabel });
    steps.push({ type: "question", index: i });
  });
  return steps;
}

/* ── Loading Screen – Emerald dark bg, white text ── */
const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center animate-fade-in-up" style={{ backgroundColor: "hsl(150, 30%, 15%)" }}>
      <p className="text-xl font-bold text-white mb-8 tracking-wider">Loading...</p>
      <p className="font-serif italic text-lg text-white/90 max-w-md leading-relaxed">
        "Ngọc dưỡng người 3 năm, người dưỡng ngọc một đời."
      </p>
      <p className="font-serif italic text-sm text-white/60 mt-3">
        Hãy thả lỏng tâm trí để bắt đầu hành trình hiểu Ngọc.
      </p>
    </div>
  );
};

/* ── Number Input with helper ── */
const NumberInputQuestion = ({
  value,
  onChange,
  unit,
  helpText,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: string;
  helpText?: string;
}) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 justify-center">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập số..."
          className="w-32 rounded-lg border-2 border-border bg-card px-4 py-3 text-center text-lg font-semibold text-foreground focus:border-gold focus:outline-none transition-colors"
        />
        <span className="text-lg font-semibold text-muted-foreground">{unit}</span>
      </div>
      {helpText && (
        <div>
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-1 text-sm text-accent hover:underline mx-auto"
          >
            <HelpCircle className="h-4 w-4" />
            Cách đo
            <ChevronDown className={`h-3 w-3 transition-transform ${showHelp ? "rotate-180" : ""}`} />
          </button>
          {showHelp && (
            <div className="mt-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground animate-fade-in-up">
              {helpText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Main Component ── */
const Assessment = () => {
  const navigate = useNavigate();
  const steps = useMemo(buildSteps, []);

  const [loading, setLoading] = useState(true);
  const [stepIdx, setStepIdx] = useState(() => {
    const saved = localStorage.getItem("jade-assessment-step");
    const parsed = saved ? parseInt(saved, 10) : 0;
    return parsed >= 0 && parsed < steps.length ? parsed : 0;
  });
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("jade-assessment-answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [numberInputs, setNumberInputs] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem("jade-number-inputs");
    return saved ? JSON.parse(saved) : {};
  });
  const [subChecks, setSubChecks] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem("jade-sub-checks");
    return saved ? JSON.parse(saved) : {};
  });
  const [ringColors, setRingColors] = useState<string[]>(() => {
    const saved = localStorage.getItem("jade-ring-colors");
    return saved ? JSON.parse(saved) : Array(12).fill("#e5e7eb");
  });
  const [guideOpen, setGuideOpen] = useState(false);

  // Persist state
  useEffect(() => {
    localStorage.setItem("jade-assessment-step", String(stepIdx));
    localStorage.setItem("jade-assessment-answers", JSON.stringify(answers));
    localStorage.setItem("jade-ring-colors", JSON.stringify(ringColors));
    localStorage.setItem("jade-number-inputs", JSON.stringify(numberInputs));
    localStorage.setItem("jade-sub-checks", JSON.stringify(subChecks));
  }, [stepIdx, answers, ringColors, numberInputs, subChecks]);

  const handleDividerDone = useCallback(() => {
    setStepIdx((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  if (loading) return <LoadingScreen onDone={() => setLoading(false)} />;

  const currentStep = steps[stepIdx];

  if (currentStep.type === "divider") {
    return <SectionDivider title={currentStep.label} onDone={handleDividerDone} />;
  }

  const qIndex = currentStep.index;
  const q = questions[qIndex];
  const selectedAnswer = answers[q.id];
  const questionNumber = qIndex + 1;

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
  };

  const handleRescue = () => {
    if (q.rescueButton) handleSelect(q.rescueButton.autoSelectId);
  };

  const next = () => {
    if (questionNumber === TOTAL) {
      const surveyData = {
        answers,
        ringColors,
        numberInputs,
        subChecks,
      };
      localStorage.setItem("jade-survey-data", JSON.stringify(surveyData));
      navigate("/results");
      return;
    }
    if (stepIdx < steps.length - 1) setStepIdx((s) => s + 1);
  };

  const prev = () => {
    let target = stepIdx - 1;
    while (target >= 0 && steps[target].type === "divider") target--;
    if (target >= 0) setStepIdx(target);
  };

  const canGoNext = (() => {
    switch (q.type) {
      case "color-ring":
        return ringColors.some((c) => c !== "#e5e7eb");
      case "number-input":
        return !!(numberInputs[q.id] && parseFloat(numberInputs[q.id]) > 0);
      case "checkbox-legal":
      case "single-choice":
      case "card-style":
        return !!selectedAnswer;
      default:
        return !!selectedAnswer;
    }
  })();

  const showConditionalText =
    q.conditionalText && selectedAnswer && q.conditionalText.triggeredByIds.includes(selectedAnswer);

  const showSubCheckbox =
    q.subCheckbox && selectedAnswer && q.subCheckbox.triggeredByIds.includes(selectedAnswer);

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
        <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-8">{q.category}</h2>

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

          {q.type === "color-ring" && (
            <>
              <ColorRing value={ringColors} onChange={setRingColors} />
              <ColorRingAlerts colors={ringColors} />
            </>
          )}

          {q.type === "number-input" && (
            <NumberInputQuestion
              value={numberInputs[q.id] || ""}
              onChange={(v) => setNumberInputs((prev) => ({ ...prev, [q.id]: v }))}
              unit={q.inputUnit || "mm"}
              helpText={q.inputHelpText}
            />
          )}

          {(q.type === "single-choice" || q.type === "checkbox-legal") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="aspect-video rounded-md bg-muted mb-3" />
                  <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                  {opt.description && (
                    <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {q.type === "card-style" && (
            <div className="grid grid-cols-2 gap-4">
              {q.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`rounded-xl border-2 p-5 text-center transition-all hover:shadow-md ${
                    selectedAnswer === opt.id
                      ? "border-gold bg-gold/10 shadow-md"
                      : "border-border bg-card hover:border-gold/50"
                  }`}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted mb-3" />
                  <p className="text-sm font-bold text-foreground">{opt.label}</p>
                  {opt.description && (
                    <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {q.rescueButton && (
            <div className="text-center">
              <button
                onClick={handleRescue}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                🆘 {q.rescueButton.label}
              </button>
            </div>
          )}

          {showSubCheckbox && q.subCheckbox && (
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer animate-fade-in-up">
              <input
                type="checkbox"
                checked={!!subChecks[q.id]}
                onChange={(e) => setSubChecks((prev) => ({ ...prev, [q.id]: e.target.checked }))}
                className="rounded border-border text-gold focus:ring-gold"
              />
              {q.subCheckbox.label}
            </label>
          )}

          {showConditionalText && q.conditionalText && (
            <p className="text-sm text-gold font-medium animate-fade-in-up">
              {q.conditionalText.text}
            </p>
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
