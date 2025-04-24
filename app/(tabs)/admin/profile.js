import { ScrollView, Text } from "react-native";
import { Screen } from "../../../components/Screen";

export default function ProfilePage() {
  return (
    <Screen>
      <ScrollView>
        <Text className="text-black text-xl font-bold mb-6">Perfil</Text>
      </ScrollView>
    </Screen>
  );
}
