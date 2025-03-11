import { Colors } from "@/constants/Colors";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid } from "react-native";
import BluetoothStateManager from "react-native-bluetooth-state-manager";
import { BLEProvider } from "@/providers/BLEContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    "FiraCode-Light": require("../assets/fonts/FiraCode-Light.ttf"),
    "FiraCode-Regular": require("../assets/fonts/FiraCode-Regular.ttf"),
    "FiraCode-Medium": require("../assets/fonts/FiraCode-Medium.ttf"),
    "FiraCode-SemiBold": require("../assets/fonts/FiraCode-SemiBold.ttf"),
    "FiraCode-Bold": require("../assets/fonts/FiraCode-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  });

  if (!loaded) {
    return null;
  }
  return (
    <BLEProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </BLEProvider>
  );
}
