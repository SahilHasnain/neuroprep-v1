import type { PropsWithChildren, ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

type ScreenShellProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  subtitle: string;
  headerRight?: ReactNode;
}>;

export function ScreenShell({
  eyebrow,
  title,
  subtitle,
  headerRight,
  children,
}: ScreenShellProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 32,
        gap: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          gap: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ gap: 8, flex: 1 }}>
          <Text
            selectable
            style={{
              fontSize: 12,
              fontWeight: "800",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: "#a43f2b",
            }}
          >
            {eyebrow}
          </Text>
          <Text selectable style={{ fontSize: 31, lineHeight: 36, fontWeight: "800", color: "#111827" }}>
            {title}
          </Text>
          <Text selectable style={{ fontSize: 15, lineHeight: 22, color: "#5b6472" }}>
            {subtitle}
          </Text>
        </View>
        {headerRight}
      </View>
      {children}
    </ScrollView>
  );
}
