import { Colors } from "@/constants/Colors";
import { requestPermissions } from "@/hooks/requestPermissions";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { BleManager } from "react-native-ble-plx";
import { PermissionsAndroid } from "react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    "FiraCode-Light": require("../assets/fonts/FiraCode-Light.ttf"),
    "FiraCode-Regular": require("../assets/fonts/FiraCode-Regular.ttf"),
    "FiraCode-Medium": require("../assets/fonts/FiraCode-Medium.ttf"),
    "FiraCode-SemiBold": require("../assets/fonts/FiraCode-SemiBold.ttf"),
    "FiraCode-Bold": require("../assets/fonts/FiraCode-Bold.ttf"),
  });
  const manager = new BleManager();
  useEffect(() => {});

  const requestBluetoothPermissions = async () => {
    try {
      // Check and request location permissions (required for Bluetooth scanning)
      const locationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Bluetooth scanning requires location permission",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );

      // Check and request Bluetooth scan permissions
      const bluetoothScanGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        {
          title: "Bluetooth Scan Permission",
          message: "App needs permission to scan for Bluetooth devices",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );

      // Check and request Bluetooth connect permissions
      const bluetoothConnectGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        {
          title: "Bluetooth Connect Permission",
          message: "App needs permission to connect to Bluetooth devices",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );

      // Verify all permissions
      const allPermissionsGranted =
        locationGranted === PermissionsAndroid.RESULTS.GRANTED &&
        bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED &&
        bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED;

      if (!allPermissionsGranted) {
        console.log("Bluetooth permissions not fully granted");
        return false;
      }

      return true;
    } catch (err) {
      console.log(`Permission request error: ${err}`);
      return false;
    }
  };
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  });

  const scanAndConnect = () => {
    manager;
  };

  if (!loaded) {
    return null;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
