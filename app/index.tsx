import CustomButton from "@/components/CustomButton";
import CustomSlider from "@/components/CustomSlider";
import LedArray from "@/components/LedArray";
import LedPanel from "@/components/LedPanel";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
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
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView style={styles.scrollView}>
        <LedArray />
        <View style={styles.view}>
          <LedPanel />

          <CustomSlider title="Change Speed" />
          <CustomSlider title="LS Pulse Speed" />
          <CustomSlider title="MS Pulse Speed" />
          <CustomSlider title="RS Pulse Speed" />
          <View style={{ marginTop: 20 }}>
            <CustomButton text="Upload" />
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
    paddingTop: 50,
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
