import { Text, View } from "react-native";
import { Pill, SectionHeading, SurfaceCard } from "@/components/ui/cards";
import { ScreenShell } from "@/components/ui/screen-shell";
import { useLearningStore } from "@/lib/learning-store";

const riskTone = {
  Stable: { backgroundColor: "#e3f5e4", textColor: "#166534" },
  Wobbling: { backgroundColor: "#feefc7", textColor: "#92400e" },
  Critical: { backgroundColor: "#f8d8d2", textColor: "#9f1239" },
} as const;

export default function WeaknessesScreen() {
  const { dashboard } = useLearningStore();

  return (
    <ScreenShell
      eyebrow="Map"
      title="Weakness board"
      subtitle="Priority now comes from remaining repair pressure, not a static list."
    >
      <SectionHeading
        title="Priority list"
        caption="Severity is recalculated from open mistakes, unresolved retries, and the topic's baseline risk."
      />
      {dashboard.weaknessItems.map((item) => (
        <SurfaceCard key={item.id}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text selectable style={{ fontSize: 19, fontWeight: "800", color: "#111827" }}>
                {item.microTopic}
              </Text>
              <Text selectable style={{ fontSize: 14, color: "#6b7280" }}>
                {item.subject} | {item.chapter}
              </Text>
            </View>
            <Pill
              label={item.streakRisk}
              backgroundColor={riskTone[item.streakRisk].backgroundColor}
              textColor={riskTone[item.streakRisk].textColor}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
            <MetricBadge label="Severity" value={`${item.severity}`} accent="#a43f2b" />
            <MetricBadge label="Wrong count" value={`${item.wrongCount}`} accent="#6d28d9" />
            <MetricBadge label="Due today" value={`${item.dueToday}`} accent="#0f766e" />
          </View>
        </SurfaceCard>
      ))}
    </ScreenShell>
  );
}

function MetricBadge({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <View
      style={{
        flexGrow: 1,
        minWidth: 92,
        borderRadius: 20,
        borderCurve: "continuous",
        backgroundColor: "#fffaf1",
        padding: 12,
        gap: 4,
      }}
    >
      <Text selectable style={{ fontSize: 12, fontWeight: "700", color: "#8b7a65" }}>
        {label}
      </Text>
      <Text selectable style={{ fontSize: 22, fontWeight: "800", color: accent, fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
    </View>
  );
}
