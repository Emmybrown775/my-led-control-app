import CustomButton from "@/components/CustomButton";
import CustomSlider from "@/components/CustomSlider";
import LedArray from "@/components/LedArray";
import LedPanel from "@/components/LedPanel";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import useBLE from "@/hooks/useBluetooth";
import Slider from "@react-native-community/slider";
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
  const { uploadData, connectedDevice } = useBLE();

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView style={styles.scrollView}>
        <View style={{ paddingTop: 20 }}>
          <LedArray />
        </View>
        <View style={styles.view}>
          <LedPanel />

          <CustomSlider
            note="change"
            title={connectedDevice?.name?.toString()}
          />
          <CustomSlider note="ls" title="LS Pulse Speed" />
          <CustomSlider note="ms" title="MS Pulse Speed" />
          <CustomSlider note="ls" title="RS Pulse Speed" />
          <View style={{ marginTop: 20 }}>
            <CustomButton onPress={() => uploadData()} text="Upload" />
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
