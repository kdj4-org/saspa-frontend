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
import { Picker } from "@react-native-picker/picker";
import { useSedes } from "../../../hooks/useSedes";
import { COLORS } from "../../../config/Colors";

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

          <Text style={styles.label}>URL Foto</Text>
          <TextInput
            style={styles.input}
            value={formData.url_foto}
            onChangeText={(t) =>
              onInputChange("url_foto", t.trim() === "" ? null : t)
            }
          />

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
});

export default AdminEmpleadoModal;
