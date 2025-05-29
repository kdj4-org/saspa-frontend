import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Screen } from "../../../components/Screen";
import Disponibilidad from "../../../components/admin/disponibility/AdminDisponibilidad";
import Bloqueos from "../../../components/admin/disponibility/AdminBloqueos";
import DisponibilidadFinal from "../../../components/admin/disponibility/AdminDisponibilidadFinal";
import { useDisponibilidad } from "../../../hooks/useDisponibilidad";
import { COLORS } from "../../../config/Colors";

export default function IndexPage() {
  const { disponibilidad, bloqueos, saveDisponibilidad, addBloqueo } =
    useDisponibilidad();
  const [activeTab, setActiveTab] = React.useState("disponibilidad");
  const tabs = [
    { key: "disponibilidad", label: "Disponibilidad" },
    { key: "bloqueos", label: "Bloqueos" },
    { key: "final", label: "Final" },
  ];

  return (
    <Screen>
      <View style={styles.tabContainer}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setActiveTab(t.key)}
            style={[
              styles.tabButton,
              activeTab === t.key && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === t.key && styles.tabLabelActive,
              ]}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {activeTab === "disponibilidad" && (
          <Disponibilidad
            disponibilidad={disponibilidad}
            onSave={saveDisponibilidad}
          />
        )}
        {activeTab === "bloqueos" && (
          <Bloqueos bloqueos={bloqueos} onAddBloqueo={addBloqueo} />
        )}
        {activeTab === "final" && (
          <DisponibilidadFinal
            disponibilidad={disponibilidad}
            bloqueos={bloqueos}
          />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  tabButton: {
    padding: 8,
    borderBottomWidth: 0,
    borderColor: COLORS.purple.text.hex,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderColor: COLORS.purple.text.hex,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: "normal",
    color: COLORS.purple.text.hex,
  },
  tabLabelActive: {
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
  },
  contentContainer: {
    padding: 12,
  },
});
