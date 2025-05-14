// components/ui/OperationStatusModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../config/Colors";

const OperationStatusModal = ({ isVisible, onClose, status }) => {
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
            {status === "success"
              ? "Operación Exitosa"
              : status === "failure"
                ? "Operación Fallida"
                : ""}
          </Text>
          {status === "failure" && (
            <Text style={styles.modalMessage}>Intente nuevamente.</Text>
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
