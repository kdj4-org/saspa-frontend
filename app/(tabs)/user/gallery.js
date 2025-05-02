// app/(tabs)/user/gallery.js
import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { Screen } from "../../../components/Screen";
import { useServicios } from "../../../hooks/useServicios";

export default function Gallery() {
  const { servicios, loading } = useServicios(false);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nuestros Servicios</Text>
        <Text style={styles.subtitle}>Ofrecemos servicios de: </Text>
        {loading ? (
          <Text style={styles.loading}>Cargando servicios…</Text>
        ) : Array.isArray(servicios) && servicios.length > 0 ? (
          servicios.map((servicio, index) => (
            <Text key={servicio.id} style={styles.listItem}>
              {index + 1}. {servicio.nombre}
            </Text>
          ))
        ) : (
          <Text style={styles.empty}>No hay servicios disponibles.</Text>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#5D3A9B",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
    color: "#5D3A9B",
    fontWeight: "bold",
  },
  loading: { textAlign: "center", marginTop: 20 },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
  listItem: {
    fontSize: 16,
    marginBottom: 4,
    color: "#5D3A9B",
    fontWeight: "bold",
  },
});
