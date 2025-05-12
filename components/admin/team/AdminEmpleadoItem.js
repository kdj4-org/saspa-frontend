import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS } from "../../../config/Colors";

const AdminEmpleadoItem = ({ item, onEdit, onDelete, onServicios }) => {
  return (
    <View style={styles.card}>
      {item.url_foto ? (
        <Image source={{ uri: item.url_foto }} style={styles.image} />
      ) : null}
      <View style={styles.info}>
        <Text style={styles.text}>Nombre: {item.nombre}</Text>
        <Text style={styles.text}>Sede: {item.sede?.barrio || "-"}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, styles.servicios]}
          onPress={() => onServicios(item)}
        >
          <Text style={styles.btnText}>Servicios</Text>
        </TouchableOpacity>
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
  servicios: {
    backgroundColor: COLORS.purple.middle.hex,
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

export default AdminEmpleadoItem;
