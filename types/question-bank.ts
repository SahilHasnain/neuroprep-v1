import type { MistakeReason, RetryQuestion, Subject } from "@/types/learning";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export type SkillType =
  | "Recall"
  | "Conceptual inference"
  | "Formula application"
  | "Elimination"
  | "Assertion reasoning"
  | "Diagram reading";

export type TrapType =
  | "Sign convention trap"
  | "Formula substitution trap"
  | "Definition confusion"
  | "Statement reversal"
  | "Guessing pressure";

export type QuestionSourceType = "Internal authored" | "Exam-pattern reconstruction" | "AI-assisted draft";

export type RelationshipType = "retry" | "step-up" | "step-down" | "similar" | "repair";

export type ConceptNode = {
  id: string;
  subject: Subject;
  unit: string;
  chapter: string;
  microTopic: string;
  prerequisites: string[];
  neetWeight: "Low" | "Medium" | "High";
  difficultyLevel: QuestionDifficulty;
  commonErrorPatterns: MistakeReason[];
};

export type ErrorTag = {
  id: string;
  label: MistakeReason;
  description: string;
};

export type QuestionRelationship = {
  type: RelationshipType;
  targetQuestionId: string;
};

export type AuthoredQuestion = {
  id: string;
  subject: Subject;
  chapter: string;
  microTopicIds: string[];
  primaryConceptId: string;
  secondaryConceptIds: string[];
  questionType: string;
  skillType: SkillType;
  trapType: TrapType;
  difficulty: QuestionDifficulty;
  estimatedTimeSec: number;
  sourceType: QuestionSourceType;
  sourceLabel: string;
  prompt: string;
  options: string[];
  correctOption: number;
  explanation: string;
  repairNote: string;
  wrongReasonTag: MistakeReason;
  retryStatus: RetryQuestion["status"];
  relationships: QuestionRelationship[];
  status: "draft" | "ready";
};

export type QuestionBankDataset = {
  concepts: ConceptNode[];
  errorTags: ErrorTag[];
  questions: AuthoredQuestion[];
};
