import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { COLORS } from "../../../config/Colors";
import { subirImagen } from "../../../services/images";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useServicios } from "../../../hooks/useServicios";

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
  const { servicios } = useServicios();

  useEffect(() => {
    setUrlError("");
    setDateError("");
    setServiceIdError("");
    setIsValid(true);
  }, [newItem]);

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      try {
        const archivo = result.assets[0];
        const res = await subirImagen(archivo);

        if (res.filePath) {
          onInputChange("url_imagen", res.filePath);
          Alert.alert("Éxito", "Imagen subida correctamente.");
        } else {
          throw new Error("No se recibió URL de la imagen");
        }
      } catch (err) {
        console.error("Error subiendo imagen", err);
        Alert.alert("Error", "No se pudo subir la imagen.");
      }
    }
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
    if (!id) {
      return "El servicio es requerido.";
    }
    return "";
  };

  const handleOnSubmit = () => {
    const dateErrorMessage = validateDate(newItem.fecha);
    const serviceIdErrorMessage = validateServiceId(newItem.servicio_id);

    setDateError(dateErrorMessage);
    setServiceIdError(serviceIdErrorMessage);

    if (!newItem.url_imagen) {
      setUrlError("La imagen es requerida.");
    } else {
      setUrlError("");
    }

    if (!urlError && !dateErrorMessage && !serviceIdErrorMessage) {
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

          <Text style={styles.label}>Imagen:</Text>
          <TouchableOpacity
            onPress={seleccionarImagen}
            style={styles.imagePicker}
          >
            <Text style={styles.buttonText}>Seleccionar desde galería</Text>
          </TouchableOpacity>
          {newItem.url_imagen && (
            <Image source={{ uri: newItem.url_imagen }} style={styles.image} />
          )}
          {urlError ? <Text style={styles.errorText}>{urlError}</Text> : null}

          <Text style={styles.label}>Fecha (YYYY-MM-DD):</Text>
          <TextInput
            style={[styles.input, dateError ? styles.inputError : null]}
            value={newItem.fecha}
            onChangeText={(text) => {
              const formattedDate = text
                .replace(/[^0-9-]/g, "")
                .replace(/(\d{4})(\d{2})/, "$1-$2")
                .replace(/(\d{4}-\d{2})(\d{2})/, "$1-$2");
              onInputChange("fecha", formattedDate);
            }}
            maxLength={10}
          />
          {dateError ? <Text style={styles.errorText}>{dateError}</Text> : null}

          <Text style={styles.label}>Servicio:</Text>
          <View
            style={[styles.pickerWrapper, serviceIdError && styles.inputError]}
          >
            <Picker
              selectedValue={newItem.servicio_id}
              onValueChange={(value) => onInputChange("servicio_id", value)}
            >
              <Picker.Item label="Seleccione un servicio..." value={null} />
              {servicios.map((servicio) => (
                <Picker.Item
                  key={servicio.id}
                  label={servicio.nombre}
                  value={servicio.id}
                />
              ))}
            </Picker>
          </View>
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
  imagePicker: {
    backgroundColor: COLORS.purple.middle.hex,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 12,
    borderRadius: 6,
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 12,
  },
});

export default AdminGalleryModal;
