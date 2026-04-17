import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { questions, SECTIONS } from "@/data/questions";
import { ArrowLeft, ArrowRight, Lightbulb, ZoomIn } from "lucide-react";
import SectionDivider from "@/components/SectionDivider";
import ColorRing, { ColorTone } from "@/components/ColorRing";
import ColorRingAlerts from "@/components/assessment/ColorRingAlerts";
import PatternStructure, { PatternData } from "@/components/assessment/PatternStructure";
import ImageLightbox from "@/components/assessment/ImageLightbox";

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

/* ── Loading Screen ── */
const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center animate-fade-in-up"
      style={{ backgroundColor: "#002f14" }}
    >
      <p className="text-xl font-bold text-white mb-8 tracking-wider">Loading...</p>
      <p className="font-serif italic text-lg text-white max-w-md leading-relaxed">
        "Ngọc dưỡng người 3 năm, người dưỡng ngọc một đời."
      </p>
      <p className="font-serif italic text-sm text-white/70 mt-3">
        Hãy thả lỏng tâm trí để bắt đầu hành trình hiểu Ngọc.
      </p>
    </div>
  );
};

/* ── Number Input ── */
const NumberInputQuestion = ({
  value,
  onChange,
  unit,
}: {
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) => (
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
);

const EMPTY_PATTERN: PatternData = {
  groupA: {},
  groupB: {},
};

/* ── Main Component ── */
const Assessment = () => {
  const navigate = useNavigate();
  const steps = useMemo(buildSteps, []);

  const [loading, setLoading] = useState(true);
  const [stepIdx, setStepIdx] = useState(() => {
    const saved = localStorage.getItem("jade-assessment-step");
    const parsed = saved ? parseInt(saved, 10) : 0;
    return parsed >= 0 && parsed < buildSteps().length ? parsed : 0;
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
  const [colorTones, setColorTones] = useState<Record<string, ColorTone>>(() => {
    const saved = localStorage.getItem("jade-color-tones");
    return saved ? JSON.parse(saved) : {};
  });
  const [patternData, setPatternData] = useState<PatternData>(() => {
    const saved = localStorage.getItem("jade-pattern-data");
    return saved ? JSON.parse(saved) : EMPTY_PATTERN;
  });
  const [lightboxImg, setLightboxImg] = useState<{ src: string; caption: string } | null>(null);

  // Persist state
  useEffect(() => {
    localStorage.setItem("jade-assessment-step", String(stepIdx));
    localStorage.setItem("jade-assessment-answers", JSON.stringify(answers));
    localStorage.setItem("jade-ring-colors", JSON.stringify(ringColors));
    localStorage.setItem("jade-color-tones", JSON.stringify(colorTones));
    localStorage.setItem("jade-number-inputs", JSON.stringify(numberInputs));
    localStorage.setItem("jade-sub-checks", JSON.stringify(subChecks));
    localStorage.setItem("jade-pattern-data", JSON.stringify(patternData));
  }, [stepIdx, answers, ringColors, colorTones, numberInputs, subChecks, patternData]);

  const handleDividerDone = useCallback(() => {
    setStepIdx((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const next = useCallback(() => {
    const currentStep = steps[stepIdx];
    if (currentStep.type !== "question") return;
    const qIndex = currentStep.index;
    const questionNumber = qIndex + 1;

    if (questionNumber === TOTAL) {
      const surveyData = { answers, ringColors, colorTones, numberInputs, subChecks, patternData };
      localStorage.setItem("jade-survey-data", JSON.stringify(surveyData));
      navigate("/results");
      return;
    }
    if (stepIdx < steps.length - 1) setStepIdx((s) => s + 1);
  }, [stepIdx, steps, answers, ringColors, colorTones, numberInputs, subChecks, patternData, navigate]);

  if (loading) return <LoadingScreen onDone={() => setLoading(false)} />;

  const currentStep = steps[stepIdx];

  if (currentStep.type === "divider") {
    return <SectionDivider title={currentStep.label} onDone={handleDividerDone} />;
  }

  const qIndex = currentStep.index;
  const q = questions[qIndex];
  const selectedAnswer = answers[q.id];
  const questionNumber = qIndex + 1;

  const isAutoAdvance = q.type === "single-choice" || q.type === "surface-check" || q.type === "card-style";

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));

    // Auto-advance
    if (isAutoAdvance) {
      setTimeout(() => {
        if (questionNumber === TOTAL) {
          const surveyData = {
            answers: { ...answers, [q.id]: optionId },
            ringColors,
            colorTones,
            numberInputs,
            subChecks,
            patternData,
          };
          localStorage.setItem("jade-survey-data", JSON.stringify(surveyData));
          navigate("/results");
        } else if (stepIdx < steps.length - 1) {
          setStepIdx((s) => s + 1);
        }
      }, 350);
    }
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
      case "pattern-structure":
        return true;
      case "checkbox-legal":
      case "single-choice":
      case "card-style":
      case "surface-check":
        return !!selectedAnswer;
      default:
        return !!selectedAnswer;
    }
  })();

  const showConditionalText =
    q.conditionalText && selectedAnswer && q.conditionalText.triggeredByIds.includes(selectedAnswer);

  // Always show Group B (Structural Warnings) — exclusive logic in PatternStructure
  // resets selections but tab stays visible per user feedback.
  const isSurfaceSmooth = false;

  const openLightbox = (src: string, caption: string) => {
    setLightboxImg({ src, caption });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-gold">
            {questionNumber}/{TOTAL}
          </span>
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
        <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <span className="text-sm text-gold font-semibold">
              {questionNumber}/{TOTAL}
            </span>
            <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">{q.title}</h3>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Lightbulb className="h-4 w-4 text-gold" />
              {q.hint}
            </p>
          </div>

          <div className="border-t border-border" />

          {/* Color Ring */}
          {q.type === "color-ring" && (
            <>
              <ColorRing
                value={ringColors}
                onChange={setRingColors}
                tones={colorTones}
                onTonesChange={setColorTones}
              />
              <ColorRingAlerts colors={ringColors} />
            </>
          )}

          {/* Number Input */}
          {q.type === "number-input" && (
            <NumberInputQuestion
              value={numberInputs[q.id] || ""}
              onChange={(v) => setNumberInputs((prev) => ({ ...prev, [q.id]: v }))}
              unit={q.inputUnit || "mm"}
            />
          )}

          {/* Single Choice & Surface Check & Checkbox Legal */}
          {(q.type === "single-choice" || q.type === "checkbox-legal" || q.type === "surface-check") && (
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
                  {/* Image - tap to open lightbox */}
                  <div
                    className="aspect-video rounded-md bg-muted mb-3 overflow-hidden flex items-center justify-center cursor-zoom-in relative group"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (opt.image) openLightbox(opt.image, `${opt.label}${opt.description ? ` — ${opt.description}` : ""}`);
                    }}
                  >
                    {opt.image ? (
                      <>
                        <img
                          src={opt.image}
                          alt={opt.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1.5 right-1.5 bg-background/80 rounded-full p-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="h-3.5 w-3.5 text-foreground" />
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">Ảnh minh họa</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                  {opt.description && (
                    <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Card Style */}
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

          {/* Pattern Structure */}
          {q.type === "pattern-structure" && (
            <PatternStructure
              value={patternData}
              onChange={setPatternData}
              surfaceSmooth={isSurfaceSmooth}
            />
          )}

          {/* Conditional text */}
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
          {/* Hide "Next" button for auto-advance question types */}
          {!isAutoAdvance && (
            <button
              onClick={next}
              disabled={!canGoNext}
              className="flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-30 hover:bg-gold-dark transition-colors"
            >
              {questionNumber === TOTAL ? "Hoàn thành" : "Tiếp theo"}{" "}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <ImageLightbox
          src={lightboxImg.src}
          caption={lightboxImg.caption}
          onClose={() => setLightboxImg(null)}
        />
      )}
    </div>
  );
};

export default Assessment;
