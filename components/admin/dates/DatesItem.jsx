import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../../config/Colors";
import { DATE_STATES } from "../../../config/DateStates";
import { DATE_ACTIONS } from "../../../config/DateActions";

const DatesItem = ({ cita, onApprove, onReject, onCancel, onFinish }) => {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.textBold}>{cita.servicioNombre}</Text>
        <Text style={styles.textRegular}>{cita.clienteNombre}</Text>
        <Text style={styles.textRegular}>
          Fecha: {`${cita.fecha} / ${cita.hora}`}
        </Text>
        <Text style={styles.textRegular}>Sede: {cita.sedeNombre}</Text>
        <Text style={styles.textRegular}>Empleado: {cita.empleadoNombre}</Text>
        <Text style={styles.textRegular}>Estado: {cita.estado}</Text>
        <Text style={styles.textRegular}>Id Cita: {cita.id}</Text>
      </View>

      <View style={styles.actions}>
        {cita.estado === DATE_STATES.PENDING && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={onApprove}
            >
              <Text style={styles.buttonText}>{DATE_ACTIONS.APPROVE}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={onReject}
            >
              <Text style={styles.buttonText}>{DATE_ACTIONS.REJECT}</Text>
            </TouchableOpacity>
          </>
        )}

        {cita.estado === DATE_STATES.APPROVED && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.finishButton]}
              onPress={onFinish}
            >
              <Text style={styles.buttonText}>{DATE_ACTIONS.FINISH}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>{DATE_ACTIONS.CANCEL}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    flexDirection: "column",
    alignItems: "left",
    width: "100%",
  },
  info: {},
  actions: {
    margin: 1,
    padding: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  textBold: {
    fontWeight: "bold",
    marginBottom: 5,
    color: COLORS.darkPurple,
  },
  textRegular: {
    marginBottom: 5,
    color: COLORS.gray.dark,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 20,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: COLORS.purple.dark.hex,
  },
  rejectButton: {
    backgroundColor: COLORS.red.intense.hex,
  },
  cancelButton: {
    backgroundColor: COLORS.red.intense.hex,
  },
  finishButton: {
    backgroundColor: COLORS.purple.dark.hex,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DatesItem;
