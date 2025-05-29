import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../../config/Colors";

const DatesItem = ({ cita, updateEstado }) => {
  const handleApprove = () => {
    updateEstado(cita.id, "aprobar");
  };

  const handleReject = () => {
    updateEstado(cita.id, "rechazar");
  };

  const handleCancel = () => {
    updateEstado(cita.id, "cancelar");
  };

  const handleFinish = () => {
    updateEstado(cita.id, "terminada");
  };

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.serviceName}>{cita.servicioNombre}</Text>
        <Text style={styles.clientName}>{cita.clienteNombre}</Text>
        <Text style={styles.dateTime}>{`${cita.fecha} / ${cita.hora}`}</Text>
        <Text style={styles.sede}>{cita.sedeNombre}</Text>
        <Text style={styles.status}>Estado: {cita.estado}</Text>
      </View>
      {cita.estado === "en_espera" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={handleApprove}
          >
            <Text style={styles.buttonText}>Sí</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={handleReject}
          >
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      )}
      {cita.estado === "aceptada" && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.finishButton]}
            onPress={handleFinish}
          >
            <Text style={styles.buttonText}>Terminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  serviceName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: COLORS.darkPurple,
  },
  clientName: {
    color: COLORS.purple.text.hex,
    marginBottom: 3,
  },
  dateTime: {
    color: COLORS.gray.dark,
    marginBottom: 3,
  },
  sede: {
    color: COLORS.gray.dark,
    marginBottom: 3,
  },
  status: {
    color: COLORS.gray.medium,
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
    minWidth: 60,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: COLORS.yellow.light,
  },
  rejectButton: {
    backgroundColor: COLORS.red.intense,
  },
  cancelButton: {
    backgroundColor: COLORS.orange.medium,
  },
  finishButton: {
    backgroundColor: COLORS.green.medium,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DatesItem;
