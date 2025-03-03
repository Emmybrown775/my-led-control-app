import { Pressable, View } from "react-native";

export type CircleProps = {
  id: number;
  size?: number;
  isOn?: boolean;
};

export default function PressableLed({
  id,
  size = 10,
  isOn = false,
}: CircleProps) {
  return (
    <Pressable
      style={{
        margin: 4,
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isOn ? "blue" : "white",
        }}
      ></View>
    </Pressable>
  );
}
