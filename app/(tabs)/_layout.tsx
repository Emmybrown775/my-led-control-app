import { Colors } from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            iconName = focused ? "home" : "home-outlined";

            return (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={size}
                color={color}
              />
            );
          },
        }}
      />

      <Tabs.Screen
        name="presets"
        options={{
          title: "Presets",
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Ionicons
                name={focused ? "pulse" : "pulse-outline"}
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}
