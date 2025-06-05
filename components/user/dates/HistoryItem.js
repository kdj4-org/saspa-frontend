// src/components/user/HistoryItem.jsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../../config/Colors";

// Recibe “cita” con la misma estructura que NextAppointment.
// Además de las listas “servicios”, “empleados” y “sedes” para buscar nombres.
const HistoryItem = ({ cita, servicios, empleados, sedes }) => {
  // Convertimos fecha ISO a Date y derivamos texto
  const dt = new Date(cita.fecha_inicio);
  const fechaStr = dt.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const horaStr = dt.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Nombre del servicio
  const servicioObj = servicios.find((s) => s.id === cita.servicio);
  const servicioNombre = servicioObj ? servicioObj.nombre : "—";

  // Nombre del empleado
  const empObj = empleados.find((e) => e.id === cita.empleado);
  const empleadoNombre = empObj ? empObj.nombre : "—";

  // Nombre de la sede
  const sedeObj = sedes.find((sd) => sd.id === cita.sede);
  const sedeNombre = sedeObj ? sedeObj.nombre : "—";

  // Estado (puedes mostrarlo si lo deseas)
  const estadoStr = cita.estado || "";

  return (
    <View style={styles.container}>
      <Text style={styles.servicio}>{servicioNombre}</Text>
      <Text style={styles.empleado}>{empleadoNombre}</Text>
      <Text style={styles.detalle}>
        {fechaStr} · {horaStr} · {sedeNombre}
      </Text>
      {estadoStr ? <Text style={styles.estado}>{estadoStr}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    padding: 10,
    backgroundColor: COLORS.purple.background.hex,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.purple.dark.hex,
  },
  servicio: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.purple.text.hex,
    marginBottom: 2,
  },
  empleado: {
    fontSize: 13,
    color: COLORS.purple.text.hex,
    marginBottom: 2,
  },
  detalle: {
    fontSize: 12,
    color: COLORS.purple.text.hex,
  },
  estado: {
    fontSize: 12,
    color: COLORS.purple.dark.hex,
    fontStyle: "italic",
    marginTop: 4,
  },
});

export default HistoryItem;
