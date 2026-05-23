import type { ReactNode } from "react";
import { Text, View } from "react-native";

export function SurfaceCard({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "accent" | "dark";
}) {
  const backgrounds = {
    light: "#fffaf1",
    accent: "#f2ddc6",
    dark: "#1f2937",
  } as const;

  return (
    <View
      style={{
        backgroundColor: backgrounds[tone],
        borderRadius: 28,
        borderCurve: "continuous",
        padding: 18,
        gap: 14,
        boxShadow: "0 12px 30px rgba(54, 38, 20, 0.08)",
      }}
    >
      {children}
    </View>
  );
}

export function SectionHeading({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <View style={{ gap: 4 }}>
      <Text selectable style={{ fontSize: 20, fontWeight: "800", color: "#111827" }}>
        {title}
      </Text>
      {caption ? (
        <Text selectable style={{ fontSize: 14, lineHeight: 21, color: "#6b7280" }}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

export function Pill({
  label,
  backgroundColor,
  textColor = "#111827",
}: {
  label: string;
  backgroundColor: string;
  textColor?: string;
}) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
      }}
    >
      <Text selectable style={{ color: textColor, fontSize: 12, fontWeight: "700" }}>
        {label}
      </Text>
    </View>
  );
}
