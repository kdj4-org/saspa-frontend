import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AdminEmpleadosPage from "../../../components/admin/team/AdminEmpleadoPage";
import { COLORS } from "../../../config/Colors";
import { Screen } from "../../../components/Screen";

export default function AdminEmpleadosScreen() {
  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.header}>Administrar Equipo</Text>
        <AdminEmpleadosPage />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.purple.background.hex,
    marginTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
    marginBottom: 16,
    textAlign: "center",
  },
});
