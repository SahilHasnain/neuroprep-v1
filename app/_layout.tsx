import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LearningStoreProvider } from "@/lib/learning-store";

export default function RootLayout() {
  return (
    <LearningStoreProvider>
      <>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: "#f7f2e8",
            },
            contentStyle: {
              backgroundColor: "#f7f2e8",
            },
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: "700",
              color: "#1f2937",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="practice-session/index" options={{ title: "Practice session" }} />
        </Stack>
      </>
    </LearningStoreProvider>
  );
}
