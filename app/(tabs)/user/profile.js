// src/screens/ClienteHistorialScreen.jsx

import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/authContext";
import { useCitasCliente } from "../../../hooks/useCitasClientes";
import { useServicios } from "../../../hooks/useServicios";
import { useEmpleados } from "../../../hooks/useEmpleados";
import { useSedes } from "../../../hooks/useSedes";
import NextAppointment from "../../../components/user/dates/NextAppointment";
import HistoryItem from "../../../components/user/dates/HistoryItem";
import { COLORS } from "../../../config/Colors";
import { Screen } from "../../../components/Screen";

export default function ClienteHistorialScreen() {
  const { user, logout, loading: loadingAuth } = useAuth();
  const usuarioId = user?.user_id;
  const nombreUsuario = user?.nombre || "Usuario";

  const router = useRouter();

  // Cargamos las citas del cliente
  const { citas, loading: loadingCitas, error } = useCitasCliente(usuarioId);

  // Cargamos listas maestras (servicios, empleados, sedes) para traducir IDs → nombres
  const { servicios, loading: loadingServicios } = useServicios();
  const { empleados, loading: loadingEmpleados } = useEmpleados({
    admin: false,
  });
  const { sedes, loading: loadingSedes } = useSedes();

  // Separar citas en futuras (>= ahora) y pasadas (< ahora)
  const ahora = useMemo(() => new Date(), []);
  const futuras = useMemo(
    () => citas.filter((c) => new Date(c.fecha_inicio) >= ahora),
    [citas, ahora],
  );
  const pasadas = useMemo(
    () => citas.filter((c) => new Date(c.fecha_inicio) < ahora),
    [citas, ahora],
  );

  const proxima = useMemo(() => {
    const ordenadas = futuras
      .slice()
      .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio));
    return ordenadas.length > 0 ? ordenadas[0] : null;
  }, [futuras]);

  // Mientras se cargan datos o aún no hay usuario:
  if (
    loadingAuth ||
    loadingCitas ||
    loadingServicios ||
    loadingEmpleados ||
    loadingSedes ||
    !usuarioId
  ) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar las citas.</Text>
      </View>
    );
  }

  // Acción de “Cerrar sesión”
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado con nombre del usuario y botón “Cerrar sesión” */}
        <View style={styles.header}>
          <Text style={styles.userName}>{nombreUsuario}</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Próxima cita */}
        <NextAppointment
          cita={proxima}
          servicios={servicios}
          empleados={empleados}
          sedes={sedes}
        />

        {/* Historial de citas pasadas */}
        <View style={styles.historialContainer}>
          <Text style={styles.historialTitle}>Últimas citas</Text>
          {pasadas.length === 0 && (
            <Text style={styles.noHistorial}>No tienes citas anteriores.</Text>
          )}
          {pasadas.slice(0, 5).map((cita) => (
            <HistoryItem
              key={cita.id}
              cita={cita}
              servicios={servicios}
              empleados={empleados}
              sedes={sedes}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: COLORS.purple.background.hex,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.purple.background.hex,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.purple.text.hex,
  },
  errorText: {
    fontSize: 14,
    color: "red",
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
  },
  logoutText: {
    fontSize: 14,
    color: "red",
  },
  historialContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: COLORS.purple.light.hex,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.purple.dark.hex,
  },
  historialTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.purple.text.hex,
    marginBottom: 8,
  },
  noHistorial: {
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.purple.text.hex + "80",
  },
});
