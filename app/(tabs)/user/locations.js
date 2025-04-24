// app/(tabs)/client/locations.js
import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { Screen } from "../../../components/Screen";
import Card from "../../../components/Card";
import { useSedes } from "../../../hooks/useSedes";

export default function ClientLocations() {
  // isAdmin = false → usa GET /usuario/sedes
  const { sedes, loading } = useSedes(false);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nuestras Sedes</Text>
        {loading ? (
          <Text style={styles.loading}>Cargando sedes…</Text>
        ) : Array.isArray(sedes) && sedes.length > 0 ? (
          sedes.map((sede) => (
            <Card key={sede.id} isAdmin={false}>
              <View style={styles.info}>
                <Text style={styles.direccion}>{sede.direccion}</Text>
                <Text style={styles.ciudad}>{sede.ciudad}</Text>
              </View>
            </Card>
          ))
        ) : (
          <Text style={styles.empty}>No hay sedes disponibles.</Text>
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
  loading: { textAlign: "center", marginTop: 20 },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
  info: { marginVertical: 8 },
  direccion: { fontSize: 18, fontWeight: "600" },
  ciudad: { fontSize: 16, color: "#555" },
});
