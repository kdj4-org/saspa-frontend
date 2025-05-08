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

const AdminGalleryModal = ({
  isVisible,
  onClose,
  onSubmit,
  selectedItem,
  newItem,
  onInputChange,
}) => {
  const [urlError, setUrlError] = useState("");
  const [dateError, setDateError] = useState("");
  const [serviceIdError, setServiceIdError] = useState("");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setUrlError("");
    setDateError("");
    setServiceIdError("");
    setIsValid(true);
  }, [newItem]);

  const validateURL = (url) => {
    if (!url.trim()) {
      return "La URL de la imagen es requerida.";
    }
    // Simple check for a valid URL format (can be improved)
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(url)) {
      return "Por favor, introduce una URL válida.";
    }
    return "";
  };

  const validateDate = (date) => {
    if (!date.trim()) {
      return "La fecha es requerida.";
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return "El formato de la fecha debe ser AAAA-MM-DD.";
    }
    const [year, month, day] = date.split("-").map(Number);
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return "Por favor, introduce una fecha válida.";
    }
    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > new Date(year, month, 0).getDate()
    ) {
      return "Por favor, introduce una fecha válida.";
    }
    return "";
  };

  const validateServiceId = (id) => {
    if (!id.trim()) {
      return "El ID del servicio es requerido.";
    }
    if (isNaN(parseInt(id, 10))) {
      return "El ID del servicio debe ser un número.";
    }
    return "";
  };

  const handleOnSubmit = () => {
    const urlErrorMessage = validateURL(newItem.url_imagen);
    const dateErrorMessage = validateDate(newItem.fecha);
    const serviceIdErrorMessage = validateServiceId(newItem.servicioId);

    setUrlError(urlErrorMessage);
    setDateError(dateErrorMessage);
    setServiceIdError(serviceIdErrorMessage);

    if (!urlErrorMessage && !dateErrorMessage && !serviceIdErrorMessage) {
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
            {selectedItem ? "Editar Publicación" : "Agregar Publicación"}
          </Text>

          <Text style={styles.label}>URL de la imagen:</Text>
          <TextInput
            style={[styles.input, urlError ? styles.inputError : null]}
            value={newItem.url_imagen}
            onChangeText={(text) => onInputChange("url_imagen", text)}
          />
          {urlError ? <Text style={styles.errorText}>{urlError}</Text> : null}

          <Text style={styles.label}>Fecha (YYYY-MM-DD):</Text>
          <TextInput
            style={[styles.input, dateError ? styles.inputError : null]}
            value={newItem.fecha}
            onChangeText={(text) => {
              // Auto-format date input
              const formattedDate = text
                .replace(/[^0-9-]/g, "")
                .replace(/(\d{4})(\d{2})/, "$1-$2")
                .replace(/(\d{4}-\d{2})(\d{2})/, "$1-$2");
              onInputChange("fecha", formattedDate);
            }}
            maxLength={10}
          />
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          <Text style={styles.label}>ID del Servicio:</Text>
          <TextInput
            style={[styles.input, serviceIdError ? styles.inputError : null]}
            value={newItem.servicioId}
            onChangeText={(text) =>
              onInputChange("servicioId", text.replace(/[^0-9]/g, ""))
            }
            keyboardType="number-pad"
          />
          {serviceIdError ? (
            <Text style={styles.errorText}>{serviceIdError}</Text>
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

export default AdminGalleryModal;
