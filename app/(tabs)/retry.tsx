import { Pressable, Text, View } from "react-native";
import { Pill, SectionHeading, SurfaceCard } from "@/components/ui/cards";
import { ScreenShell } from "@/components/ui/screen-shell";
import { useLearningStore } from "@/lib/learning-store";

const statusStyles = {
  "Wrong yesterday": { backgroundColor: "#f8d8d2", textColor: "#9f1239" },
  "Needs second pass": { backgroundColor: "#dbeafe", textColor: "#1d4ed8" },
  "Ready for timed check": { backgroundColor: "#dcfce7", textColor: "#166534" },
} as const;

export default function RetryScreen() {
  const { dashboard, markRetryComplete } = useLearningStore();

  return (
    <ScreenShell
      eyebrow="Retest"
      title="Retry set"
      subtitle="The queue should shrink as the student solves recovered-mark questions."
    >
      <SectionHeading
        title="Questions queued for repair"
        caption="Solving these should reduce urgency on the home mission and the weakness board."
      />
      {dashboard.retryQuestions.length === 0 ? (
        <SurfaceCard tone="accent">
          <Text selectable style={{ fontSize: 20, fontWeight: "800", color: "#1f2937" }}>
            Retry queue cleared
          </Text>
          <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#4b5563" }}>
            The next product step is to replace this state with an automatic timed mini-test recommendation.
          </Text>
        </SurfaceCard>
      ) : null}
      {dashboard.retryQuestions.map((item) => (
        <SurfaceCard key={item.id}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <Pill label={item.subject} backgroundColor="#eef2ff" textColor="#374151" />
            <Pill
              label={item.status}
              backgroundColor={statusStyles[item.status].backgroundColor}
              textColor={statusStyles[item.status].textColor}
            />
          </View>
          <View style={{ gap: 5 }}>
            <Text selectable style={{ fontSize: 17, fontWeight: "800", color: "#111827" }}>
              {item.chapter}
            </Text>
            <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#374151" }}>
              {item.prompt}
            </Text>
          </View>
          <View
            style={{
              alignSelf: "flex-start",
              borderRadius: 16,
              backgroundColor: "#f7efe1",
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Text selectable style={{ fontSize: 13, fontWeight: "700", color: "#7c5c3f" }}>
              Expected time: {item.expectedMinutes} min
            </Text>
          </View>
          <Pressable
            onPress={() => markRetryComplete(item.id)}
            style={{
              alignSelf: "flex-start",
              borderRadius: 18,
              backgroundColor: "#1f2937",
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          >
            <Text selectable style={{ fontSize: 13, fontWeight: "800", color: "#fffaf1" }}>
              Mark solved
            </Text>
          </Pressable>
        </SurfaceCard>
      ))}
    </ScreenShell>
  );
}
