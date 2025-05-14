import React, { useState } from "react";
import { Screen } from "../../../components/Screen";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AdminGalleryPage from "../../../components/admin/gallery/AdminGalleryPage";
import AdminServicesPage from "../../../components/admin/gallery/AdminServicesPage";
import { COLORS } from "../../../config/Colors";

const AdminGalleryScreen = () => {
  const [showGallery, setShowGallery] = useState(true);

  const toggleView = () => {
    setShowGallery(!showGallery);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            Administrar {showGallery ? "Publicaciones" : "Servicios"}
          </Text>
          <TouchableOpacity onPress={toggleView} style={styles.switchButton}>
            <Text style={styles.switchButtonText}>
              Administrar {showGallery ? "Servicios" : "Publicaciones"}
            </Text>
          </TouchableOpacity>
        </View>

        {showGallery ? <AdminGalleryPage /> : <AdminServicesPage />}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.purple.background.hex,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
  },
  switchButton: {
    backgroundColor: COLORS.purple.middle.hex,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  switchButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AdminGalleryScreen;
