import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../../config/Colors";

const DatesStateFiltersModal = ({
  isVisible,
  onClose,
  selectedStatus,
  handleStatusFilter,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Filtrar por estado</Text>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === "" && styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter("")}
          >
            <Text style={styles.filterOptionText}>
              Todas {selectedStatus === "" ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === "En espera" && styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter("En espera")}
          >
            <Text style={styles.filterOptionText}>
              En espera {selectedStatus === "En espera" ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === "aceptada" && styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter("aceptada")}
          >
            <Text style={styles.filterOptionText}>
              Aceptada {selectedStatus === "aceptada" ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === "rechazada" && styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter("rechazada")}
          >
            <Text style={styles.filterOptionText}>
              Rechazada {selectedStatus === "rechazada" ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === "cancelada" && styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter("cancelada")}
          >
            <Text style={styles.filterOptionText}>
              Cancelada {selectedStatus === "cancelada" ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === "terminada" && styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter("terminada")}
          >
            <Text style={styles.filterOptionText}>
              Terminada {selectedStatus === "terminada" ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: COLORS.purple.text.hex,
    textAlign: "center",
  },
  filterOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterOptionText: {
    fontSize: 16,
    color: COLORS.purple.text.hex,
  },
  activeFilterOption: {
    backgroundColor: COLORS.purple.light.hex,
  },
  closeButton: {
    backgroundColor: COLORS.gray.medium.hex,
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DatesStateFiltersModal;
