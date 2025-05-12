import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { useServicios } from "../../../hooks/useServicios";
import { useEmpleadosServicios } from "../../../hooks/useEmpleadosServicios";
import { COLORS } from "../../../config/Colors";

const AdminEmpleadoServiciosModal = ({
  isVisible,
  onClose,
  empleadoId,
  empleadoNombre,
}) => {
  const { servicios, loading: loadingServicios } = useServicios();
  const {
    serviciosVinculados,
    loadingServiciosVinculados,
    errorServiciosVinculados,
    vincularServicioEmpleado,
    desvincularServicioEmpleado,
  } = useEmpleadosServicios(empleadoId);

  const [selectedServicios, setSelectedServicios] = useState([]);

  useEffect(() => {
    // Inicializar los servicios seleccionados con los que ya están vinculados
    if (
      serviciosVinculados &&
      serviciosVinculados.length > 0 &&
      servicios &&
      servicios.length > 0
    ) {
      const initialSelected = servicios
        .filter((servicio) =>
          serviciosVinculados.some(
            (vinculado) => vinculado.servicioId === servicio.id,
          ),
        )
        .map((s) => s.id);
      setSelectedServicios(initialSelected);
    } else {
      setSelectedServicios([]);
    }
  }, [servicios, serviciosVinculados]);

  const toggleServicio = (servicioId) => {
    if (selectedServicios.includes(servicioId)) {
      setSelectedServicios(selectedServicios.filter((id) => id !== servicioId));
    } else {
      setSelectedServicios([...selectedServicios, servicioId]);
    }
  };

  const handleGuardarServicios = async () => {
    if (!empleadoId) {
      Alert.alert("Error", "No se ha seleccionado ningún empleado.");
      return;
    }

    const serviciosAVincular = selectedServicios.filter(
      (id) => !serviciosVinculados.some((v) => v.servicioId === id),
    );
    const serviciosADesvincular = serviciosVinculados
      .filter((v) => !selectedServicios.includes(v.servicioId))
      .map((v) => v.servicioId);

    let success = true;

    for (const servicioId of serviciosAVincular) {
      try {
        await vincularServicioEmpleado(servicioId);
        // SASPA-108: Mostrar mensaje de éxito al vincular
        Alert.alert(
          "Éxito",
          `Servicio ${servicios.find((s) => s.id === servicioId)?.nombre} vinculado.`,
        );
      } catch (error) {
        success = false;
        // SASPA-109: Mostrar mensaje de error si la vinculación falla
        Alert.alert(
          "Error",
          `No se pudo vincular el servicio ${servicios.find((s) => s.id === servicioId)?.nombre}.`,
        );
        console.error("Error al vincular servicio:", error);
      }
    }

    for (const servicioId of serviciosADesvincular) {
      try {
        await desvincularServicioEmpleado(servicioId);
        // SASPA-108: Mostrar mensaje de éxito al desvincular
        Alert.alert(
          "Éxito",
          `Servicio ${servicios.find((s) => s.id === servicioId)?.nombre} desvinculado.`,
        );
      } catch (error) {
        success = false;
        // SASPA-109: Mostrar mensaje de error si la desvinculación falla
        Alert.alert(
          "Error",
          `No se pudo desvincular el servicio ${servicios.find((s) => s.id === servicioId)?.nombre}.`,
        );
        console.error("Error al desvincular servicio:", error);
      }
    }

    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Vincular servicios a {empleadoNombre}{" "}
          </Text>

          {loadingServicios || loadingServiciosVinculados ? (
            <Text>Cargando servicios...</Text>
          ) : errorServiciosVinculados ? (
            <Text style={styles.error}>{errorServiciosVinculados}</Text>
          ) : (
            <FlatList
              data={servicios}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.servicioItem,
                    selectedServicios.includes(item.id) &&
                      styles.servicioSeleccionado,
                  ]}
                  onPress={() => toggleServicio(item.id)}
                >
                  <Text>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.save}
              onPress={handleGuardarServicios}
            >
              <Text style={styles.btnText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: "50%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.purple.text.hex,
    textAlign: "center",
  },
  servicioItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  servicioSeleccionado: {
    backgroundColor: COLORS.purple.middle.hex,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancel: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.purple.middle.hex,
    marginRight: 8,
  },
  save: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.purple.text.hex,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default AdminEmpleadoServiciosModal;
