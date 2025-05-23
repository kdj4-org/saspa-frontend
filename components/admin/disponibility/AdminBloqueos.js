// src/screens/AdminBloqueosScreen.jsx
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useEmpleados } from "../../../hooks/useEmpleados";
import { useDisponibilidad } from "../../../hooks/useDisponibilidad";
import { Screen } from "../../../components/Screen";
import { COLORS } from "../../../config/Colors";

// Horas de 6:00 a 18:00 en intervalos de 30 minutos
const horasDisponibles = Array.from({ length: (18.5 - 6) * 2 }, (_, i) => {
  const totalMin = 6 * 60 + i * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h.toString().padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
});

export default function AdminBloqueosScreen() {
  const { empleados } = useEmpleados({
    admin: true,
  });

  // Desestructurar loadingBloqueos correctamente
  const { bloqueos, crearBloqueo, deleteBloqueo } = useDisponibilidad();

  const [selectedEmp, setSelectedEmp] = useState(null);
  const [fecha, setFecha] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [horaInicio, setHoraInicio] = useState(horasDisponibles[0]);
  const [horaFin, setHoraFin] = useState(horasDisponibles[1]);

  const filtered = bloqueos.map((b) => {
    const empleado = empleados.find((e) => e.id === b.empleado_id);
    return {
      ...b,
      empleadoNombre: empleado?.nombre || "Desconocido",
    };
  });

  const addBloqueo = async () => {
    if (!selectedEmp) return Alert.alert("Error", "Seleccione un empleado");
    const start = new Date(fecha);
    const [hI, mI] = horaInicio.split(":").map(Number);
    start.setHours(hI, mI);
    const end = new Date(fecha);
    const [hF, mF] = horaFin.split(":").map(Number);
    end.setHours(hF, mF);
    try {
      await crearBloqueo({
        fecha_inicio: start.toISOString(),
        fecha_fin: end.toISOString(),
        empleado_id: selectedEmp,
        cita_id: null,
      });
      Alert.alert("Éxito", "Bloqueo agregado");
    } catch {
      Alert.alert("Error", "No se pudo agregar bloqueo");
    }
  };

  const removeBloqueo = (id) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este bloqueo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBloqueo(id);
              Alert.alert("Éxito", "Bloqueo eliminado");
            } catch {
              Alert.alert("Error", "No se pudo eliminar bloqueo");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Gestión de Bloqueos</Text>

        <Text style={styles.label}>Empleado:</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={selectedEmp} onValueChange={setSelectedEmp}>
            <Picker.Item label="-- Seleccione --" value={null} />
            {empleados.map((e) => (
              <Picker.Item key={e.id} label={e.nombre} value={e.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Fecha:</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={styles.dateInput}
        >
          <Text>{fecha.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display="default"
            onChange={(_, d) => {
              setShowPicker(false);
              if (d) setFecha(d);
            }}
          />
        )}

        <Text style={styles.label}>Hora Inicio:</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={horaInicio} onValueChange={setHoraInicio}>
            {horasDisponibles.map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Hora Fin:</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={horaFin} onValueChange={setHoraFin}>
            {horasDisponibles.map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={addBloqueo}>
          <Text style={styles.buttonText}>Agregar Bloqueo</Text>
        </TouchableOpacity>

        <Text style={[styles.subtitle, { marginTop: 20 }]}>
          Bloqueos Registrados
        </Text>

        {filtered.length === 0 ? (
          <Text style={{ marginVertical: 10 }}>No hay bloqueos</Text>
        ) : (
          filtered.map((item) => (
            <View key={item.id} style={styles.blockRow}>
              <Text>
                {item.empleado} -{" "}
                {new Date(item.fecha_inicio).toLocaleDateString()}{" "}
                {new Date(item.fecha_inicio).toLocaleTimeString()} -{" "}
                {new Date(item.fecha_fin).toLocaleTimeString()}
              </Text>
              <TouchableOpacity onPress={() => removeBloqueo(item.id)}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.purple.text.hex,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
    marginTop: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    marginVertical: 4,
    backgroundColor: "#fff",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginVertical: 4,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: COLORS.purple.middle.hex,
    padding: 10,
    borderRadius: 5,
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  blockRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
  },
  deleteText: {
    color: "red",
    fontWeight: "bold",
  },
});
