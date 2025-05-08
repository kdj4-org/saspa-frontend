// components/admin/sedes/AdminSedeItem.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../../config/Colors";

const AdminSedeItem = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      {item.url_imagen ? (
        <Image source={{ uri: item.url_imagen }} style={styles.image} />
      ) : null}
      <View style={styles.info}>
        <Text style={styles.text}>Dirección: {item.direccion}</Text>
        <Text style={styles.text}>Barrio: {item.barrio || "-"}</Text>
        <Text style={styles.text}>Ciudad: {item.ciudad}</Text>
        <Text style={styles.text}>Horario: {item.horario || "-"}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.edit]}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.del]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.btnText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 6,
    marginBottom: 8,
  },
  info: {
    marginBottom: 8,
  },
  text: {
    marginBottom: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  btn: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 8,
  },
  edit: {
    backgroundColor: COLORS.purple.middle.hex,
  },
  del: {
    backgroundColor: COLORS.purple.text.hex,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default AdminSedeItem;
