import { Text, View, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import { useBLEContext } from "@/providers/BLEContext";

type Prop = {
  title: string | undefined;
  note: "change" | "ls" | "ms" | "rs";
};

export default function CustomSlider({ title, note }: Prop) {
  const [sliderValue, setSliderValue] = useState(50);

  const valueChange = (value: number) => {
    setSliderValue(value);
  };

  const { setSpeed } = useBLEContext();

  return (
    <View style={styles.view}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <View
        style={{ flexDirection: "row", alignItems: "center", width: "100%" }}
      >
        <ThemedText type="default">{sliderValue}</ThemedText>
        <View style={{ flex: 1 }}>
          <Slider
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor={Colors.dark.text}
            thumbTintColor={Colors.dark.text}
            maximumTrackTintColor={Colors.dark.tint}
            style={styles.slider}
            value={sliderValue}
            onValueChange={(value) => valueChange(Math.floor(value))}
            onSlidingComplete={(value) => setSpeed(note, Math.floor(value))}
          />
        </View>
        <ThemedText type="default">100</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    height: 50,
    flex: 1,
  },

  view: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: Colors.dark.icon,
    borderRadius: 10,
    flex: 1,
    marginVertical: 15,
  },
});
