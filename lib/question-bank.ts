import { questionBankDataset } from "@/data/question-bank";
import type { PracticeQuestion } from "@/types/learning";
import type { AuthoredQuestion, ConceptNode } from "@/types/question-bank";

const conceptById = new Map(questionBankDataset.concepts.map((concept) => [concept.id, concept]));

export function getQuestionBankDataset() {
  return questionBankDataset;
}

export function getPracticeQuestionsFromBank(): PracticeQuestion[] {
  return questionBankDataset.questions
    .filter((question) => question.status === "ready")
    .map((question) => toPracticeQuestion(question));
}

export function getConceptById(conceptId: string): ConceptNode | undefined {
  return conceptById.get(conceptId);
}

function toPracticeQuestion(question: AuthoredQuestion): PracticeQuestion {
  const concept = conceptById.get(question.primaryConceptId);

  return {
    id: question.id,
    subject: question.subject,
    chapter: question.chapter,
    microTopic: concept?.microTopic ?? question.primaryConceptId,
    questionType: question.questionType,
    difficulty: question.difficulty,
    prompt: question.prompt,
    options: question.options,
    correctOption: question.correctOption,
    wrongReasonTag: question.wrongReasonTag,
    explanation: question.explanation,
    fixAction: question.repairNote,
    retryStatus: question.retryStatus,
    expectedMinutes: Math.max(1, Math.round(question.estimatedTimeSec / 60)),
  };
}
