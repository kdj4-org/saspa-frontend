// src/screens/ClienteCitasScreen.jsx

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useServicios } from "../../../hooks/useServicios";
import { useEmpleados } from "../../../hooks/useEmpleados";
import { useSedes } from "../../../hooks/useSedes";
import { useDisponibilidad } from "../../../hooks/useDisponibilidad";
import { useCitasCliente } from "../../../hooks/useCitasClientes";
import { useAuth } from "../../../context/authContext";
import { COLORS } from "../../../config/Colors";
import { Screen } from "../../../components/Screen";
import EntryRow from "../../../components/user/dates/EntryRow";
import timeToLocalISOString from "../../../utils/timeToLocalISOString";

// Generador de IDs (o puedes usar índice si no agregas/quitas en el medio)
const generateId = () =>
  Date.now().toString() + Math.random().toString(36).slice(2, 5);

export default function ClienteCitasScreen() {
  const { user, loading: loadingAuth } = useAuth();
  const usuarioId = user?.user_id;

  const { servicios, loading: loadingServicios } = useServicios();
  const { empleados, loading: loadingEmpleados } = useEmpleados({
    admin: false,
  });
  const { sedes, loading: loadingSedes } = useSedes();
  // El hook useDisponibilidad entrega { horarios, bloqueos, loading, … }
  const {
    horarios,
    bloqueos,
    loading: loadingDisp,
    loadingBloqueos,
    loadBloqueos,
    loadHorarios,
  } = useDisponibilidad();
  const { crearCitaCliente } = useCitasCliente(usuarioId);

  const loadData = useCallback(() => {
    loadHorarios();
    loadBloqueos();
  }, [loadHorarios, loadBloqueos]);

  useFocusEffect(loadData);
  //
  // 1) Estado centralizado: arreglo de “filas” de cita
  //    Cada objeto dentro de `entries` tendrá:
  //      id: string único
  //      servicio: number|null
  //      empleado: number|null
  //      sede: number|null
  //      fecha: Date
  //      hora: string|null
  //
  const [entries, setEntries] = useState([
    {
      id: generateId(),
      servicio: null,
      empleado: null,
      sede: null,
      fecha: new Date(),
      hora: null,
    },
  ]);

  // 2) Función para actualizar un campo dado de una fila
  const updateEntryField = useCallback((rowId, field, value) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === rowId
          ? {
              ...e,
              [field]: value,
              // Si cambia servicio, limpiamos empleado y hora
              ...(field === "servicio" ? { empleado: null, hora: null } : {}),
              // Si cambia empleado, limpiamos hora
              ...(field === "empleado" ? { hora: null } : {}),
            }
          : e,
      ),
    );
  }, []);

  // 3) Agregar una nueva fila “vacía”
  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        id: generateId(),
        servicio: null,
        empleado: null,
        sede: null,
        fecha: new Date(),
        hora: null,
      },
    ]);
  };

  // 4) Eliminar una fila por su ID
  const removeEntry = useCallback((rowId) => {
    setEntries((prev) => prev.filter((e) => e.id !== rowId));
  }, []);

  // 5) Enviar todas las citas al backend
  const onAgendarCitas = async () => {
    try {
      for (const e of entries) {
        if (!e.servicio || !e.empleado || !e.sede || !e.fecha || !e.hora) {
          throw new Error("Complete todos los campos de cada servicio.");
        }
        // Convertir fecha+hora a ISO
        const [h, m] = e.hora.split(":").map(Number);
        const dt = new Date(e.fecha);
        dt.setHours(h, m, 0, 0);

        const localISO = timeToLocalISOString(dt);

        const payload = {
          fecha_inicio: localISO,
          servicio: e.servicio,
          empleado: e.empleado,
          sede: e.sede,
          estado: "por aprobar",
        };
        await crearCitaCliente(payload);
      }
      Alert.alert("Éxito", "Todas las citas se agendaron correctamente.");
      // Reinicio: dejo solo una fila vacía
      const firstId = generateId();
      setEntries([
        {
          id: firstId,
          servicio: null,
          empleado: null,
          sede: null,
          fecha: new Date(),
          hora: null,
        },
      ]);
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo agendar las citas.");
    }
  };

  // 6) Mostrar loader si alguno de los hooks de datos está en true o no hay usuario
  if (
    loadingAuth ||
    loadingServicios ||
    loadingEmpleados ||
    loadingSedes ||
    loadingDisp ||
    loadingBloqueos ||
    !usuarioId
  ) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reserva Tu Cita</Text>

        {entries.map((entry) => (
          <EntryRow
            key={entry.id}
            index={entry.id}
            servicio={entry.servicio}
            onChangeServicio={(rowId, val) =>
              updateEntryField(rowId, "servicio", val)
            }
            empleado={entry.empleado}
            onChangeEmpleado={(rowId, val) =>
              updateEntryField(rowId, "empleado", val)
            }
            sede={entry.sede}
            onChangeSede={(rowId, val) => updateEntryField(rowId, "sede", val)}
            fecha={entry.fecha}
            onChangeFecha={(rowId, date) =>
              updateEntryField(rowId, "fecha", date)
            }
            hora={entry.hora}
            onChangeHora={(rowId, val) => updateEntryField(rowId, "hora", val)}
            onRemoveRow={removeEntry}
            servicios={servicios}
            sedes={sedes}
            empleados={empleados}
            horarios={horarios}
            bloqueos={bloqueos}
          />
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addEntry}>
          <Text style={styles.addButtonText}>Agregar otro servicio...</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={onAgendarCitas}>
          <Text style={styles.buttonText}>Agendar cita</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
    alignSelf: "center",
    marginBottom: 16,
  },
  addButton: {
    marginVertical: 12,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: COLORS.purple.text.hex,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  saveButton: {
    backgroundColor: "#E0B6AB",
    borderColor: "#5D3A9B",
    borderWidth: 2,
    padding: 12,
    borderRadius: 999,
    marginBottom: 12,
    marginHorizontal: 90,
  },
  buttonText: {
    color: COLORS.purple.text.hex,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
