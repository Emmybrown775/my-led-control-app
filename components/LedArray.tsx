import { FlatList, StyleSheet, View } from "react-native";
import PressableLed from "./PressableLed";
import { ThemedText } from "./ThemedText";
import { useBLEContext } from "@/providers/BLEContext";
import { useEffect, useState } from "react";

export default function LedArray() {
  const initialCircles = Array.from({ length: 36 }, (_, index) => ({
    id: index,
    isOn: false,
  }));

  const [circles, setCircles] = useState(initialCircles);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const { segments, changeSpeed } = useBLEContext();

  const blinkLeds = () => {
    // Turn all LEDs off
    const updatedCircles = circles.map((circle) => ({
      ...circle,
      isOn: false,
    }));

    // Get the current segment
    const currentSegment = segments[currentSegmentIndex];

    // Turn on LEDs in the current segment
    if (currentSegment) {
      currentSegment.forEach((ledId) => {
        const circleIndex = updatedCircles.findIndex(
          (circle) => circle.id === ledId,
        );
        if (circleIndex !== -1) {
          updatedCircles[circleIndex].isOn = true;
        }
      });
    }

    // Update the state with the new circles
    setCircles(updatedCircles);

    // Move to the next segment
    setCurrentSegmentIndex((prevIndex) => (prevIndex + 1) % segments.length);
  };

  useEffect(() => {
    const interval = setInterval(
      blinkLeds,
      Math.floor(((changeSpeed - 0) * (0 - 10000)) / (100 - 0) + 10000),
    );

    return () => clearInterval(interval);
  }, [segments, changeSpeed, currentSegmentIndex]); // Add currentSegmentIndex to dependencies

  return (
    <View style={styles.outerContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.segment}>
          {circles
            .slice(0, 10)
            .reverse()
            .map((circle, index) => {
              return <PressableLed key={index} id={index} isOn={circle.isOn} />;
            })}
        </View>
        <View style={styles.middleSegment}>
          <View style={styles.ledRow}>
            {circles.slice(10, 26).map((circle, index) => {
              return <PressableLed key={index} id={index} isOn={circle.isOn} />;
            })}
          </View>
          <View style={styles.textContainer}>
            <ThemedText style={styles.titleText} type="subtitle">
              My Led Control App
            </ThemedText>
          </View>
        </View>
        <View style={styles.segment}>
          {circles.slice(26, 36).map((circle, index) => {
            return <PressableLed key={index} id={index} isOn={circle.isOn} />;
          })}
        </View>
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
