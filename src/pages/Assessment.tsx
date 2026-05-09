import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { questions, SECTIONS } from "@/data/questions";
import { ArrowLeft, ArrowRight, Lightbulb, ZoomIn, Sparkles, Upload, RotateCcw } from "lucide-react";
import { resetAssessmentSession } from "@/lib/resetAssessment";
import SectionDivider from "@/components/SectionDivider";
import ColorRing, { ColorTone } from "@/components/ColorRing";
import ColorRingAlerts from "@/components/assessment/ColorRingAlerts";
import PatternStructure, { PatternData } from "@/components/assessment/PatternStructure";
import ImageLightbox from "@/components/assessment/ImageLightbox";
import { useJadeVision, type VisionResult } from "@/hooks/useJadeVision";

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
const LOADING_QUOTES = [
  {
    title: "⏳ Đang phân tích cốt ngọc và sắc diện...",
    quote: '"Ngọc dưỡng người 3 năm, người dưỡng ngọc một đời"',
    sub: "Hãy thả lỏng tâm trí để bắt đầu hành trình hiểu Ngọc.",
  },
  {
    title: "⏳ Đang chuẩn bị thước đo và đèn soi ảo...",
    quote: "Bạn đã sẵn sàng quan sát kỹ chiếc vòng của mình chưa?",
    sub: "",
  },
];

const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [q] = useState(() => LOADING_QUOTES[Math.floor(Math.random() * LOADING_QUOTES.length)]);
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center animate-fade-in-up"
      style={{ backgroundColor: "#002f14", color: "#ffffff" }}
    >
      <p className="text-xl font-bold mb-8 tracking-wider">{q.title}</p>
      <p className="font-serif italic text-lg max-w-md leading-relaxed">{q.quote}</p>
      {q.sub && <p className="font-serif italic text-sm mt-3 opacity-80">{q.sub}</p>}
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
  const [prefilledFields, setPrefilledFields] = useState<Set<number>>(new Set());
  const [prefillBanner, setPrefillBanner] = useState<string[] | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [prefillUsed, setPrefillUsed] = useState<boolean>(
    () => localStorage.getItem("jade-prefill-used") === "1",
  );
  const [aiVisionCtx, setAiVisionCtx] = useState<{ isMuna?: boolean; chungPeak?: string; hasBlackFlaw?: boolean } | undefined>(() => {
    const saved = localStorage.getItem("jade-ai-vision-ctx");
    return saved ? JSON.parse(saved) : undefined;
  });
  const { analyze: analyzeJade, isLoading: aiLoading, error: aiError, confidence: aiConfidence } = useJadeVision();

  // ─── AI Vision → form mapping ───
  const chungToAnswer: Record<string, string> = {
    "Đậu thô": "1a",
    "Đậu mịn": "1a",
    "Nếp Mịn": "1b",
    "Nếp Hóa": "1b",
    "Nếp Băng": "1c",
  };
  const coverageToAnswer: Record<number, string> = { 1: "3a", 2: "3b", 3: "3c", 4: "3d" };
  const colorHexMap: Record<string, string> = {
    "Đế Vương Lục": "#1b4332", "Chính Dương Lục": "#2d6a4f", "Lạt Dương Lục": "#388e3c",
    "Táo Quả Lục": "#66bb6a", "Đậu Lục": "#7ab87a", "Thanh Thủy Lục": "#52b788",
    "Du Thanh": "#2f4f3a", "Hồi Lục": "#7a8b7a", "Mặc Thúy": "#1a1a1a",
    "Tử La Lan": "#c8a0d0", "Hoàng Gia Tử": "#6a3d8a", "Gia Tử": "#8a5dab", "Phấn Tử": "#e0c8e8",
    "Thiên Không Lam": "#6ab4d8", "Lam Tinh": "#9bc7e0", "Hồ Thủy Lam": "#5a9fc7", "Lam Thủy": "#3a7a9f",
    "Hồng": "#c0392b", "Tranh Hồng": "#d96a3a", "Hạc Hồng": "#a05a3a",
    "Hoàng": "#e0a83a", "Tranh Hoàng": "#e8b85a", "Hạc Hoàng": "#d8c89a",
    "Bạch Sắc": "#f0f0f0", "Vô Sắc": "#f5f5f0", "Ô Kê Chủng": "#a0a0a0",
  };
  const flawToAnswer: Record<string, string> = {
    "Không lỗi": "5a", "Vân ngọc": "5a",
    "Sớ bông / Gân già": "5b",
    "Chỉ màu / Gân non / Sớ âm / Sớ dọc": "5b",
    "Sớ âm dài / Sớ cấn / Mắt cát / Sần lõm": "5c",
    "Sớ dọc dài / Sớ lưỡi gà": "5c",
    "Sớ chéo / Sớ ngang": "5d",
    "Vết nứt (Crack)": "5d",
  };
  const shapeToAnswer: Record<string, string> = {
    "Bản Đũa": "10a", "Bản Dẹt": "10b", "Bản Vuông": "10c", "Khắc Hoa": "10d",
  };

  const handleAiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewImg(URL.createObjectURL(file));
    const v = await analyzeJade(file);
    e.target.value = "";
    if (!v) return;

    const newAnswers: Record<number, string> = { ...answers };
    const filled = new Set<number>();

    const a1 = chungToAnswer[v.chungPeak];
    if (a1) { newAnswers[1] = a1; filled.add(1); }
    const a3 = coverageToAnswer[v.coverageLevel];
    if (a3) { newAnswers[3] = a3; filled.add(3); }
    const a5 = v.flaws?.length ? flawToAnswer[v.flaws[0]] : "5a";
    if (a5) { newAnswers[5] = a5; filled.add(5); }
    const a10 = shapeToAnswer[v.shape];
    if (a10) { newAnswers[10] = a10; filled.add(10); }

    setAnswers(newAnswers);

    // Ring colors from baseColor
    const hex = colorHexMap[v.baseColor] ?? "#7ab87a";
    setRingColors(Array(12).fill(hex));
    const tone: ColorTone = v.toneLevel >= 4 ? "dark" : v.toneLevel <= 2 ? "light" : "medium";
    setColorTones(Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i), tone])));
    filled.add(2); // color ring question id

    setPrefilledFields(filled);

    // Banner with maturity-priority (Già/Non) reasoning
    const banner: string[] = [];
    banner.push(`✅ AI đã điền ${filled.size} trường — kiểm tra lại trước khi tính giá!`);
    banner.push(
      v.vision_notes.crystalMaturity === "non"
        ? "🌱 Nhận định: Ngọc NON (tinh thể lổn nhổn, không khít) — giá trị thấp hơn ngọc già cùng chủng."
        : v.vision_notes.crystalMaturity === "già"
        ? "💎 Nhận định: Ngọc GIÀ (tinh thể khít, mướt) — chất ngọc tốt."
        : "❓ Không xác định được Già/Non rõ ràng từ ảnh."
    );
    if (v.vision_notes.opticalEffects?.length)
      banner.push(`✨ Hiệu ứng quang học: ${v.vision_notes.opticalEffects.join(", ")}`);
    if (v.vision_notes.lightingQuality === "artificial")
      banner.push("⚡ Ảnh dưới đèn nhân tạo — màu có thể rực hơn 30-50% so với thực tế.");
    if (v.vision_notes.hasPhieuHoa) banner.push("🌸 Phát hiện Phiêu Hoa — cộng giá trị đáng kể.");
    if (v.vision_notes.overallConfidence < 0.6)
      banner.push("⚠️ Độ tin cậy thấp — ảnh không đủ rõ, kết quả chỉ tham khảo.");
    setPrefillBanner(banner);

    // Mark AI as used (one-shot per session) + persist vision context for ColorRing overlays
    setPrefillUsed(true);
    localStorage.setItem("jade-prefill-used", "1");
    const ctx = {
      isMuna: !!v.vision_notes?.isMuna,
      chungPeak: v.chungPeak,
      hasBlackFlaw: (v.flaws || []).some((f) => /Vết nứt|Sớ chéo|Sớ ngang|Mắt cát/i.test(f)),
    };
    setAiVisionCtx(ctx);
    localStorage.setItem("jade-ai-vision-ctx", JSON.stringify(ctx));
  };

  const clearPrefillFor = (qId: number) => {
    if (prefilledFields.has(qId)) {
      const next = new Set(prefilledFields);
      next.delete(qId);
      setPrefilledFields(next);
    }
  };

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

  // Exit-count: if user leaves mid-flow >= 2 times, auto-reset on next mount
  useEffect(() => {
    const exitCount = parseInt(localStorage.getItem("jade-exit-count") || "0", 10);
    const hasAnswers = Object.keys(answers).length > 0 || stepIdx > 0;
    if (exitCount >= 2 && hasAnswers) {
      resetAssessmentSession();
      localStorage.removeItem("jade-exit-count");
      localStorage.removeItem("jade-prefill-used");
      localStorage.removeItem("jade-ai-vision-ctx");
      setAnswers({});
      setNumberInputs({});
      setSubChecks({});
      setRingColors(Array(12).fill("#e5e7eb"));
      setColorTones({});
      setPatternData(EMPTY_PATTERN);
      setPrefilledFields(new Set());
      setPrefillBanner(null);
      setPreviewImg(null);
      setPrefillUsed(false);
      setAiVisionCtx(undefined);
      setStepIdx(0);
    }
    const onLeave = () => {
      const stillIncomplete = stepIdx < steps.length - 1;
      if (stillIncomplete) {
        const cur = parseInt(localStorage.getItem("jade-exit-count") || "0", 10);
        localStorage.setItem("jade-exit-count", String(cur + 1));
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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
      localStorage.removeItem("jade-exit-count");
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
    clearPrefillFor(q.id);

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
          localStorage.removeItem("jade-exit-count");
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
        {/* ── AI Vision panel — only shown on first question, and only until first successful prefill ── */}
        {questionNumber === 1 && !prefillUsed && (
          <div className="mb-6 rounded-xl border-2 border-dashed border-gold/40 bg-gradient-to-br from-gold/5 to-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <p className="font-serif font-bold text-foreground text-sm md:text-base">
                  Soi đèn AI — Tự điền form bằng ảnh
                </p>
              </div>
              <label
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold cursor-pointer transition-colors ${
                  aiLoading
                    ? "bg-muted text-muted-foreground cursor-wait"
                    : "bg-gold text-primary-foreground hover:bg-gold-dark"
                }`}
              >
                <Upload className="h-4 w-4" />
                {aiLoading ? "Đang xử lý..." : "🤖 Soi đèn AI"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAiUpload}
                  disabled={aiLoading}
                />
              </label>
            </div>

            {previewImg && !aiLoading && (
              <img
                src={previewImg}
                alt="Ảnh ngọc"
                className="mt-3 w-full max-h-48 object-contain rounded-lg border border-border"
              />
            )}

            {aiLoading && (
              <div className="mt-4 flex items-center gap-3 text-gold animate-pulse">
                <div className="h-2 w-2 rounded-full bg-gold animate-ping" />
                <p className="font-serif italic text-sm md:text-base">
                  🔍 Đang soi tinh thể ngọc...
                </p>
              </div>
            )}

            {aiError && <p className="mt-3 text-sm text-destructive">⚠️ {aiError}</p>}
          </div>
        )}

        {/* AI prefill banner — show once on the step the AI just filled */}
        {prefillBanner && !aiLoading && questionNumber === 1 && (
          <div className="mb-6 rounded-lg bg-gold/10 border border-gold/30 p-3 space-y-1.5">
            {prefillBanner.map((line, i) => (
              <p key={i} className="text-xs md:text-sm text-foreground leading-relaxed">
                {line}
              </p>
            ))}
            {aiConfidence > 0 && (
              <p className="text-xs text-muted-foreground italic pt-1">
                Độ tin cậy AI: {Math.round(aiConfidence * 100)}%
              </p>
            )}
          </div>
        )}

        <div className={`rounded-xl border bg-card p-6 md:p-8 shadow-sm space-y-6 transition-all ${
          prefilledFields.has(q.id)
            ? "border-gold border-2 ring-2 ring-gold/20"
            : "border-border"
        }`}>
          {prefilledFields.has(q.id) && (
            <div className="flex items-center gap-2 text-xs font-semibold text-gold bg-gold/10 rounded-md px-3 py-1.5 -mt-2">
              <Sparkles className="h-3.5 w-3.5" />
              AI đã điền sẵn — kiểm tra lại nhé
            </div>
          )}
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
              {q.options.map((opt) => {
                // Hide images entirely for Q3 (id === 3)
                const showImageSlot = q.id !== 3;
                return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className={`rounded-lg border-2 p-4 text-left transition-all hover:shadow-md ${
                    selectedAnswer === opt.id
                      ? "border-gold bg-gold/10 shadow-md"
                      : "border-border bg-card hover:border-gold/50"
                  }`}
                >
                  {/* Image - tap to open lightbox - only if image exists */}
                  {showImageSlot && opt.image && (
                    <div
                      className="rounded-md bg-muted mb-3 overflow-hidden flex items-center justify-center cursor-zoom-in relative group h-80 sm:h-96 md:h-[28rem]"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(opt.image!, `${opt.label}${opt.description ? ` — ${opt.description}` : ""}`);
                      }}
                    >
                      <img
                        src={opt.image}
                        alt={opt.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-background/80 rounded-full p-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-4 w-4 text-foreground" />
                      </div>
                    </div>
                  )}
                  <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                  {opt.description && (
                    <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                  )}
                </button>
                );
              })}
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
          {/* Always show Next button — auto-advance still works on click */}
          <button
            onClick={next}
            disabled={!canGoNext}
            className="flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-30 hover:bg-gold-dark transition-colors"
          >
            {questionNumber === TOTAL ? "Hoàn thành" : "Tiếp theo"}{" "}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Restart from beginning */}
        <div className="mt-10 pt-6 border-t border-border flex justify-center">
          <button
            onClick={() => {
              if (window.confirm("Bạn có chắc muốn làm lại từ đầu? Mọi câu trả lời hiện tại sẽ bị xoá.")) {
                resetAssessmentSession();
                setAnswers({});
                setNumberInputs({});
                setSubChecks({});
                setRingColors(Array(12).fill("#e5e7eb"));
                setColorTones({});
                setPatternData(EMPTY_PATTERN);
                setPrefilledFields(new Set());
                setPrefillBanner(null);
                setPreviewImg(null);
                setStepIdx(0);
              }
            }}
            className="inline-flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-gold transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Làm lại từ đầu
          </button>
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
