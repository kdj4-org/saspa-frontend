// src/components/Card.jsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Edit, Trash2 } from "../components/Icons";

// src/components/Card.jsx
export default function Card({ id, isAdmin, onEdit, onDelete, children }) {
  return (
    <View style={styles.card}>
      {children}

      {isAdmin && (
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <TouchableOpacity onPress={onEdit}>
            <Edit />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Trash2 />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#9F71B3",
    borderRadius: 24,
    padding: 24,
    marginVertical: 12,
    marginHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: "#DE5353",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: "#000",
  },
  editButton: {
    backgroundColor: "#5394DE",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 12,
    borderWidth: 2,
    borderColor: "#000",
  },
});
