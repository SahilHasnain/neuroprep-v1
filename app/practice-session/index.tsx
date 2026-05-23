import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Pill, SectionHeading, SurfaceCard } from "@/components/ui/cards";
import { ScreenShell } from "@/components/ui/screen-shell";
import { useLearningStore } from "@/lib/learning-store";
import type { AttemptConfidence } from "@/types/learning";

export default function PracticeSessionScreen() {
  const { completePracticeSession, practiceQuestions } = useLearningStore();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [confidenceByQuestion, setConfidenceByQuestion] = useState<Record<string, AttemptConfidence>>({});
  const [submittedScore, setSubmittedScore] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOptions({});
    setConfidenceByQuestion({});
    setSubmittedScore(null);
  }, []);

  function handleSubmit() {
    const timeSpentByQuestion = Object.fromEntries(
      practiceQuestions.map((question, index) => [
        question.id,
        question.expectedMinutes * 60 + (selectedOptions[question.id] === question.correctOption ? index * 6 : 24 + index * 12),
      ]),
    );
    const record = completePracticeSession(selectedOptions, confidenceByQuestion, timeSpentByQuestion);
    setSubmittedScore(`${record.score}/${record.total}`);
  }

  return (
    <ScreenShell
      eyebrow="Practice"
      title="4-question session"
      subtitle="A small session is enough to generate new mistakes, retries, and weak-topic pressure."
    >
      {practiceQuestions.map((question, index) => (
        <SurfaceCard key={question.id}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <Pill label={question.subject} backgroundColor="#eef2ff" textColor="#374151" />
            <Pill label={question.difficulty} backgroundColor="#f7efe1" textColor="#7c5c3f" />
          </View>
          <View style={{ gap: 5 }}>
            <Text selectable style={{ fontSize: 14, color: "#6b7280" }}>
              Q{index + 1} | {question.chapter} | {question.microTopic}
            </Text>
            <Text selectable style={{ fontSize: 18, lineHeight: 24, fontWeight: "800", color: "#111827" }}>
              {question.prompt}
            </Text>
          </View>
          <View style={{ gap: 10 }}>
            {question.options.map((option, optionIndex) => {
              const selected = selectedOptions[question.id] === optionIndex;
              return (
                <Pressable
                  key={`${question.id}-${optionIndex}`}
                  onPress={() =>
                    setSelectedOptions((current) => ({
                      ...current,
                      [question.id]: optionIndex,
                    }))
                  }
                  style={{
                    borderRadius: 18,
                    borderCurve: "continuous",
                    paddingHorizontal: 14,
                    paddingVertical: 13,
                    backgroundColor: selected ? "#1f2937" : "#fffaf1",
                    boxShadow: selected ? "0 12px 24px rgba(31, 41, 55, 0.15)" : "0 6px 14px rgba(54, 38, 20, 0.06)",
                  }}
                >
                  <Text selectable style={{ color: selected ? "#fffaf1" : "#374151", fontSize: 14, lineHeight: 20, fontWeight: "600" }}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={{ gap: 8 }}>
            <Text selectable style={{ fontSize: 13, fontWeight: "700", color: "#6b7280" }}>
              Confidence before checking
            </Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {(["Low", "Medium", "High"] as AttemptConfidence[]).map((confidence) => {
                const selected = confidenceByQuestion[question.id] === confidence;
                return (
                  <Pressable
                    key={`${question.id}-${confidence}`}
                    onPress={() =>
                      setConfidenceByQuestion((current) => ({
                        ...current,
                        [question.id]: confidence,
                      }))
                    }
                    style={{
                      borderRadius: 16,
                      backgroundColor: selected ? "#a43f2b" : "#fffaf1",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <Text selectable style={{ color: selected ? "#fffaf1" : "#5b6472", fontSize: 12, fontWeight: "800" }}>
                      {confidence}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </SurfaceCard>
      ))}

      <SurfaceCard tone="accent">
        <SectionHeading
          title="Submit session"
          caption="Wrong answers, overconfident misses, and slow attempts now all influence the repair engine."
        />
        {submittedScore ? (
          <Text selectable style={{ fontSize: 18, fontWeight: "800", color: "#1f2937" }}>
            Session recorded: {submittedScore}
          </Text>
        ) : null}
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <Pressable
            onPress={handleSubmit}
            style={{
              borderRadius: 18,
              backgroundColor: "#1f2937",
              paddingHorizontal: 16,
              paddingVertical: 13,
            }}
          >
            <Text selectable style={{ color: "#fffaf1", fontSize: 13, fontWeight: "800" }}>
              Save practice result
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/(tabs)/index")}
            style={{
              borderRadius: 18,
              backgroundColor: "#fffaf1",
              paddingHorizontal: 16,
              paddingVertical: 13,
            }}
          >
            <Text selectable style={{ color: "#1f2937", fontSize: 13, fontWeight: "800" }}>
              Return to mission
            </Text>
          </Pressable>
        </View>
      </SurfaceCard>
    </ScreenShell>
  );
}
