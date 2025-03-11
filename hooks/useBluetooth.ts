import { useState, useMemo, useEffect } from "react";
import { PermissionsAndroid } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import { Buffer } from "buffer";
import { router } from "expo-router";

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const SERVICE_CHARACTERISTIC = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

export function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [segments, setSegments] = useState<number[][]>([[]]);
  const [changeSpeed, setChangedSpeed] = useState<number>();
  const [lsSpeed, setLsSpeed] = useState<number>();
  const [msSpeed, setMsSpeed] = useState<number>();
  const [rsSpeed, setRsSpeed] = useState<number>();

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

  const scanForPeripherals = () => {
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
    }
  };

  const setBLESegment = (numbers: number[][]) => {
    setSegments(numbers);
  };

  const setSpeed = (key: "change" | "ls" | "ms" | "rs", value: number) => {
    if (key === "change") setChangedSpeed(value);
    else if (key === "ls") setLsSpeed(value);
    else if (key === "ms") setMsSpeed(value);
    else if (key === "rs") setRsSpeed(value);
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
        lsSpeed: lsSpeed,
        rsSpeed: rsSpeed,
        msSpeed: msSpeed,
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
  };
}
