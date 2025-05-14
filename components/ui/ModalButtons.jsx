// components/ui/ModalButtons.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../../config/Colors";

const ModalButtons = ({ onCancel, onSave, disabledSave, disabledCancel }) => (
  <View style={styles.buttons}>
    <TouchableOpacity
      style={styles.cancel}
      onPress={onCancel}
      disabled={disabledCancel}
    >
      <Text style={styles.btnText}>Cancelar</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.save}
      onPress={onSave}
      disabled={disabledSave}
    >
      <Text style={styles.btnText}>Guardar</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
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

export default ModalButtons;
