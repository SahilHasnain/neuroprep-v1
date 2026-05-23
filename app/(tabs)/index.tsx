import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Pill, SectionHeading, SurfaceCard } from "@/components/ui/cards";
import { ScreenShell } from "@/components/ui/screen-shell";
import { useLearningStore } from "@/lib/learning-store";

export default function TodayScreen() {
  const { dashboard, resetSession, state, completeOnboarding } = useLearningStore();

  return (
    <ScreenShell
      eyebrow="Go 7"
      title="Daily weakness repair"
      subtitle="The learning loop is now wrapped in onboarding, mission reasoning, and visible progress signals."
      headerRight={
        <Pressable
          onPress={resetSession}
          style={{
            minWidth: 54,
            height: 54,
            borderRadius: 18,
            backgroundColor: "#fffaf1",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 14,
            boxShadow: "0 10px 24px rgba(54, 38, 20, 0.08)",
          }}
        >
          <MaterialCommunityIcons name="refresh" size={24} color="#a43f2b" />
        </Pressable>
      }
    >
      {!state.onboardingCompleted ? (
        <SurfaceCard tone="dark">
          <Pill label="First run" backgroundColor="#f2ddc6" textColor="#1f2937" />
          <Text selectable style={{ fontSize: 24, lineHeight: 30, fontWeight: "800", color: "#fffaf1" }}>
            Neuroprep does three things every day: detect leaks, assign repairs, and retest recovery.
          </Text>
          <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#d7dde8" }}>
            Start with one practice session. The app will convert wrong answers and unstable confidence into a guided mission automatically.
          </Text>
          <Pressable
            onPress={completeOnboarding}
            style={{
              alignSelf: "flex-start",
              borderRadius: 18,
              backgroundColor: "#f2ddc6",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text selectable style={{ color: "#1f2937", fontSize: 13, fontWeight: "800" }}>
              I understand the loop
            </Text>
          </Pressable>
        </SurfaceCard>
      ) : null}

      <SurfaceCard tone="accent">
        <Pill label={dashboard.todayMission.energyLabel} backgroundColor="#fff4e7" />
        <Text selectable style={{ fontSize: 26, lineHeight: 31, fontWeight: "800", color: "#1f2937" }}>
          {dashboard.todayMission.title}
        </Text>
        <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#4b5563" }}>
          {dashboard.todayMission.focusNote}
        </Text>
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <Metric label="Repair block" value={`${dashboard.todayMission.durationMinutes} min`} />
          <Metric label="Completion" value={`${dashboard.todayMission.completionRate}%`} />
        </View>
        <Link href="/practice-session/index" asChild>
          <Pressable
            style={{
              alignSelf: "flex-start",
              borderRadius: 18,
              backgroundColor: "#1f2937",
              paddingHorizontal: 16,
              paddingVertical: 13,
            }}
          >
            <Text selectable style={{ color: "#fffaf1", fontSize: 13, fontWeight: "800" }}>
              Start 4-question practice
            </Text>
          </Pressable>
        </Link>
      </SurfaceCard>

      <SurfaceCard>
        <SectionHeading title="Why this mission" caption="A productized coach should explain its reasoning, not just issue tasks." />
        <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#374151" }}>
          {dashboard.missionReason}
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
            Next best action
          </Text>
          <Text selectable style={{ fontSize: 14, lineHeight: 21, color: "#5b4632" }}>
            {dashboard.nextStep}
          </Text>
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <SectionHeading title="Session state" caption="This now survives reloads using on-device storage." />
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <Metric label="Repairs done" value={`${state.repairedMistakeIds.length}`} />
          <Metric label="Retries cleared" value={`${state.completedRetryIds.length}`} />
        </View>
      </SurfaceCard>

      {dashboard.lastPracticeRecord ? (
        <SurfaceCard>
          <SectionHeading title="Latest practice" caption="Fresh errors should feed the weakness-repair loop immediately." />
          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
            <Metric label="Score" value={`${dashboard.lastPracticeRecord.score}/${dashboard.lastPracticeRecord.total}`} />
            <Metric label="Wrong" value={`${dashboard.lastPracticeRecord.wrongQuestionIds.length}`} />
            <Metric label="Confidence" value={dashboard.lastPracticeRecord.averageConfidence} />
            <Metric label="Time" value={`${Math.round(dashboard.lastPracticeRecord.totalTimeSec / 60)} min`} />
          </View>
        </SurfaceCard>
      ) : null}

      <View style={{ gap: 12 }}>
        <SectionHeading title="Mission breakdown" caption="The counts are derived from the remaining queue, not fixed content." />
        {dashboard.todayMission.tasks.map((task) => (
          <SurfaceCard key={task.id}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text selectable style={{ fontSize: 17, fontWeight: "700", color: "#111827" }}>
                  {task.label}
                </Text>
                <Text selectable style={{ fontSize: 14, color: "#6b7280" }}>
                  {task.count > 0
                    ? "Finite tasks make it easier for the student to begin the session."
                    : "No urgent work remains in this bucket right now."}
                </Text>
              </View>
              <View
                style={{
                  minWidth: 82,
                  borderRadius: 22,
                  borderCurve: "continuous",
                  backgroundColor: "#f7efe1",
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                <Text selectable style={{ fontSize: 22, fontWeight: "800", color: "#a43f2b" }}>
                  {task.count}
                </Text>
                <Text selectable style={{ fontSize: 12, fontWeight: "700", color: "#7c5c3f" }}>
                  {task.unit}
                </Text>
              </View>
            </View>
          </SurfaceCard>
        ))}
      </View>

      <View style={{ gap: 12 }}>
        <SectionHeading title="Live indicators" caption="These counters move from practice submissions and repair actions." />
        <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
          <Metric label="Critical weaknesses" value={`${dashboard.stats.criticalWeaknesses}`} />
          <Metric label="Concept gaps" value={`${dashboard.stats.conceptGaps}`} />
          <Metric label="Urgent retries" value={`${dashboard.stats.urgentRetries}`} />
        </View>
      </View>
    </ScreenShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexGrow: 1,
        minWidth: 120,
        backgroundColor: "#fffaf1",
        borderRadius: 22,
        borderCurve: "continuous",
        padding: 14,
        gap: 6,
      }}
    >
      <Text selectable style={{ fontSize: 12, fontWeight: "700", textTransform: "uppercase", color: "#8b7a65" }}>
        {label}
      </Text>
      <Text selectable style={{ fontSize: 22, fontWeight: "800", color: "#111827", fontVariant: ["tabular-nums"] }}>
        {value}
      </Text>
    </View>
  );
}
