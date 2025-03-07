import { useEffect, useState } from "react";
import { Alert, PermissionsAndroid } from "react-native";
import { BleManager } from "react-native-ble-plx";
import BluetoothStateManager from "react-native-bluetooth-state-manager";

const bleManager = new BleManager();

type Props = {
  onBluetoothReady: () => void;
};

export function useBluetooth({ onBluetoothReady }: Props) {
  const [isON, setIsON] = useState(false);

  useEffect(() => {
    requestPermissions().then(() => {
      checkBluetoothState();
    });

    return () => {
      bleManager.destroy();
    };
  }, [onBluetoothReady]);

  async function requestPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      if (
        granted["android.permission.BLUETOOTH_SCAN"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.BLUETOOTH_CONNECT"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.ACCESS_FINE_LOCATION"] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("All permissions granted");
      } else {
        console.log("Permissions denied");
        Alert.alert(
          "Permissions Required",
          "Please grant all permissions to use Bluetooth.",
        );
      }
    } catch (err) {
      console.warn("Error requesting permissions:", err);
    }
  }

  const checkBluetoothState = () => {
    bleManager.onStateChange((state) => {
      console.log("Bluetooth State:", state);
      if (state === "PoweredOn") {
        setIsON(true);
        onBluetoothReady();
      } else {
        setIsON(true);
        promptToEnable();
      }
    }, true);
  };

  const promptToEnable = () => {
    Alert.alert("Bluetooth Required", "Please enable Bluetooth to continue.", [
      { text: "Turn On", onPress: enableBluetooth },
      { text: "Exit App", onPress: () => console.log("User exited") },
    ]);
  };

  const enableBluetooth = () => {
    BluetoothStateManager.requestToEnable()
      .then(() => {
        console.log("Bluetooth enabled");
        setIsON(true);
        onBluetoothReady();
      })
      .catch(() => {
        console.log("User aborted");
      });
  };

  return { isON };
}
