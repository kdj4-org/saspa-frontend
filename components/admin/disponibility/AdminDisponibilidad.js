// src/screens/AdminDisponibilidadScreen.jsx
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { COLORS } from "../../../config/Colors";
import { useEmpleados } from "../../../hooks/useEmpleados";
import { useDisponibilidad } from "../../../hooks/useDisponibilidad";
import { Screen } from "../../../components/Screen";
import { Picker } from "@react-native-picker/picker";

const dias = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];
// Slots de 30 minutos de 6:00 a 18:00
const tiempos = Array.from({ length: (18 - 6) * 2 + 1 }, (_, i) => {
  const totalMin = 6 * 60 + i * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}:${m === 0 ? "00" : "30"}`;
});

export default function AdminDisponibilidadScreen() {
  const { empleados } = useEmpleados({
    admin: true,
  });
  const { horarios, crearDisponibilidad, actualizarDisponibilidad } =
    useDisponibilidad();

  const [selectedEmp, setSelectedEmp] = useState(null);

  const initGrid = useCallback(() => {
    const g = {};
    dias.forEach((d) => {
      g[d] = {};
      tiempos.forEach((t) => {
        g[d][t] = false;
      });
    });
    return g;
  }, []);

  const [grid, setGrid] = useState(initGrid);
  const [disponibilidadData, setDisponibilidadData] = useState({});

  useEffect(() => {
    const baseGrid = initGrid();
    if (selectedEmp && horarios) {
      const empHorario = horarios.find((h) => h.empleado_id === selectedEmp);
      if (empHorario) {
        empHorario.disponibilidad.forEach(({ dia, bloques }) => {
          bloques.forEach(({ hora_inicio, hora_fin }) => {
            const [hInit, mInit] = hora_inicio.split(":");
            const [hEnd, mEnd] = hora_fin.split(":");
            const startMin = parseInt(hInit) * 60 + parseInt(mInit);
            const endMin = parseInt(hEnd) * 60 + parseInt(mEnd);
            tiempos.forEach((slot) => {
              const [hs, ms] = slot.split(":");
              const slotMin = parseInt(hs) * 60 + parseInt(ms);
              if (slotMin >= startMin && slotMin < endMin) {
                baseGrid[dia][slot] = true;
              }
            });
          });
        });
      }
    }
    setGrid(baseGrid);
  }, [selectedEmp, horarios, initGrid]);

  useEffect(() => {
    const nuevos = {};
    dias.forEach((dia) => {
      const slotsAct = Object.entries(grid[dia] || {})
        .filter(([_, act]) => act)
        .map(([t]) => t);
      nuevos[dia] = slotsAct;
    });
    setDisponibilidadData(nuevos);
  }, [grid]);

  const toggleSlot = (dia, slot) => {
    setGrid((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [slot]: !prev[dia][slot] },
    }));
  };

  const handleSave = async () => {
    if (!selectedEmp) return;
    const bloques = [];
    Object.entries(disponibilidadData).forEach(([dia, slots]) => {
      if (slots.length) {
        const mins = slots
          .map((t) => {
            const [h, m] = t.split(":");
            return parseInt(h) * 60 + parseInt(m);
          })
          .sort((a, b) => a - b);
        let start = mins[0];
        let prev = mins[0];
        for (let i = 1; i < mins.length; i++) {
          if (mins[i] === prev + 30) prev = mins[i];
          else {
            bloques.push({ dia, hora_inicio: start, hora_fin: prev + 30 });
            start = mins[i];
            prev = mins[i];
          }
        }
        bloques.push({ dia, hora_inicio: start, hora_fin: prev + 30 });
      }
    });
    const payload = {
      disponibilidad: bloques.map(({ dia, hora_inicio, hora_fin }) => ({
        dia,
        bloques: [
          {
            hora_inicio: `${String(Math.floor(hora_inicio / 60)).padStart(2, "0")}:${String(hora_inicio % 60).padStart(2, "0")}:00`,
            hora_fin: `${String(Math.floor(hora_fin / 60)).padStart(2, "0")}:${String(hora_fin % 60).padStart(2, "0")}:00`,
          },
        ],
      })),
    };
    try {
      const exists = horarios.some((h) => h.empleado_id === selectedEmp);
      if (exists) await actualizarDisponibilidad(selectedEmp, payload);
      else await crearDisponibilidad(selectedEmp, payload);
      Alert.alert("Éxito", "Disponibilidad guardada correctamente.");
    } catch {
      Alert.alert("Error", "No se pudo guardar la disponibilidad.");
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Seleccionar Empleado</Text>
        <Picker
          selectedValue={selectedEmp}
          onValueChange={(val) => setSelectedEmp(val)}
          style={styles.picker}
        >
          <Picker.Item label="-- Seleccione --" value={null} />
          {empleados.map((e) => (
            <Picker.Item key={e.id} label={e.nombre} value={e.id} />
          ))}
        </Picker>

        {selectedEmp && (
          <>
            <Text style={styles.subtitle}>Disponibilidad</Text>
            {/* Header con días */}
            <View style={styles.gridHeader}>
              <View style={styles.timeCell} />
              {dias.map((d) => (
                <Text key={d} style={styles.diaHeader}>
                  {d.slice(0, 3)}
                </Text>
              ))}
            </View>
            {/* Filas por hora */}
            {tiempos.map((t) => (
              <View key={t} style={styles.row}>
                <Text style={styles.timeCell}>{t}</Text>
                {dias.map((d) => (
                  <TouchableOpacity
                    key={`${d}-${t}`}
                    style={[
                      styles.slot,
                      { backgroundColor: grid[d][t] ? "#A8E6CF" : "#FF8C94" },
                    ]}
                    onPress={() => toggleSlot(d, t)}
                  />
                ))}
              </View>
            ))}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar Disponibilidad</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.purple.text.hex,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
    color: COLORS.purple.text.hex,
  },
  picker: {
    width: "80%",
    marginBottom: 16,
    color: COLORS.purple.text.hex,
  },
  gridHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  diaHeader: {
    minWidth: 42,
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  timeCell: {
    width: 50,
    textAlign: "center",
    fontWeight: "600",
    color: COLORS.purple.text.hex,
  },
  slot: {
    width: 40,
    height: 30,
    margin: 1,
    borderRadius: 4,
  },
  saveButton: {
    backgroundColor: COLORS.purple.middle.hex,
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
