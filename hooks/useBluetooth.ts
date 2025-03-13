import { useState, useMemo, useEffect } from "react";
import { Alert, PermissionsAndroid } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import { Buffer } from "buffer";
import { router } from "expo-router";
import BluetoothStateManager from "react-native-bluetooth-state-manager";

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const SERVICE_CHARACTERISTIC = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

export function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [segments, setSegments] = useState<number[][]>([[]]);
  const [changeSpeed, setChangedSpeed] = useState<number>(50);
  const [lsSpeed, setLsSpeed] = useState<number>(50);

  const requestAndroidPermissions = async () => {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];
    const results = await PermissionsAndroid.requestMultiple(permissions);
    return Object.values(results).every(
      (result) => result === PermissionsAndroid.RESULTS.GRANTED,
    );
  };

  const requestPermissions = async () => {
    if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return await requestAndroidPermissions();
    }
  };

  const checkBluetoothState = () => {
    console.log("hellososo");
    bleManager.onStateChange((state) => {
      if (state === "PoweredOn") {
        scanForPeripherals();
      } else {
        promptToEnable();
      }
    }, true);
  };

  const promptToEnable = () => {
    Alert.alert("Bluetooth Required", "Please Enable Bluetooth to continue", [
      { text: "Turn On", onPress: enableBluetooth },
      { text: "Exit App", onPress: () => {} },
    ]);
  };

  const enableBluetooth = () => {
    BluetoothStateManager.requestToEnable()
      .then(() => {
        scanForPeripherals();
      })
      .catch(() => {
        console.log("User Aborted");
      });
  };

  const scanForPeripherals = () => {
    console.log("Starting BLE scan...");
    bleManager.stopDeviceScan();
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
        return;
      }
      if (device?.name?.includes("ESP32-C3-BLE")) {
        setAllDevices((prevState) => {
          return prevState.some((d) => d.id === device.id)
            ? prevState
            : [...prevState, device];
        });
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      router.navigate("/(tabs)/home");
    } catch (e) {
      console.error("Failed to connect", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      router.replace("/");
    }
  };

  const setBLESegment = (numbers: number[][]) => {
    setSegments(numbers);
  };

  const setSpeed = (key: "change" | "ls" | "ms" | "rs", value: number) => {
    if (key === "change") setChangedSpeed(value);
    else if (key === "ls") setLsSpeed(value);
  };

  const uploadData = async () => {
    if (!connectedDevice) {
      alert("No device connected");
      return;
    }

    try {
      const jsonData = JSON.stringify({
        segments: segments,
        changeSpeed: changeSpeed,
        pswSpeed: lsSpeed,
      });
      const data = btoa(jsonData);
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        SERVICE_CHARACTERISTIC,
        data,
      );

      alert("Data Sent Successfully");
    } catch (error) {
      console.error("Send data Error: ", error);
      alert(error);
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    setBLESegment,
    setSpeed,
    uploadData,
    segments,
    changeSpeed,
    checkBluetoothState,
  };
}
