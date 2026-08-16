// Reset all in-progress assessment state from localStorage.
export const ASSESSMENT_KEYS = [
  "jade-assessment-step",
  "jade-assessment-answers",
  "jade-number-inputs",
  "jade-sub-checks",
  "jade-ring-colors",
  "jade-color-tones",
  "jade-pattern-data",
  "jade-translucency",
  "jade-grain",
  "jade-features",
  "jade-canvas-snapshot",
  "jade-survey-data",
  "jade-prefill-used",
  "jade-ai-vision-ctx",
  "jade-exit-count",
];

export function resetAssessmentSession(): void {
  ASSESSMENT_KEYS.forEach((k) => localStorage.removeItem(k));
}

export function hasAssessmentInProgress(): boolean {
  const step = parseInt(localStorage.getItem("jade-assessment-step") || "0", 10);
  return step > 0;
}
