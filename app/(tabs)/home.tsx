import CustomButton from "@/components/CustomButton";
import CustomSlider from "@/components/CustomSlider";
import LedArray from "@/components/LedArray";
import LedPanel from "@/components/LedPanel";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useBLEContext } from "@/providers/BLEContext";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const { uploadData, connectedDevice, disconnectFromDevice } = useBLEContext();

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView style={styles.scrollView}>
        <View style={{ paddingTop: 20 }}>
          <LedArray />
        </View>
        <View style={styles.view}>
          <LedPanel />

          <CustomSlider note="change" title="Change Speed" />
          <CustomSlider note="ls" title="Pulse Speed" />

          <View style={{ marginTop: 20 }}>
            <CustomButton onPress={() => uploadData()} text="Upload" />
          </View>
          <View style={{ marginTop: 30 }}>
            <CustomButton
              onPress={() => disconnectFromDevice()}
              text="Disconnect"
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor={Colors.dark.background} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    backgroundColor: Colors.dark.background,
    flex: 1,
    alignContent: "center",
  },

  view: {
    backgroundColor: Colors.dark.background,
    flex: 1,
    alignContent: "center",
    paddingVertical: 50,
    marginTop: 10,
    marginHorizontal: 20,
  },

  scrollView: {
    flex: 1,
  },

  text: {
    fontFamily: "FiraCode-Regular",
    color: "white",
  },
});
