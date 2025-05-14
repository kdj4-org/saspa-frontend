// components/ui/LoadingOverlay.js
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { COLORS } from "../../config/Colors";

const LoadingOverlay = ({ isVisible, text = "Guardando cambios..." }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={COLORS.purple.text.hex} />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
  },
});

export default LoadingOverlay;
