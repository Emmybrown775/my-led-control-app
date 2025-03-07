import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useBluetooth } from "@/hooks/useBluetooth";
import { router } from "expo-router";
import {
  View,
  StatusBar,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

export default function LoadingScreen() {
  useBluetooth({ onBluetoothReady: () => router.replace("/(tabs)/home") });

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.dark.background,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
      <ThemedText>Checking Bluetooth...</ThemedText>
      <StatusBar backgroundColor={Colors.dark.background} />
    </SafeAreaView>
  );
}
