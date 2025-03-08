import { useMemo, useState } from "react";
import { PermissionsAndroid } from "react-native";
import { BleManager, Device } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import { router } from "expo-router";

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: Device | null;
  allDevices: Device[];
  setBLESegment: (numbers: number[][]) => void;
  setSpeed: (key: "change" | "ls" | "ms" | "rs", value: number) => void;
  uploadData: () => Promise<void>;
}

const SERVICE_UUID = "0000180d-0000-1000-8000-00805f9b34fb";
const SERVICE_CHARACTERISTIC = "00002a37-0000-1000-8000-00805f9b34fb";

export default function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevices] = useState<Device | null>(null);
  const [segments, setSegments] = useState<number[][]>([]);
  const [changeSpeed, setChangedSpeed] = useState<number>();
  const [lsSpeed, setLsSpeed] = useState<number>();
  const [msSpeed, setMsSpeed] = useState<number>();
  const [rsSpeed, setRsSpeed] = useState<number>();

  const requestAndroidPermisions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Bluetooth Scan",
        message: "Bluetooth Low Energy bluetooth scan",
        buttonPositive: "OK",
      },
    );

    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Bluetooth Connection",
        message: "Bluetooth Low Energy bluetooth connect",
        buttonPositive: "OK",
      },
    );

    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      },
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Bluetooth Low Energy requires Location",
          buttonPositive: "OK",
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const isAndroidPermissionGranted = await requestAndroidPermisions();
      return isAndroidPermissionGranted;
    }
  };

  const isDuplicateDevice = (devises: Device[], nextDevice: Device) =>
    devises.findIndex((devises) => nextDevice.id === devises.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes("ESP32-C3-BLE")) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      router.replace("/(tabs)/home");
      console.log("still running");
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevices(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      console.log(deviceConnection);
    } catch (e) {
      console.log("Failed to connect", e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevices(null);
    }
  };

  const setBLESegment = (numbers: number[][]) => {
    setSegments(numbers);
  };

  const setSpeed = (key: "change" | "ls" | "ms" | "rs", value: number) => {
    if (key === "change") {
      setChangedSpeed(value);
    } else if (key === "ls") {
      setLsSpeed(value);
    } else if (key === "ms") {
      setMsSpeed(value);
    } else if (key === "rs") {
      setRsSpeed(value);
    }
  };

  const uploadData = async () => {
    if (!connectedDevice) {
      alert("No device connected");
      return;
    }

    try {
      const data = btoa("testing.123");

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
  };
}
