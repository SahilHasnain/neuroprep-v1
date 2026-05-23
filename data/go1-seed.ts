import { getPracticeQuestionsFromBank } from "@/lib/question-bank";
import type {
  MistakeItem,
  RetryQuestion,
  TodayMission,
  WeaknessItem,
} from "@/types/learning";

export const todayMission: TodayMission = {
  title: "Repair electrochem numericals before they leak more marks",
  durationMinutes: 22,
  completionRate: 68,
  energyLabel: "High-yield repair block",
  focusNote:
    "You are losing marks on familiar chapters, not unknown ones. Fix the repeat errors before starting fresh content.",
  tasks: [
    { id: "task-1", label: "Weak concepts to revise", count: 3, unit: "topics" },
    { id: "task-2", label: "Wrong questions to retry", count: 5, unit: "MCQs" },
    { id: "task-3", label: "Timed checkpoint", count: 1, unit: "round" },
  ],
};

export const mistakeItems: MistakeItem[] = [
  {
    id: "m-1",
    subject: "Chemistry",
    chapter: "Electrochemistry",
    microTopic: "Nernst equation numericals",
    questionType: "Assertion-reason",
    reason: "Formula slip",
    confidence: "High",
    prompt: "You used the right relation but missed the sign while substituting ion concentration.",
    fixAction: "Redo two Nernst substitutions slowly and speak the oxidation-reduction direction out loud.",
    source: "seed",
  },
  {
    id: "m-2",
    subject: "Biology",
    chapter: "Human Physiology",
    microTopic: "Cardiac output regulation",
    questionType: "Statement match",
    reason: "Concept gap",
    confidence: "Medium",
    prompt: "You confused stroke volume with heart rate response during exercise.",
    fixAction: "Review one short note on cardiac output, then solve three concept-only questions.",
    source: "seed",
  },
  {
    id: "m-3",
    subject: "Physics",
    chapter: "Ray Optics",
    microTopic: "Lens sign convention",
    questionType: "Numerical",
    reason: "Reading mistake",
    confidence: "Medium",
    prompt: "The object was virtual, but you treated it as real and carried the wrong sign into the lens formula.",
    fixAction: "Mark keyword traps before solving and check the sign convention after writing the givens.",
    source: "seed",
  },
];

export const weaknessItems: WeaknessItem[] = [
  {
    id: "w-1",
    subject: "Chemistry",
    chapter: "Electrochemistry",
    microTopic: "Nernst equation numericals",
    severity: 92,
    streakRisk: "Critical",
    wrongCount: 11,
    dueToday: 4,
  },
  {
    id: "w-2",
    subject: "Biology",
    chapter: "Plant Growth and Development",
    microTopic: "Plant hormone interactions",
    severity: 78,
    streakRisk: "Wobbling",
    wrongCount: 8,
    dueToday: 3,
  },
  {
    id: "w-3",
    subject: "Physics",
    chapter: "Ray Optics",
    microTopic: "Lens sign convention",
    severity: 71,
    streakRisk: "Wobbling",
    wrongCount: 6,
    dueToday: 2,
  },
  {
    id: "w-4",
    subject: "Biology",
    chapter: "Human Physiology",
    microTopic: "Cardiac output regulation",
    severity: 65,
    streakRisk: "Stable",
    wrongCount: 5,
    dueToday: 2,
  },
];

export const retryQuestions: RetryQuestion[] = [
  {
    id: "r-1",
    subject: "Chemistry",
    chapter: "Electrochemistry",
    prompt: "Calculate cell potential when Zn2+ concentration is increased tenfold at 298 K.",
    status: "Wrong yesterday",
    expectedMinutes: 3,
    source: "seed",
  },
  {
    id: "r-2",
    subject: "Biology",
    chapter: "Human Physiology",
    prompt: "Predict the effect of increased venous return on stroke volume and cardiac output.",
    status: "Needs second pass",
    expectedMinutes: 2,
    source: "seed",
  },
  {
    id: "r-3",
    subject: "Physics",
    chapter: "Ray Optics",
    prompt: "Find image distance for a virtual object placed 20 cm from a convex lens of focal length 15 cm.",
    status: "Ready for timed check",
    expectedMinutes: 4,
    source: "seed",
  },
  {
    id: "r-4",
    subject: "Biology",
    chapter: "Plant Growth and Development",
    prompt: "Choose the hormone pair responsible for apical dominance release after shoot-tip removal.",
    status: "Wrong yesterday",
    expectedMinutes: 2,
    source: "seed",
  },
];

export const practiceQuestions = getPracticeQuestionsFromBank();
