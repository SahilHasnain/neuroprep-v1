export type Subject = "Physics" | "Chemistry" | "Biology";

export type MistakeReason =
  | "Concept gap"
  | "Formula slip"
  | "Reading mistake"
  | "Guessing";

export type MissionTask = {
  id: string;
  label: string;
  count: number;
  unit: string;
};

export type TodayMission = {
  title: string;
  durationMinutes: number;
  completionRate: number;
  energyLabel: string;
  focusNote: string;
  tasks: MissionTask[];
};

export type MistakeItem = {
  id: string;
  subject: Subject;
  chapter: string;
  microTopic: string;
  questionType: string;
  reason: MistakeReason;
  confidence: "Low" | "Medium" | "High";
  prompt: string;
  fixAction: string;
  source: "seed" | "practice";
};

export type WeaknessItem = {
  id: string;
  subject: Subject;
  chapter: string;
  microTopic: string;
  severity: number;
  streakRisk: "Stable" | "Wobbling" | "Critical";
  wrongCount: number;
  dueToday: number;
};

export type RetryQuestion = {
  id: string;
  subject: Subject;
  chapter: string;
  prompt: string;
  status: "Wrong yesterday" | "Needs second pass" | "Ready for timed check";
  expectedMinutes: number;
  source: "seed" | "practice";
};

export type PracticeQuestion = {
  id: string;
  subject: Subject;
  chapter: string;
  microTopic: string;
  questionType: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  options: string[];
  correctOption: number;
  wrongReasonTag: MistakeReason;
  explanation: string;
  fixAction: string;
  retryStatus: RetryQuestion["status"];
  expectedMinutes: number;
};

export type AttemptConfidence = "Low" | "Medium" | "High";

export type PracticeAttempt = {
  questionId: string;
  subject: Subject;
  chapter: string;
  microTopic: string;
  selectedOption: number | null;
  isCorrect: boolean;
  confidence: AttemptConfidence;
  timeSpentSec: number;
  expectedTimeSec: number;
  wrongReasonTag: MistakeReason;
};

export type PracticeSessionRecord = {
  id: string;
  completedAt: string;
  score: number;
  total: number;
  wrongQuestionIds: string[];
  averageConfidence: AttemptConfidence;
  totalTimeSec: number;
  attempts: PracticeAttempt[];
};

export type AnalyticsSnapshot = {
  totalSessions: number;
  recentAccuracy: number;
  averageTimePerQuestionSec: number;
  calibrationRiskCount: number;
  strongestSubject: Subject | null;
  focusSubject: Subject | null;
};

export type LearningState = {
  repairedMistakeIds: string[];
  completedRetryIds: string[];
  practiceRecords: PracticeSessionRecord[];
  practiceMistakes: MistakeItem[];
  practiceRetries: RetryQuestion[];
  onboardingCompleted: boolean;
};

export type DashboardStats = {
  criticalWeaknesses: number;
  conceptGaps: number;
  urgentRetries: number;
};

export type LearningDashboard = {
  todayMission: TodayMission;
  stats: DashboardStats;
  mistakeItems: MistakeItem[];
  weaknessItems: WeaknessItem[];
  retryQuestions: RetryQuestion[];
  lastPracticeRecord: PracticeSessionRecord | null;
  analytics: AnalyticsSnapshot;
  missionReason: string;
  nextStep: string;
};
