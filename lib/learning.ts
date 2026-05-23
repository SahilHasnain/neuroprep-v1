import { mistakeItems, practiceQuestions, retryQuestions, weaknessItems } from "@/data/go1-seed";
import type {
  AnalyticsSnapshot,
  AttemptConfidence,
  LearningDashboard,
  LearningState,
  MistakeItem,
  MissionTask,
  PracticeAttempt,
  PracticeQuestion,
  PracticeSessionRecord,
  RetryQuestion,
  Subject,
  WeaknessItem,
} from "@/types/learning";

export function getInitialLearningState(): LearningState {
  return {
    repairedMistakeIds: [],
    completedRetryIds: [],
    practiceRecords: [],
    practiceMistakes: [],
    practiceRetries: [],
    onboardingCompleted: false,
  };
}

export function getPracticeQuestions() {
  return practiceQuestions;
}

export function buildLearningDashboard(state: LearningState): LearningDashboard {
  const allMistakes = [...mistakeItems, ...state.practiceMistakes];
  const allRetries = [...retryQuestions, ...state.practiceRetries];
  const activeMistakes = allMistakes.filter((item) => !state.repairedMistakeIds.includes(item.id));
  const activeRetries = allRetries.filter((item) => !state.completedRetryIds.includes(item.id));
  const recentAttempts = state.practiceRecords.flatMap((record) => record.attempts).slice(0, 24);
  const activeWeaknesses = weaknessItems
    .map((item) => tuneWeakness(item, activeMistakes, activeRetries, recentAttempts))
    .filter((item) => item.dueToday > 0 || item.severity >= 45)
    .sort((left, right) => right.severity - left.severity);

  const criticalWeaknesses = activeWeaknesses.filter((item) => item.streakRisk === "Critical").length;
  const conceptGaps = activeMistakes.filter((item) => item.reason === "Concept gap").length;
  const urgentRetries = activeRetries.filter((item) => item.status === "Wrong yesterday").length;
  const completedSteps = state.repairedMistakeIds.length + state.completedRetryIds.length;
  const totalSteps = Math.max(1, allMistakes.length + allRetries.length);
  const completionRate = Math.round((completedSteps / totalSteps) * 100);

  const topWeakness = activeWeaknesses[0];
  const focusTopic = topWeakness?.microTopic ?? "stability check";
  const focusChapter = topWeakness?.chapter ?? "recent sessions";
  const missionTasks: MissionTask[] = [
    {
      id: "task-1",
      label: "Weak concepts to revise",
      count: Math.max(1, Math.min(activeWeaknesses.length, 3)),
      unit: "topics",
    },
    {
      id: "task-2",
      label: "Wrong questions to retry",
      count: Math.max(1, Math.min(activeRetries.length, 5)),
      unit: "MCQs",
    },
    {
      id: "task-3",
      label: "Timed checkpoint",
      count: urgentRetries > 0 || criticalWeaknesses > 0 ? 1 : 0,
      unit: "round",
    },
  ];

  const pressureSummary = summarizePressure(recentAttempts);
  const analytics = buildAnalytics(state.practiceRecords);

  return {
    todayMission: {
      title:
        activeWeaknesses.length > 0
          ? `Repair ${focusTopic.toLowerCase()} in ${focusChapter.toLowerCase()} before it leaks more marks`
          : "Run a short checkpoint and confirm yesterday's repairs are holding",
      durationMinutes: Math.max(12, activeMistakes.length * 4 + activeRetries.length * 2 + pressureSummary.extraMinutes),
      completionRate,
      energyLabel:
        criticalWeaknesses > 0
          ? "High-yield repair block"
          : pressureSummary.overconfidentMisses > 0
            ? "Calibration repair block"
            : "Stability reinforcement block",
      focusNote:
        activeWeaknesses.length > 0
          ? `Current pressure: ${pressureSummary.note}`
          : "The urgent queue is cleared. The next useful action is a quick timed confidence check.",
      tasks: missionTasks,
    },
    stats: {
      criticalWeaknesses,
      conceptGaps,
      urgentRetries,
    },
    mistakeItems: activeMistakes,
    weaknessItems: activeWeaknesses,
    retryQuestions: activeRetries,
    lastPracticeRecord: state.practiceRecords[0] ?? null,
    analytics,
    missionReason:
      activeWeaknesses.length > 0
        ? `${focusTopic} is highest pressure because it combines open mistakes, retry debt, and recent attempt instability.`
        : "The engine is not seeing urgent weakness pressure right now.",
    nextStep:
      activeRetries.length > 0
        ? "Clear the retry queue first, then run one timed checkpoint."
        : activeMistakes.length > 0
          ? "Repair the remaining explanations before opening a new practice set."
          : "Open a fresh practice session to generate the next guided mission.",
  };
}

export function buildPracticeOutcome(
  selectedOptions: Record<string, number>,
  confidenceByQuestion: Record<string, AttemptConfidence>,
  timeSpentByQuestion: Record<string, number>,
  currentState: LearningState,
): {
  record: PracticeSessionRecord;
  newMistakes: MistakeItem[];
  newRetries: RetryQuestion[];
} {
  const attempts = practiceQuestions.map((question) =>
    buildAttempt(question, selectedOptions, confidenceByQuestion, timeSpentByQuestion),
  );
  const wrongAttempts = attempts.filter((attempt) => !attempt.isCorrect);
  const wrongQuestions = practiceQuestions.filter((question) =>
    wrongAttempts.some((attempt) => attempt.questionId === question.id),
  );
  const score = practiceQuestions.length - wrongQuestions.length;

  const newMistakes = wrongQuestions
    .map((question) => buildMistakeFromQuestion(question))
    .filter(
      (item) =>
        !currentState.practiceMistakes.some(
          (existing) => existing.microTopic === item.microTopic && existing.prompt === item.prompt,
        ),
    );

  const newRetries = wrongQuestions
    .map((question) => buildRetryFromQuestion(question))
    .filter(
      (item) =>
        !currentState.practiceRetries.some(
          (existing) => existing.chapter === item.chapter && existing.prompt === item.prompt,
        ),
    );

  const totalTimeSec = attempts.reduce((sum, attempt) => sum + attempt.timeSpentSec, 0);

  return {
    record: {
      id: `session-${Date.now()}`,
      completedAt: new Date().toISOString(),
      score,
      total: practiceQuestions.length,
      wrongQuestionIds: wrongQuestions.map((question) => question.id),
      averageConfidence: averageConfidence(attempts.map((attempt) => attempt.confidence)),
      totalTimeSec,
      attempts,
    },
    newMistakes,
    newRetries,
  };
}

function buildAttempt(
  question: PracticeQuestion,
  selectedOptions: Record<string, number>,
  confidenceByQuestion: Record<string, AttemptConfidence>,
  timeSpentByQuestion: Record<string, number>,
): PracticeAttempt {
  const selectedOption = selectedOptions[question.id] ?? null;
  const isCorrect = selectedOption === question.correctOption;

  return {
    questionId: question.id,
    subject: question.subject,
    chapter: question.chapter,
    microTopic: question.microTopic,
    selectedOption,
    isCorrect,
    confidence: confidenceByQuestion[question.id] ?? "Medium",
    timeSpentSec: timeSpentByQuestion[question.id] ?? question.expectedMinutes * 60,
    expectedTimeSec: question.expectedMinutes * 60,
    wrongReasonTag: question.wrongReasonTag,
  };
}

function buildMistakeFromQuestion(question: PracticeQuestion): MistakeItem {
  return {
    id: `pm-${question.id}`,
    subject: question.subject,
    chapter: question.chapter,
    microTopic: question.microTopic,
    questionType: question.questionType,
    reason: question.wrongReasonTag,
    confidence: question.difficulty === "Hard" ? "Low" : "Medium",
    prompt: question.explanation,
    fixAction: question.fixAction,
    source: "practice",
  };
}

function buildRetryFromQuestion(question: PracticeQuestion): RetryQuestion {
  return {
    id: `pr-${question.id}`,
    subject: question.subject,
    chapter: question.chapter,
    prompt: question.prompt,
    status: question.retryStatus,
    expectedMinutes: question.expectedMinutes,
    source: "practice",
  };
}

function tuneWeakness(
  item: WeaknessItem,
  activeMistakes: MistakeItem[],
  activeRetries: RetryQuestion[],
  recentAttempts: PracticeAttempt[],
): WeaknessItem {
  const linkedMistakeCount = activeMistakes.filter((mistake) => mistake.microTopic === item.microTopic).length;
  const linkedRetryCount = activeRetries.filter((question) => question.chapter === item.chapter).length;
  const linkedAttempts = recentAttempts.filter((attempt) => attempt.microTopic === item.microTopic);
  const wrongAttempts = linkedAttempts.filter((attempt) => !attempt.isCorrect);
  const overconfidentMisses = wrongAttempts.filter((attempt) => attempt.confidence === "High").length;
  const slowAttempts = linkedAttempts.filter((attempt) => attempt.timeSpentSec > attempt.expectedTimeSec * 1.35).length;
  const lowConfidenceCorrect = linkedAttempts.filter(
    (attempt) => attempt.isCorrect && attempt.confidence === "Low",
  ).length;
  const recoveryWins = linkedAttempts.filter(
    (attempt) => attempt.isCorrect && attempt.timeSpentSec <= attempt.expectedTimeSec && attempt.confidence !== "Low",
  ).length;

  const adjustedSeverity = clampSeverity(
    item.severity +
      linkedMistakeCount * 6 +
      linkedRetryCount * 4 +
      wrongAttempts.length * 5 +
      overconfidentMisses * 7 +
      slowAttempts * 3 +
      lowConfidenceCorrect * 2 -
      recoveryWins * 4,
  );
  const dueToday = Math.max(0, linkedMistakeCount + linkedRetryCount + overconfidentMisses + slowAttempts);

  let streakRisk: WeaknessItem["streakRisk"] = "Stable";
  if (adjustedSeverity >= 85 || dueToday >= 4) {
    streakRisk = "Critical";
  } else if (adjustedSeverity >= 60 || dueToday >= 2) {
    streakRisk = "Wobbling";
  }

  return {
    ...item,
    severity: adjustedSeverity,
    dueToday,
    wrongCount: item.wrongCount + wrongAttempts.length,
    streakRisk,
  };
}

function summarizePressure(attempts: PracticeAttempt[]) {
  const overconfidentMisses = attempts.filter((attempt) => !attempt.isCorrect && attempt.confidence === "High").length;
  const slowAttempts = attempts.filter((attempt) => attempt.timeSpentSec > attempt.expectedTimeSec * 1.35).length;
  const lowConfidenceCorrect = attempts.filter((attempt) => attempt.isCorrect && attempt.confidence === "Low").length;

  const fragments = [];
  if (overconfidentMisses > 0) {
    fragments.push(`${overconfidentMisses} overconfident miss${overconfidentMisses > 1 ? "es" : ""}`);
  }
  if (slowAttempts > 0) {
    fragments.push(`${slowAttempts} slow attempt${slowAttempts > 1 ? "s" : ""}`);
  }
  if (lowConfidenceCorrect > 0) {
    fragments.push(`${lowConfidenceCorrect} shaky correct answer${lowConfidenceCorrect > 1 ? "s" : ""}`);
  }

  return {
    overconfidentMisses,
    slowAttempts,
    lowConfidenceCorrect,
    extraMinutes: overconfidentMisses * 2 + slowAttempts,
    note:
      fragments.length > 0
        ? fragments.join(", ")
        : "recent attempts look stable with no major confidence or timing pressure",
  };
}

function buildAnalytics(records: PracticeSessionRecord[]): AnalyticsSnapshot {
  const recentRecords = records.slice(0, 6);
  const attempts = recentRecords.flatMap((record) => record.attempts);
  const totalCorrect = attempts.filter((attempt) => attempt.isCorrect).length;
  const averageTimePerQuestionSec =
    attempts.length > 0
      ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.timeSpentSec, 0) / attempts.length)
      : 0;
  const calibrationRiskCount = attempts.filter(
    (attempt) => !attempt.isCorrect && attempt.confidence === "High",
  ).length;
  const strongestSubject = getSubjectByAccuracy(attempts, "highest");
  const focusSubject = getSubjectByAccuracy(attempts, "lowest");

  return {
    totalSessions: records.length,
    recentAccuracy: attempts.length > 0 ? Math.round((totalCorrect / attempts.length) * 100) : 0,
    averageTimePerQuestionSec,
    calibrationRiskCount,
    strongestSubject,
    focusSubject,
  };
}

function getSubjectByAccuracy(
  attempts: PracticeAttempt[],
  mode: "highest" | "lowest",
): Subject | null {
  if (attempts.length === 0) {
    return null;
  }

  const stats = new Map<Subject, { correct: number; total: number }>();
  for (const attempt of attempts) {
    const entry = stats.get(attempt.subject) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (attempt.isCorrect) {
      entry.correct += 1;
    }
    stats.set(attempt.subject, entry);
  }

  const ranked = Array.from(stats.entries()).sort((left, right) => {
    const leftAccuracy = left[1].correct / left[1].total;
    const rightAccuracy = right[1].correct / right[1].total;
    return mode === "highest" ? rightAccuracy - leftAccuracy : leftAccuracy - rightAccuracy;
  });

  return ranked[0]?.[0] ?? null;
}

function averageConfidence(confidences: AttemptConfidence[]): AttemptConfidence {
  const score =
    confidences.reduce((sum, confidence) => sum + confidenceToNumber(confidence), 0) /
    Math.max(confidences.length, 1);
  if (score >= 2.4) {
    return "High";
  }
  if (score >= 1.5) {
    return "Medium";
  }
  return "Low";
}

function confidenceToNumber(confidence: AttemptConfidence) {
  switch (confidence) {
    case "High":
      return 3;
    case "Medium":
      return 2;
    case "Low":
      return 1;
  }
}

function clampSeverity(value: number) {
  return Math.max(20, Math.min(99, value));
}
