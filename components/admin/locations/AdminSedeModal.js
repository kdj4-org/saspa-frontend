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

const AdminSedeModal = ({
  isVisible,
  onClose,
  onSubmit,
  selectedItem,
  formData,
  onInputChange,
}) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isVisible) {
      resetForm();
    }
  }, [isVisible]);

  const validate = () => {
    const e = {};
    if (!formData.direccion?.trim()) e.direccion = "La dirección es requerida.";
    if (!formData.barrio?.trim()) e.barrio = "El barrio es requerido.";
    if (!formData.ciudad?.trim()) e.ciudad = "La ciudad es requerida.";
    if (!formData.horario?.trim()) e.horario = "El horario es requerido.";
    if (!formData.url_imagen) e.url_imagen = "La imagen es requerida.";
    return e;
  };

  const resetForm = () => {
    setErrors({});
    onInputChange("direccion", "");
    onInputChange("barrio", "");
    onInputChange("ciudad", "");
    onInputChange("horario", "");
    onInputChange("url_imagen", null);
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      Alert.alert("Errores de validación", "Revisa los campos resaltados.");
    } else {
      onSubmit();
      resetForm();
    }
  };

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

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => {
        resetForm();
        onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {selectedItem ? "Editar Sede" : "Agregar Sede"}
          </Text>

          <Text style={styles.label}>Dirección*</Text>
          <TextInput
            style={[styles.input, errors.direccion && styles.errorBorder]}
            value={formData.direccion}
            onChangeText={(t) => onInputChange("direccion", t)}
          />
          {errors.direccion && (
            <Text style={styles.error}>{errors.direccion}</Text>
          )}

          <Text style={styles.label}>Barrio*</Text>
          <TextInput
            style={[styles.input, errors.barrio && styles.errorBorder]}
            value={formData.barrio}
            onChangeText={(t) => onInputChange("barrio", t)}
          />
          {errors.barrio && <Text style={styles.error}>{errors.barrio}</Text>}

          <Text style={styles.label}>Ciudad*</Text>
          <TextInput
            style={[styles.input, errors.ciudad && styles.errorBorder]}
            value={formData.ciudad}
            onChangeText={(t) => onInputChange("ciudad", t)}
          />
          {errors.ciudad && <Text style={styles.error}>{errors.ciudad}</Text>}

          <Text style={styles.label}>Horario*</Text>
          <TextInput
            style={[styles.input, errors.horario && styles.errorBorder]}
            value={formData.horario}
            onChangeText={(t) => onInputChange("horario", t)}
          />
          {errors.horario && <Text style={styles.error}>{errors.horario}</Text>}

          <Text style={styles.label}>Imagen*</Text>
          <TouchableOpacity
            onPress={seleccionarImagen}
            style={styles.imagePicker}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Seleccionar desde galería
            </Text>
          </TouchableOpacity>
          {formData.url_imagen && (
            <Image source={{ uri: formData.url_imagen }} style={styles.image} />
          )}
          {errors.url_imagen && (
            <Text style={styles.error}>{errors.url_imagen}</Text>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => {
                resetForm();
                onClose();
              }}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.save} onPress={handleSave}>
              <Text style={styles.btnText}>
                {selectedItem ? "Guardar" : "Crear"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.purple.text.hex,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.purple.text.hex,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginTop: 4,
  },
  errorBorder: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
  imagePicker: {
    backgroundColor: COLORS.purple.middle.hex,
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
  },
  image: {
    width: "100%",
    height: 150,
    marginTop: 8,
    borderRadius: 6,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancel: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.purple.middle.hex,
    marginRight: 8,
  },
  save: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.purple.text.hex,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default AdminSedeModal;
