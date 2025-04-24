import { ScrollView, Text } from "react-native";
import { Screen } from "../../../components/Screen";

export default function DatesPage() {
  return (
    <Screen>
      <ScrollView>
        <Text className="text-black text-xl font-bold mb-6">Citas</Text>
      </ScrollView>
    </Screen>
  );
}
