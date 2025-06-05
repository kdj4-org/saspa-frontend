import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../../config/Colors";
import { DATE_STATES } from "../../../config/DateStates";

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
              selectedStatus === DATE_STATES.PENDING &&
                styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter(DATE_STATES.PENDING)}
          >
            <Text style={styles.filterOptionText}>
              En espera{" "}
              {selectedStatus === DATE_STATES.PENDING ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === DATE_STATES.APPROVED &&
                styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter(DATE_STATES.APPROVED)}
          >
            <Text style={styles.filterOptionText}>
              Aceptada{" "}
              {selectedStatus === DATE_STATES.APPROVED ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === DATE_STATES.REJECTED &&
                styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter(DATE_STATES.REJECTED)}
          >
            <Text style={styles.filterOptionText}>
              Rechazada{" "}
              {selectedStatus === DATE_STATES.REJECTED ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === DATE_STATES.CANCELED &&
                styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter(DATE_STATES.CANCELED)}
          >
            <Text style={styles.filterOptionText}>
              Cancelada{" "}
              {selectedStatus === DATE_STATES.CANCELED ? "(Activo)" : ""}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterOption,
              selectedStatus === DATE_STATES.FINISHED &&
                styles.activeFilterOption,
            ]}
            onPress={() => handleStatusFilter(DATE_STATES.FINISHED)}
          >
            <Text style={styles.filterOptionText}>
              Terminada{" "}
              {selectedStatus === DATE_STATES.FINISHED ? "(Activo)" : ""}
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
