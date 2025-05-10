// components/admin/team/AdminEmpleadoModal.js
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
import { Picker } from "@react-native-picker/picker";
import { useSedes } from "../../../hooks/useSedes";
import { COLORS } from "../../../config/Colors";
import { subirImagen } from "../../../services/images";
import * as ImagePicker from "expo-image-picker";

const AdminEmpleadoModal = ({
  isVisible,
  onClose,
  onSubmit,
  selectedItem,
  formData,
  onInputChange,
}) => {
  const [errors, setErrors] = useState({});
  const { sedes } = useSedes();

  useEffect(() => {
    setErrors({});
  }, [formData]);

  const validate = () => {
    const e = {};
    if (!formData.nombre?.trim()) e.nombre = "El nombre es requerido.";
    if (!formData.sede) e.sede = "La sede es requerida.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      Alert.alert("Errores de validación", "Revisa los campos resaltados.");
    } else {
      onSubmit();
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

        if (res.data?.filePath) {
          onInputChange("url_foto", res.data.filePath);
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
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {selectedItem ? "Editar Empleado" : "Agregar Empleado"}
          </Text>

          <Text style={styles.label}>Nombre*</Text>
          <TextInput
            style={[styles.input, errors.nombre && styles.errorBorder]}
            value={formData.nombre}
            onChangeText={(t) => onInputChange("nombre", t)}
          />
          {errors.nombre && <Text style={styles.error}>{errors.nombre}</Text>}

          <Text style={styles.label}>Sede*</Text>
          <View
            style={[styles.pickerWrapper, errors.sede && styles.errorBorder]}
          >
            <Picker
              selectedValue={formData.sede}
              onValueChange={(v) => onInputChange("sede", v)}
            >
              <Picker.Item label="Seleccione una sede..." value={null} />
              {sedes.map((s) => (
                <Picker.Item
                  key={s.id}
                  label={s.barrio + " - " + s.ciudad}
                  value={s.id}
                />
              ))}
            </Picker>
          </View>
          {errors.sede && <Text style={styles.error}>{errors.sede}</Text>}

          <Text style={styles.label}>Foto</Text>
          <TouchableOpacity
            onPress={seleccionarImagen}
            style={styles.imagePicker}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Seleccionar desde galería
            </Text>
          </TouchableOpacity>
          {formData.url_foto && (
            <Image source={{ uri: formData.url_foto }} style={styles.image} />
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
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
});

export default AdminEmpleadoModal;
