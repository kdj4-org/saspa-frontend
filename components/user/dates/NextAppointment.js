// src/components/user/NextAppointment.jsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../config/Colors";

// NOTA: Recibe “cita” con forma:
// {
//   id: number,
//   fecha_inicio: string, // ISO
//   estado: string,
//   servicio: number,   // ID de servicio
//   empleado: number,   // ID de empleado
//   sede: number        // ID de sede
// }
//
// También recibe las listas “servicios”, “empleados” y “sedes” completas
// para buscar el nombre a partir del ID.
const NextAppointment = ({ cita, servicios, empleados, sedes }) => {
  if (!cita) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tu próxima cita es:</Text>
        <Text style={styles.noCita}>No tienes citas agendadas.</Text>
      </View>
    );
  }

  // Parseamos fecha y hora local
  const dt = new Date(cita.fecha_inicio);
  const fechaStr = dt.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }); // ej. "vie, 06/06/2025"
  const horaStr = dt.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }); // ej. "17:00"

  // Buscamos nombre de servicio
  const servicioObj = servicios.find((s) => s.id === cita.servicio);
  const servicioNombre = servicioObj ? servicioObj.nombre : "Servicio";

  // Buscamos nombre de empleado
  const empObj = empleados.find((e) => e.id === cita.empleado);
  const empleadoNombre = empObj ? empObj.nombre : "Especialista";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu próxima cita es:</Text>
      <View style={styles.card}>
        <Text style={styles.servicio}>{servicioNombre}</Text>
        <Text style={styles.empleado}>{empleadoNombre}</Text>
        <Text style={styles.detalle}>
          {fechaStr} · {horaStr}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: COLORS.purple.light.hex,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.purple.dark.hex,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.purple.text.hex,
    marginBottom: 8,
  },
  noCita: {
    fontSize: 14,
    fontStyle: "italic",
    color: COLORS.purple.text.hex + "80",
  },
  card: {
    backgroundColor: COLORS.purple.background.hex,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.purple.dark.hex,
  },
  servicio: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.purple.text.hex,
    marginBottom: 4,
  },
  empleado: {
    fontSize: 14,
    color: COLORS.purple.text.hex,
    marginBottom: 4,
  },
  detalle: {
    fontSize: 12,
    color: COLORS.purple.text.hex,
  },
});

export default NextAppointment;
