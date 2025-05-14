import React from "react";
import { Text, StyleSheet } from "react-native";
import { COLORS } from "../../config/Colors";

const ModalTitle = ({ title }) => <Text style={styles.title}>{title}</Text>;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.purple.text.hex,
    textAlign: "center",
  },
});

export default ModalTitle;
