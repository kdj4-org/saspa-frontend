import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../../config/Colors";

const ActionButton = ({
  title,
  onPress,
  backgroundColor = COLORS.purple.middle.hex,
}) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor }]}
    onPress={onPress}
  >
    <Text style={styles.text}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { padding: 10, borderRadius: 5, marginBottom: 12 },
  text: { color: "#fff", textAlign: "center" },
});

export default ActionButton;
