import { Colors } from "@/constants/Colors";
import { useBLEContext } from "@/providers/BLEContext";
import { template } from "@babel/core";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from "react-native";

type Template = {
  id: string;
  name: string;
  description: string;
  segments: number[][];
  changeSpeed: number;
  pswSpeed: number;
  active: boolean;
};

const templates: Template[] = [
  {
    id: "1",
    name: "Wave Flow",
    description: "A smooth flowing wave pattern.",
    segments: [
      [0, 1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10, 11],
      [12, 13, 14, 15, 16, 17],
      [18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29],
      [30, 31, 32, 33, 34, 35],
    ],
    changeSpeed: 50,
    pswSpeed: 30,
    active: false,
  },
  {
    id: "2",
    name: "Pulse Glow",
    description: "A pulsing glow effect across the LEDs.",
    segments: [
      [0, 6, 12, 18, 24, 30],
      [1, 7, 13, 19, 25, 31],
      [2, 8, 14, 20, 26, 32],
      [3, 9, 15, 21, 27, 33],
      [4, 10, 16, 22, 28, 34],
      [5, 11, 17, 23, 29, 35],
    ],
    changeSpeed: 70,
    pswSpeed: 60,
    active: false,
  },
  {
    id: "3",
    name: "Fire Flicker",
    description: "Randomized flickering pattern like fire.",
    segments: [
      [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
      [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
      [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33],
    ],
    changeSpeed: 40,
    pswSpeed: 20,
    active: false,
  },
  {
    id: "4",
    name: "Starlight",
    description: "Twinkling effect with random LEDs lighting up.",
    segments: [
      [0, 4, 8, 12, 16, 20, 24, 28, 32],
      [1, 5, 9, 13, 17, 21, 25, 29, 33],
      [2, 6, 10, 14, 18, 22, 26, 30, 34],
      [3, 7, 11, 15, 19, 23, 27, 31, 35],
    ],
    changeSpeed: 60,
    pswSpeed: 50,
    active: false,
  },
  {
    id: "5",
    name: "Lightning Strike",
    description: "A sudden bright flash across LEDs.",
    segments: [
      [0, 2, 4, 6, 8, 10, 12, 14, 16, 18],
      [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
      [20, 22, 24, 26, 28, 30, 32, 34],
      [21, 23, 25, 27, 29, 31, 33, 35],
    ],
    changeSpeed: 90,
    pswSpeed: 10,
    active: false,
  },
];

export default function TemplatesScreen() {
  const [activeTemplates, setActiveTemplates] = useState<Template[]>(templates);

  const { setBLESegment, setSpeed, uploadData } = useBLEContext();

  const toggleTemplate = (id: string) => {
    setActiveTemplates((prev) =>
      prev.map((template) =>
        template.id === id
          ? { ...template, active: !template.active }
          : { ...template, active: false },
      ),
    );

    const selectedTemplate = activeTemplates.find(
      (template) => template.id === id,
    );

    if (selectedTemplate) {
      if (selectedTemplate.active) {
        setBLESegment(selectedTemplate.segments);
        setSpeed("change", selectedTemplate.changeSpeed);
        setSpeed("ls", selectedTemplate.pswSpeed);
        uploadData();
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTemplates.map((template) => (
          <Pressable
            key={template.id}
            style={[styles.card, template.active && styles.cardActive]}
            onPress={() => toggleTemplate(template.id)}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>{template.name}</Text>
              </View>
              <Text style={styles.description}>{template.description}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardActive: {
    borderColor: Colors.dark.icon,
    borderWidth: 2,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  colorStrip: {
    height: 4,
    width: "100%",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  description: {
    fontSize: 14,
    color: "#888888",
  },
});
