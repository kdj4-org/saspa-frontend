import React from "react";
import { Text, ScrollView } from "react-native";
import { Screen } from "../../../components/Screen";

export default function IndexPage() {
  return (
    <Screen>
      <ScrollView>
        <Text className="text-black text-xl font-bold mb-6">Inicio Admin</Text>
      </ScrollView>
    </Screen>
  );
}
