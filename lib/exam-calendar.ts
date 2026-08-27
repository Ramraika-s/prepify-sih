/**
 * Maps a student's free-text `target_exam` (set in their profile, e.g.
 * "JEE Main & Advanced 2026") to a public, well-known exam date so the
 * dashboard can show a tentative countdown. This is calendar knowledge, not
 * a claim about the student's actual registration/admit card date.
 */
export type ExamMeta = { label: string; month: number; day: number };

const EXAM_PATTERNS: { test: RegExp; meta: ExamMeta }[] = [
  { test: /jee/i, meta: { label: "JEE Main", month: 1, day: 24 } },
  { test: /neet/i, meta: { label: "NEET UG", month: 5, day: 4 } },
  { test: /cuet/i, meta: { label: "CUET UG", month: 5, day: 15 } },
  { test: /gate/i, meta: { label: "GATE", month: 2, day: 1 } },
];

/** Next occurrence's year for each supported exam, for the dashboard picker. */
export function examPickerOptions(): { value: string; label: string }[] {
  const now = new Date();
  return EXAM_PATTERNS.map((p) => {
    let year = now.getFullYear();
    const thisYear = new Date(year, p.meta.month - 1, p.meta.day);
    if (thisYear.getTime() < now.getTime()) year += 1;
    return { value: `${p.meta.label} ${year}`, label: `${p.meta.label} ${year}` };
  });
}

export function parseTargetExam(targetExam: string | null | undefined): {
  label: string;
  date: Date;
} | null {
  if (!targetExam) return null;
  const match = EXAM_PATTERNS.find((p) => p.test.test(targetExam));
  if (!match) return null;

  const yearMatch = targetExam.match(/\b(20\d{2})\b/);
  const now = new Date();
  let year = yearMatch ? Number(yearMatch[1]) : now.getFullYear();

  let date = new Date(year, match.meta.month - 1, match.meta.day);
  // If that date has already passed and no explicit year was given, roll to next year.
  if (!yearMatch && date.getTime() < now.getTime()) {
    year += 1;
    date = new Date(year, match.meta.month - 1, match.meta.day);
  }

  return { label: `${match.meta.label} ${year}`, date };
}
