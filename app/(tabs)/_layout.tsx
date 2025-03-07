import { Colors } from "@/constants/Colors";
import { Stack, Tabs } from "expo-router";

export default function () {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.dark.tint,
        tabBarStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Setup",
        }}
      />
    </Tabs>
  );
}
