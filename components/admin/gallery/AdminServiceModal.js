import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { COLORS } from "../../../config/Colors";

const AdminServiceModal = ({
  isVisible,
  onClose,
  onSubmit,
  selectedItem,
  newItem,
  onInputChange,
}) => {
  const [nameError, setNameError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setNameError("");
    setDurationError("");
    setPriceError("");
    setIsValid(true);
  }, [newItem]);

  const validateName = (name) => {
    if (!name.trim()) {
      return "El nombre del servicio es requerido.";
    }
    if (name.length > 50) {
      return "El nombre no puede exceder los 50 caracteres.";
    }
    return "";
  };

  const validateDuration = (duration) => {
    if (!duration.trim()) {
      return "La duración es requerida.";
    }
    const durationValue = parseInt(duration, 10);
    if (isNaN(durationValue) || durationValue <= 0) {
      return "La duración debe ser un número mayor que cero.";
    }
    if (duration.length > 4) {
      return "La duración no puede exceder los 4 dígitos.";
    }
    return "";
  };

  const validatePrice = (price) => {
    if (!price.trim()) {
      return "El precio es requerido.";
    }
    const priceValue = parseInt(price, 10);
    if (isNaN(priceValue) || priceValue < 0) {
      return "El precio debe ser un número mayor o igual a cero.";
    }
    if (price.length > 8) {
      return "El precio no puede exceder los 8 dígitos.";
    }
    return "";
  };

  const handleOnSubmit = () => {
    const nameErrorMessage = validateName(newItem.nombre);
    const durationErrorMessage = validateDuration(newItem.duracion_minutos);
    const priceErrorMessage = validatePrice(newItem.precio);

    setNameError(nameErrorMessage);
    setDurationError(durationErrorMessage);
    setPriceError(priceErrorMessage);

    if (!nameErrorMessage && !durationErrorMessage && !priceErrorMessage) {
      setIsValid(true);
      onSubmit();
    } else {
      setIsValid(false);
      Alert.alert(
        "Error de validación",
        "Por favor, corrige los errores en los campos.",
      );
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {selectedItem ? "Editar Servicio" : "Agregar Servicio"}
          </Text>

          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            value={newItem.nombre}
            onChangeText={(text) => onInputChange("nombre", text)}
            maxLength={50}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={newItem.descripcion}
            onChangeText={(text) => onInputChange("descripcion", text)}
          />

          <Text style={styles.label}>Duración (minutos):</Text>
          <TextInput
            style={[styles.input, durationError ? styles.inputError : null]}
            value={newItem.duracion_minutos}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              if (numericText.length <= 4) {
                onInputChange("duracion_minutos", numericText);
              }
            }}
            keyboardType="number-pad"
            maxLength={4}
          />
          {durationError ? (
            <Text style={styles.errorText}>{durationError}</Text>
          ) : null}

          <Text style={styles.label}>Precio:</Text>
          <TextInput
            style={[styles.input, priceError ? styles.inputError : null]}
            value={newItem.precio}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, "");
              if (numericText.length <= 8) {
                onInputChange("precio", numericText);
              }
            }}
            keyboardType="number-pad"
            maxLength={8}
          />
          {priceError ? (
            <Text style={styles.errorText}>{priceError}</Text>
          ) : null}

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleOnSubmit}
            >
              <Text style={styles.buttonText}>
                {selectedItem ? "Guardar Cambios" : "Crear"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.purple.text.hex,
  },
  label: {
    fontSize: 14,
    color: COLORS.purple.text.hex,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    backgroundColor: COLORS.purple.middle.hex,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: COLORS.purple.text.hex,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default AdminServiceModal;
