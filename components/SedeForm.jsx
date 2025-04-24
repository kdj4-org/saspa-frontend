// src/components/SedeForm.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Validación de campos
const MAX_CIUDAD = 50;
const MAX_DIRECCION = 100;
function validateSede({ ciudad, direccion }) {
  const errors = {};

  if (!ciudad.trim()) {
    errors.ciudad = "La ciudad es obligatoria.";
  } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿÑñ\s]+$/.test(ciudad)) {
    errors.ciudad = "La ciudad sólo puede contener letras y espacios.";
  } else if (ciudad.length > MAX_CIUDAD) {
    errors.ciudad = `Máximo ${MAX_CIUDAD} caracteres.`;
  }

  if (!direccion.trim()) {
    errors.direccion = "La dirección es obligatoria.";
  } else if (!/^[A-Za-z0-9À-ÖØ-öø-ÿÑñ\s#\-\.\,]+$/.test(direccion)) {
    errors.direccion =
      "Caracteres inválidos. Sólo letras, números, espacios, #, -, .";
  } else if (direccion.length > MAX_DIRECCION) {
    errors.direccion = `Máximo ${MAX_DIRECCION} caracteres.`;
  }

  return errors;
}

export default function SedeForm({ initialData, onClose, onSubmit }) {
  const isEdit = Boolean(initialData?.id);
  const [ciudad, setCiudad] = useState(initialData?.ciudad || "");
  const [direccion, setDireccion] = useState(initialData?.direccion || "");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setCiudad(initialData?.ciudad || "");
    setDireccion(initialData?.direccion || "");
    setErrors({});
  }, [initialData]);

  const handleSave = async () => {
    const vals = { ciudad, direccion };
    const errs = validateSede(vals);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await onSubmit({ id: initialData?.id, ciudad, direccion });
      onClose();
    } catch (e) {
      console.error("Error guardando sede:", e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {isEdit ? "Editar Sede" : "Nueva Sede"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ciudad"
        value={ciudad}
        onChangeText={setCiudad}
      />
      {errors.ciudad && <Text style={styles.error}>{errors.ciudad}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
      />
      {errors.direccion && <Text style={styles.error}>{errors.direccion}</Text>}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>{isEdit ? "Actualizar" : "Crear"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#9F71B3",
    padding: 20,
    borderRadius: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "#E0BBE4",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: "#6CD081",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#000",
  },
  editBtn: {
    backgroundColor: "#5394DE",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#000",
  },
  saveText: {
    fontWeight: "bold",
  },
  cancelBtn: {
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#DE5353",
    borderWidth: 1,
    borderColor: "#000",
  },
  cancelText: {
    fontWeight: "bold",
  },
});
