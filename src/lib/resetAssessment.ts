// Reset all in-progress assessment state from localStorage.
export const ASSESSMENT_KEYS = [
  "jade-assessment-step",
  "jade-assessment-answers",
  "jade-number-inputs",
  "jade-sub-checks",
  "jade-ring-colors",
  "jade-color-tones",
  "jade-pattern-data",
  "jade-survey-data",
];

export function resetAssessmentSession(): void {
  ASSESSMENT_KEYS.forEach((k) => localStorage.removeItem(k));
}

export function hasAssessmentInProgress(): boolean {
  const step = parseInt(localStorage.getItem("jade-assessment-step") || "0", 10);
  return step > 0;
}
