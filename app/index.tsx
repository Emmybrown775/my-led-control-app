import CustomButton from "@/components/CustomButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useBLEContext } from "@/providers/BLEContext";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  View,
  StatusBar,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

export default function LoadingScreen() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
  } = useBLEContext();

  useEffect(() => {
    scanForDevices();
    router.replace("/(tabs)/home");
  });

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.dark.background,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {connectedDevice ? (
        <View></View>
      ) : (
        <View>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText>
            {allDevices.length === 0
              ? "Checking Bluetooth..."
              : "Please select a device"}
          </ThemedText>
          {allDevices.length === 0
            ? null
            : allDevices.map((device, index) => {
                return (
                  <CustomButton
                    key={index}
                    onPress={() => connectToDevice(device)}
                    text={device.name?.toString()}
                  />
                );
              })}
        </View>
      )}

      <StatusBar backgroundColor={Colors.dark.background} />
    </SafeAreaView>
  );
}
