import { FlatList, StyleSheet, View } from "react-native";
import PressableLed from "./PressableLed";
import { ThemedText } from "./ThemedText";

const generateCircles = () => {
  const circles = [];
  for (let i = 0; i < 36; i++) {
    const size = 100;
    circles.push(<PressableLed key={i} id={i} />);
  }
  return circles;
};

const circles = generateCircles();

export default function LedArray() {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.segment}>{circles.slice(0, 10)}</View>
        <View style={styles.middleSegment}>
          <View style={styles.ledRow}>{circles.slice(10, 26)}</View>
          <View style={styles.textContainer}>
            <ThemedText style={styles.titleText} type="subtitle">
              My Led Control
            </ThemedText>
          </View>
        </View>
        <View style={styles.segment}>{circles.slice(0, 10)}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: {
    flexDirection: "row",
  },
  segment: {},
  middleSegment: {
    alignItems: "center",
  },
  ledRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    paddingTop: 70,
  },
  titleText: {
    textAlign: "center",
  },
});
