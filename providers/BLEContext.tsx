import React, { createContext, useContext } from "react";
import { useBLE } from "@/hooks/useBluetooth";

interface BluetoothLowEnergyApi {
  scanForPeripherals: () => void;
  requestPermissions: () => Promise<boolean>;
  connectToDevice: (device: any) => Promise<void>;
  disconnectFromDevice: () => void;
  allDevices: any[];
  connectedDevice: any | null;
  setBLESegment: (numbers: number[][]) => void;
  setSpeed: (key: "change" | "ls" | "ms" | "rs", value: number) => void;
  uploadData: () => Promise<void>;
  segments: number[][];
  changeSpeed: number;
  checkBluetoothState: () => void;
}

// Create Context
const BLEContext = createContext<BluetoothLowEnergyApi | null>(null);

export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
  const ble = useBLE();

  return <BLEContext.Provider value={ble}>{children}</BLEContext.Provider>;
};

// Custom hook to use the BLE context
export const useBLEContext = () => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error("useBLEContext must be used within a BLEProvider");
  }
  return context;
};
