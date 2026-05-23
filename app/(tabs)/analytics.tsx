import { Text, View } from "react-native";
import { SectionHeading, SurfaceCard } from "@/components/ui/cards";
import { ScreenShell } from "@/components/ui/screen-shell";
import { useLearningStore } from "@/lib/learning-store";

export default function AnalyticsScreen() {
  const { dashboard } = useLearningStore();
  const analytics = dashboard.analytics;

  return (
    <ScreenShell
      eyebrow="Trends"
      title="Learning analytics"
      subtitle="The student should see whether the engine is detecting progress or just generating more work."
    >
      <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
        <MetricCard label="Sessions" value={`${analytics.totalSessions}`} />
        <MetricCard label="Accuracy" value={`${analytics.recentAccuracy}%`} />
        <MetricCard label="Avg time" value={`${Math.round(analytics.averageTimePerQuestionSec / 60)} min`} />
        <MetricCard label="Calibration" value={`${analytics.calibrationRiskCount}`} />
      </View>

      <SurfaceCard>
        <SectionHeading title="Subject signal" caption="This keeps the product legible: what feels strong and what still needs intervention." />
        <View style={{ gap: 10 }}>
          <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#374151" }}>
            Strongest recent subject: {analytics.strongestSubject ?? "Not enough data yet"}
          </Text>
          <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#374151" }}>
            Highest-focus subject: {analytics.focusSubject ?? "Not enough data yet"}
          </Text>
        </View>
      </SurfaceCard>

      <SurfaceCard tone="accent">
        <SectionHeading title="Interpretation" caption="A solo-built product still needs to explain the metrics in plain language." />
        <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#4b5563" }}>
          Accuracy tracks outcome, calibration tracks judgment, and average time tracks fluency. When accuracy rises but calibration risk stays high, the student still needs more honest self-assessment.
        </Text>
      </SurfaceCard>
    </ScreenShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexGrow: 1,
        minWidth: 132,
        backgroundColor: "#fffaf1",
        borderRadius: 22,
        borderCurve: "continuous",
        padding: 16,
        gap: 6,
        boxShadow: "0 10px 24px rgba(54, 38, 20, 0.06)",
      }}
    >
      <Text selectable style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", color: "#8b7a65" }}>
        {label}
      </Text>
      <Text selectable style={{ fontSize: 24, fontWeight: "800", color: "#111827", fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
    </View>
  );
}
