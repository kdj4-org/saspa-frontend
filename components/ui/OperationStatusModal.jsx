import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../config/Colors";

const OperationStatusModal = ({
  isVisible,
  onClose,
  status,
  messageFailure = "Operación Fallida",
  messageSuccess = "Operación Exitosa",
  messageSolution = "Intente nuevamente.",
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {status === "success" ? messageSuccess : messageFailure}
          </Text>
          {status === "failure" && (
            <Text style={styles.modalMessage}>{messageSolution}</Text>
          )}
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: COLORS.purple.middle.hex,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default OperationStatusModal;
