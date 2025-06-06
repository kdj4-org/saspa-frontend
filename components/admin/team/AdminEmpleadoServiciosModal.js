import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useServicios } from "../../../hooks/useServicios";
import { useEmpleadosServicios } from "../../../hooks/useEmpleadosServicios";
import { useEmpleados } from "../../../hooks/useEmpleados";
import ModalTitle from "../../ui/ModalTitle";
import SelectableListItem from "../../ui/SelectableListItem";
import ModalButtons from "../../ui/ModalButtons";
import LoadingOverlay from "../../ui/LoadingOverlay";
import { print_error } from "../../../utils/development";

const AdminEmpleadoServiciosModal = ({
  isVisible,
  onClose,
  empleadoId,
  empleadoNombre,
}) => {
  const { servicios, loading: loadingServicios } = useServicios();
  const {
    loadingServiciosVinculados,
    errorServiciosVinculados,
    vincularServicioEmpleado,
    desvincularServicioEmpleado,
    initialServiciosIds,
  } = useEmpleadosServicios(empleadoId);
  const { loadEmpleados } = useEmpleados({ admin: false });

  const [selectedServicios, setSelectedServicios] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (servicios && servicios.length > 0 && initialServiciosIds) {
      const initialSelected = servicios
        .filter((servicio) => initialServiciosIds.includes(servicio.id))
        .map((s) => s.id);
      setSelectedServicios(initialSelected);
    } else {
      setSelectedServicios([]);
    }
  }, [servicios, initialServiciosIds, isVisible]);

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

    setIsSaving(true);
    let operationSuccess = true;
    let errorMessage = null;

    const initialIds = [...initialServiciosIds];
    const currentSelectedIds = [...selectedServicios];

    const serviciosAVincular = currentSelectedIds.filter(
      (id) => !initialIds.includes(id),
    );

    const serviciosADesvincular = initialIds.filter(
      (id) => !currentSelectedIds.includes(id),
    );

    for (const servicioId of serviciosAVincular) {
      try {
        await vincularServicioEmpleado(servicioId);
      } catch (error) {
        operationSuccess = false;
        errorMessage = "Ocurrió un error al intentar guardar los cambios.";
        print_error("Error al vincular servicio:", error);
        break;
      }
      if (!operationSuccess) break;
    }

    if (operationSuccess) {
      for (const servicioId of serviciosADesvincular) {
        try {
          await desvincularServicioEmpleado(servicioId);
        } catch (error) {
          operationSuccess = false;
          errorMessage = "Ocurrió un error al intentar guardar los cambios.";
          print_error("Error al desvincular servicio:", error);
          break;
        }
        if (!operationSuccess) break;
      }
    }

    setIsSaving(false);

    if (operationSuccess) {
      onClose("success");
      await loadEmpleados();
    } else if (errorMessage) {
      onClose("failure");
    }
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => onClose(null)}
    >
      <View style={styles.overlay}>
        <LoadingOverlay isVisible={isSaving} />
        <View style={styles.container}>
          <ModalTitle title={`Vincular servicios a ${empleadoNombre}`} />

          {loadingServicios || loadingServiciosVinculados ? (
            <Text>Cargando servicios...</Text>
          ) : errorServiciosVinculados ? (
            <Text style={styles.error}>{errorServiciosVinculados}</Text>
          ) : (
            <FlatList
              data={servicios}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <SelectableListItem
                  item={item}
                  isSelected={selectedServicios.includes(item.id)}
                  onPress={() => toggleServicio(item.id)}
                  disabled={isSaving}
                />
              )}
            />
          )}

          <ModalButtons
            onCancel={() => onClose(null)}
            onSave={handleGuardarServicios}
            disabledSave={isSaving}
            disabledCancel={isSaving}
          />
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
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default AdminEmpleadoServiciosModal;
