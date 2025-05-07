// components/admin/gallery/AdminGalleryItem.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../../config/Colors";

const AdminGalleryItem = ({ item, onDelete }) => {
  const handleDelete = () => {
    onDelete(item.id);
  };

  return (
    <View style={styles.listItem}>
      <View style={styles.row}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.url_imagen }} style={styles.thumbnail} />
        </View>
        <View style={styles.infoContainer}>
          {/* <Text>ID: {item.id}</Text> */}
          <Text>Fecha: {item.fecha}</Text>
          <Text>Servicio ID: {item.servicioId}</Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  imageContainer: {
    marginRight: 16,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    flexShrink: 1,
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

export default AdminGalleryItem;
