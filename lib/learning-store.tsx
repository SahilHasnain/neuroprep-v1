import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Storage from "expo-sqlite/kv-store";
import { buildLearningDashboard, buildPracticeOutcome, getInitialLearningState, getPracticeQuestions } from "@/lib/learning";
import type {
  AttemptConfidence,
  LearningDashboard,
  LearningState,
  PracticeQuestion,
  PracticeSessionRecord,
} from "@/types/learning";

const STORAGE_KEY = "neuroprep.learning-state.v1";

type LearningAction =
  | { type: "hydrate"; payload: LearningState }
  | { type: "repair-mistake"; mistakeId: string }
  | { type: "complete-retry"; retryId: string }
  | { type: "complete-onboarding" }
  | { type: "complete-practice"; record: PracticeSessionRecord; mistakeIds: string[]; retryIds: string[]; mistakes: LearningState["practiceMistakes"]; retries: LearningState["practiceRetries"] }
  | { type: "reset-session" };

type LearningStoreValue = {
  dashboard: LearningDashboard;
  state: LearningState;
  practiceQuestions: PracticeQuestion[];
  hydrated: boolean;
  completeOnboarding: () => void;
  markMistakeRepaired: (mistakeId: string) => void;
  markRetryComplete: (retryId: string) => void;
  completePracticeSession: (
    selectedOptions: Record<string, number>,
    confidenceByQuestion: Record<string, AttemptConfidence>,
    timeSpentByQuestion: Record<string, number>,
  ) => PracticeSessionRecord;
  resetSession: () => void;
};

const LearningStoreContext = createContext<LearningStoreValue | null>(null);

export function LearningStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(learningReducer, undefined, getInitialLearningState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const rawValue = await Storage.getItem(STORAGE_KEY);
        if (!rawValue || cancelled) {
          setHydrated(true);
          return;
        }

        const parsed = JSON.parse(rawValue) as LearningState;
        dispatch({ type: "hydrate", payload: parsed });
      } catch {
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    Storage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [hydrated, state]);

  const value = useMemo<LearningStoreValue>(
    () => ({
      state,
      hydrated,
      dashboard: buildLearningDashboard(state),
      practiceQuestions: getPracticeQuestions(),
      completeOnboarding: () => dispatch({ type: "complete-onboarding" }),
      markMistakeRepaired: (mistakeId: string) => dispatch({ type: "repair-mistake", mistakeId }),
      markRetryComplete: (retryId: string) => dispatch({ type: "complete-retry", retryId }),
      completePracticeSession: (
        selectedOptions: Record<string, number>,
        confidenceByQuestion: Record<string, AttemptConfidence>,
        timeSpentByQuestion: Record<string, number>,
      ) => {
        const outcome = buildPracticeOutcome(
          selectedOptions,
          confidenceByQuestion,
          timeSpentByQuestion,
          state,
        );
        dispatch({
          type: "complete-practice",
          record: outcome.record,
          mistakeIds: outcome.newMistakes.map((item) => item.id),
          retryIds: outcome.newRetries.map((item) => item.id),
          mistakes: outcome.newMistakes,
          retries: outcome.newRetries,
        });
        return outcome.record;
      },
      resetSession: () => dispatch({ type: "reset-session" }),
    }),
    [hydrated, state],
  );

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f7f2e8" }}>
        <ActivityIndicator size="large" color="#a43f2b" />
      </View>
    );
  }

  return <LearningStoreContext.Provider value={value}>{children}</LearningStoreContext.Provider>;
}

export function useLearningStore() {
  const value = useContext(LearningStoreContext);

  if (!value) {
    throw new Error("useLearningStore must be used within LearningStoreProvider");
  }

  return value;
}

function learningReducer(state: LearningState, action: LearningAction): LearningState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "repair-mistake":
      return state.repairedMistakeIds.includes(action.mistakeId)
        ? state
        : { ...state, repairedMistakeIds: [...state.repairedMistakeIds, action.mistakeId] };
    case "complete-retry":
      return state.completedRetryIds.includes(action.retryId)
        ? state
        : { ...state, completedRetryIds: [...state.completedRetryIds, action.retryId] };
    case "complete-onboarding":
      return { ...state, onboardingCompleted: true };
    case "complete-practice":
      return {
        ...state,
        practiceRecords: [action.record, ...state.practiceRecords].slice(0, 8),
        practiceMistakes: [...state.practiceMistakes, ...action.mistakes],
        practiceRetries: [...state.practiceRetries, ...action.retries],
        repairedMistakeIds: state.repairedMistakeIds.filter((id) => !action.mistakeIds.includes(id)),
        completedRetryIds: state.completedRetryIds.filter((id) => !action.retryIds.includes(id)),
      };
    case "reset-session":
      return getInitialLearningState();
    default:
      return state;
  }
}
