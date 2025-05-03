// components/admin/gallery/AdminServiceItem.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../../config/Colors"; // Importa las constantes de color

const AdminServiceItem = ({ item, onEdit, onDelete }) => (
  <View style={styles.listItem}>
    <View style={styles.infoRow}>
      {/* <Text>ID: {item.id}</Text> */}
      <Text style={styles.infoText}>Nombre: {item.nombre}</Text>
      <Text style={styles.infoText}>Descripción: {item.descripcion}</Text>
      <Text style={styles.infoText}>Duración: {item.duracion_minutos} min</Text>
      <Text style={styles.infoText}>Precio: {item.precio}</Text>
    </View>
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[
          styles.editButton,
          { backgroundColor: COLORS.purple.middle.hex },
        ]}
        onPress={() => onEdit(item)}
      >
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.deleteButton,
          { backgroundColor: COLORS.purple.text.hex },
        ]}
        onPress={() => {
          onDelete(item.id);
        }}
      >
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "column", // Arrange items vertically
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  infoRow: {
    marginBottom: 8, // Space between info and buttons
  },
  infoText: {
    marginBottom: 4, // Space between each info line
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end", // Align buttons to the right
  },
  editButton: {
    padding: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default AdminServiceItem;
