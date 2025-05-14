import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../../../config/Colors";

const AdminServiceItem = ({ item, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  return (
    <View style={styles.listItem}>
      <View style={styles.infoRow}>
        <Text style={styles.infoText}>ID: {item.id}</Text>
        <Text style={styles.infoText}>Nombre: {item.nombre}</Text>
        <Text style={styles.infoText}>Descripción: {item.descripcion}</Text>
        <Text style={styles.infoText}>
          Duración: {item.duracion_minutos} min
        </Text>
        <Text style={styles.infoText}>Precio: {item.precio}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.editButton,
            { backgroundColor: COLORS.purple.middle.hex },
          ]}
          onPress={handleEdit}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            { backgroundColor: COLORS.purple.text.hex },
          ]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoText: {
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
