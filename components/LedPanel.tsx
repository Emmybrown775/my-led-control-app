import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import CustomButton from "./CustomButton";
import { useState } from "react";
import { useBLEContext } from "@/providers/BLEContext";

export default function LedPanel() {
  const initialButtons = Array.from({ length: 36 }, (_, index) => ({
    id: index,
    title: index + 1,
    selected: false,
    availabe: true,
  }));

  const { setBLESegment } = useBLEContext();

  const [buttons, setButtons] = useState(initialButtons);
  const [segments, setSegments] = useState<number[][]>([]);

  const toggleButton = (id: number) => {
    setButtons((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const nextSegment = () => {
    const selected = buttons.filter(
      (button) => button.selected && button.availabe,
    );
    const selectedIndexes = selected.map((button) => button.id);
    console.log(selected);

    setSegments([...segments, selectedIndexes]);
    selected.forEach((led) => {
      buttons[led.id].availabe = false;
      buttons[led.id].title = segments.length + 1;
    });
  };

  const done = () => {
    setButtons(initialButtons);
    setBLESegment(segments);
    setSegments([]);
  };

  return (
    <View>
      <View style={styles.container}>
        {buttons.map((led) => (
          <TouchableOpacity
            onPress={() => (led.availabe ? toggleButton(led.id) : {})}
            style={[styles.button, led.selected ? styles.selectedButton : {}]}
            key={led.id}
          >
            <ThemedText
              style={led.selected ? styles.selectedText : {}}
              type="link"
            >
              {led.title}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "row",
          paddingVertical: 20,
        }}
      >
        <CustomButton
          onPress={() => nextSegment()}
          text="Next Segment"
        ></CustomButton>
        <CustomButton onPress={() => done()} text="Done"></CustomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
  },

  button: {
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    width: 50,
    margin: 5,
    alignItems: "center",
  },

  selectedButton: {
    backgroundColor: Colors.dark.text,
    borderColor: Colors.dark.tint,
  },

  selectedText: {
    color: Colors.dark.background,
  },
});
