import { View } from "react-native";

export function Screen({ children }) {
  return <View className="flex-1 bg-purple-200 pt-4 px-4">{children}</View>;
}
