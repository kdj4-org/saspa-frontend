import { useEffect } from "react";
import { print_log } from "../../../utils/development";
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

  useEffect(() => {
    print_log(cita);
  }, [cita]);

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
  textBold: {
    fontWeight: "bold",
    marginBottom: 5,
    color: COLORS.darkPurple,
  },
  textRegular: {
    marginBottom: 5,
    color: COLORS.gray.dark,
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
