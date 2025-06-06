// src/screens/AdminDisponibilidadFinalScreen.jsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { addWeeks, format, startOfWeek, addDays } from "date-fns";
import { COLORS } from "../../../config/Colors";
import { useEmpleados } from "../../../hooks/useEmpleados";
import { useDisponibilidad } from "../../../hooks/useDisponibilidad";

const diasKey = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];
const diasLabel = diasKey.map(
  (d) => d.charAt(0).toUpperCase() + d.slice(1).substring(0, 2),
); // Lun, Mar...
// Slots de 30min de 6 a 18
const tiempos = Array.from({ length: (18 - 6) * 2 + 1 }, (_, i) => {
  const total = 6 * 60 + i * 30;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}:${m === 0 ? "00" : "30"}`;
});

export default function AdminDisponibilidadFinalScreen() {
  const { empleados } = useEmpleados({ admin: true });
  const { horarios, bloqueos } = useDisponibilidad();
  const [empleadoId, setEmpleadoId] = useState(null);
  const [semanaRef, setSemanaRef] = useState(new Date());

  const inicioSemana = useMemo(
    () => startOfWeek(semanaRef, { weekStartsOn: 1 }),
    [semanaRef],
  );

  // Filtrar por empleado
  const disp = useMemo(
    () => horarios.filter((h) => !empleadoId || h.empleado_id === empleadoId),
    [horarios, empleadoId],
  );
  const empleado = useMemo(
    () => empleados.find((e) => e.id === empleadoId),
    [empleados, empleadoId],
  );
  const bloq = useMemo(() => {
    if (!empleado) return [];
    // Filtrar bloqueos del empleado en la semana seleccionada
    return bloqueos.filter((b) => {
      if (b.empleado !== empleado.nombre) return false;
      const fecha = new Date(b.fecha_inicio);
      return fecha >= inicioSemana && fecha <= addDays(inicioSemana, 6);
    });
  }, [bloqueos, empleado, inicioSemana]);

  // Determinar estado de slot: libre (true) si disponible y no bloqueado
  const isLibre = (diaIdx, slot) => {
    const diaName = diasKey[diaIdx];
    const horario = disp.find((h) => h.empleado_id === empleadoId);
    const bloquesDia =
      horario?.disponibilidad?.find((d) => d.dia === diaName)?.bloques || [];
    const [hs, ms] = slot.split(":").map(Number);
    const slotMin = hs * 60 + ms;
    let libre = false;
    bloquesDia.forEach((b) => {
      const [hiH, hiM] = b.hora_inicio.split(":").map(Number);
      const [hfH, hfM] = b.hora_fin.split(":").map(Number);
      const si = hiH * 60 + hiM;
      const ei = hfH * 60 + hfM;
      if (slotMin >= si && slotMin < ei) libre = true;
    });
    if (!libre) return false;
    const fecha = addDays(inicioSemana, diaIdx);
    bloq.forEach((b) => {
      const d = new Date(b.fecha_inicio);
      if (
        d.getFullYear() === fecha.getFullYear() &&
        d.getMonth() === fecha.getMonth() &&
        d.getDate() === fecha.getDate()
      ) {
        const si = d.getHours() * 60 + d.getMinutes();
        const ei =
          new Date(b.fecha_fin).getHours() * 60 +
          new Date(b.fecha_fin).getMinutes();

        if (slotMin >= si && slotMin < ei) libre = false;
      }
    });
    return libre;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Disponibilidad Final</Text>
      <View style={styles.filterRow}>
        <Picker
          selectedValue={empleadoId}
          style={styles.picker}
          onValueChange={setEmpleadoId}
        >
          <Picker.Item label="--Seleccione--" value={null} />
          {empleados.map((e) => (
            <Picker.Item key={e.id} label={e.nombre} value={e.id} />
          ))}
        </Picker>
        {/* Mostrar controles de semana solo cuando hay empleado seleccionado */}
        {empleadoId && (
          <View style={styles.navRow}>
            <TouchableOpacity
              onPress={() => setSemanaRef(addWeeks(semanaRef, -1))}
              style={styles.navBtn}
            >
              <Text style={styles.navText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.weekLabel}>
              {format(inicioSemana, "dd/MM")} -{" "}
              {format(addDays(inicioSemana, 6), "dd/MM")}
            </Text>
            <TouchableOpacity
              onPress={() => setSemanaRef(addWeeks(semanaRef, 1))}
              style={styles.navBtn}
            >
              <Text style={styles.navText}>→</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Mostrar grilla solo cuando hay empleado seleccionado */}
      {empleadoId && (
        <>
          {/* Header dias */}
          <View style={styles.row}>
            <View style={styles.timeCell} />
            {diasLabel.map((d, i) => (
              <View key={i} style={styles.headerCell}>
                <Text style={styles.headerText}>{d}</Text>
              </View>
            ))}
          </View>
          {/* Filas timeslots */}
          {tiempos.map((t, ti) => (
            <View key={ti} style={styles.row}>
              <View style={styles.timeCell}>
                <Text style={styles.timeText}>{t}</Text>
              </View>
              {diasLabel.map((_, di) => (
                <TouchableOpacity
                  key={`${di}-${ti}`}
                  style={[
                    styles.slot,
                    { backgroundColor: isLibre(di, t) ? "#A8E6CF" : "#FF8C94" },
                  ]}
                  disabled
                />
              ))}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  picker: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    color: COLORS.purple.text.hex,
    fontWeight: "1000",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  navBtn: {
    padding: 6,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navText: {
    fontSize: 16,
    color: COLORS.purple.text.hex,
  },
  weekLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.purple.text.hex,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  timeCell: {
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCell: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.purple.text.hex,
    fontWeight: "bold",
  },
  slot: {
    width: 40,
    height: 30,
    margin: 1,
    borderRadius: 4,
  },
});
