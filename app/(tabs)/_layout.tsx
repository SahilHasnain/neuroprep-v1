import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TAB_COLORS = {
  active: "#a43f2b",
  inactive: "#7b7280",
  background: "#fffaf1",
  border: "#e7ddcc",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#f7f2e8",
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "700",
          color: "#1f2937",
        },
        sceneStyle: {
          backgroundColor: "#f7f2e8",
        },
        tabBarActiveTintColor: TAB_COLORS.active,
        tabBarInactiveTintColor: TAB_COLORS.inactive,
        tabBarStyle: {
          backgroundColor: TAB_COLORS.background,
          borderTopColor: TAB_COLORS.border,
          height: 72,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="target-variant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mistakes"
        options={{
          title: "Mistakes",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="notebook-edit-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="weaknesses"
        options={{
          title: "Weaknesses",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="brain" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="retry"
        options={{
          title: "Retry",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="refresh-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
