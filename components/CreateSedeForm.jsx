// src/components/CreateSedeForm.jsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function CreateSedeForm({ onClose, onSubmit }) {
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");

  const handleSave = async () => {
    if (ciudad.trim() && direccion.trim()) {
      try {
        console.log("🚀 creando sede", { ciudad, direccion });
        await onSubmit({ ciudad, direccion }); // espera al POST
        console.log("✅ createSede completado");
        onClose();
      } catch (e) {
        console.error("❌ error en onSubmit:", e);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ciudad</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Medellín"
        value={ciudad}
        onChangeText={setCiudad}
      />
      <Text style={styles.label}>Dirección</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Calle 123 #45-67"
        value={direccion}
        onChangeText={setDireccion}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#9F71B3",
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
  },
  label: {
    marginBottom: 6,
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    backgroundColor: "#E0BBE4",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#6CD081",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  saveText: {
    fontWeight: "bold",
    color: "#000",
  },
});
