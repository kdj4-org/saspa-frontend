import { ScrollView, Text, StyleSheet } from "react-native";
import { Screen } from "../../../components/Screen";
import { COLORS } from "../../../config/Colors";
import DatesReport from "../../../components/admin/profile/DatesReport";
import UserHeader from "../../../components/admin/profile/UserHeader";

export default function ProfilePage() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <UserHeader />
        <DatesReport />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
    marginBottom: 16,
  },
});
