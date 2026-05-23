import { Pressable, Text, View } from "react-native";
import { Pill, SectionHeading, SurfaceCard } from "@/components/ui/cards";
import { ScreenShell } from "@/components/ui/screen-shell";
import { useLearningStore } from "@/lib/learning-store";

export default function MistakesScreen() {
  const { dashboard, markMistakeRepaired } = useLearningStore();

  return (
    <ScreenShell
      eyebrow="Review"
      title="Mistake review"
      subtitle="The student should explicitly close a repair action, not just read an explanation and move on."
    >
      <SectionHeading
        title="Recent wrong answers"
        caption="Each repair reduces the live mission queue and should eventually lower weakness severity."
      />
      {dashboard.mistakeItems.length === 0 ? (
        <SurfaceCard tone="accent">
          <Text selectable style={{ fontSize: 20, fontWeight: "800", color: "#1f2937" }}>
            All flagged mistakes repaired
          </Text>
          <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#4b5563" }}>
            Once this queue is empty, the product should stop pushing more explanation and shift the student toward retesting.
          </Text>
        </SurfaceCard>
      ) : null}
      {dashboard.mistakeItems.map((item) => (
        <SurfaceCard key={item.id}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <Pill label={item.subject} backgroundColor="#eef2ff" textColor="#374151" />
            <Pill label={item.reason} backgroundColor="#fce7d7" textColor="#9a3412" />
          </View>
          <View style={{ gap: 5 }}>
            <Text selectable style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>
              {item.microTopic}
            </Text>
            <Text selectable style={{ fontSize: 14, color: "#6b7280" }}>
              {item.chapter} | {item.questionType} | Confidence {item.confidence}
            </Text>
          </View>
          <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#374151" }}>
            {item.prompt}
          </Text>
          <View
            style={{
              backgroundColor: "#f7efe1",
              borderRadius: 20,
              borderCurve: "continuous",
              padding: 14,
              gap: 6,
            }}
          >
            <Text selectable style={{ fontSize: 12, fontWeight: "800", textTransform: "uppercase", color: "#8b5e34" }}>
              Repair action
            </Text>
            <Text selectable style={{ fontSize: 14, lineHeight: 21, color: "#5b4632" }}>
              {item.fixAction}
            </Text>
          </View>
          <Pressable
            onPress={() => markMistakeRepaired(item.id)}
            style={{
              alignSelf: "flex-start",
              borderRadius: 18,
              backgroundColor: "#1f2937",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          >
            <Text selectable style={{ fontSize: 13, fontWeight: "800", color: "#fffaf1" }}>
              Mark repaired
            </Text>
          </Pressable>
        </SurfaceCard>
      ))}
    </ScreenShell>
  );
}
