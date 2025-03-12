import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import CustomButton from "./CustomButton";
import { useState } from "react";
import { useBLEContext } from "@/providers/BLEContext";

export default function LedPanel() {
  const initialButtons = Array.from({ length: 36 }, (_, index) => ({
    id: index,
    title: (index + 1).toString(),
    selected: false,
    availabe: true,
    inAnother: false,
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
      buttons[led.id].availabe = true;
      buttons[led.id].title = buttons[led.id].inAnother
        ? buttons[led.id].title + ", " + (segments.length + 1).toString()
        : (segments.length + 1).toString();
      buttons[led.id].inAnother = true;
      buttons[led.id].selected = false;
    });
  };

  const done = () => {
    console.log(segments);
    setButtons(initialButtons);
    setBLESegment(segments);
    setSegments([]);
  };

  const undo = () => {
    const selected = buttons.filter((button) => button.selected);

    if (selected.length !== 0) {
      setButtons((prevItems) =>
        prevItems.map((item) =>
          item.selected ? { ...item, selected: false } : item,
        ),
      );
    } else {
      const lastSegment = segments.at(-1);

      if (lastSegment) {
        setButtons((prevButtons) =>
          prevButtons.map((button, index) =>
            lastSegment.includes(index)
              ? button.title.includes(",")
                ? {
                    ...button,
                    title: button.title.slice(0, -3),
                    inAnother: false,
                  }
                : { ...button, title: (index + 1).toString(), inAnother: false }
              : button,
          ),
        );
        setSegments((prevItems) => prevItems.slice(0, -1));
      }
    }
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
        <CustomButton onPress={() => undo()} text="Undo"></CustomButton>
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
