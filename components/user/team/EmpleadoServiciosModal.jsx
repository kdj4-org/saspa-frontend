import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../../../config/Colors";

const EmpleadoServiciosModal = ({ isVisible, onClose, servicios, error }) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Servicios Vinculados</Text>
          {error ? (
            <Text style={styles.error}>
              Hubo un problema al cargar los servicios. Por favor, intenta más
              tarde.
            </Text>
          ) : servicios && servicios.length > 0 ? (
            <FlatList
              data={servicios}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.servicioItem}>
                  <Text>{item.nombre}</Text>
                </View>
              )}
            />
          ) : (
            <Text>Este empleado no tiene servicios vinculados.</Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
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
    minHeight: "40%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.purple.text.hex,
    textAlign: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  servicioItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  closeButton: {
    backgroundColor: COLORS.purple.middle.hex,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EmpleadoServiciosModal;
