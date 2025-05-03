// components/admin/gallery/AdminGalleryPage.js
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AdminGalleryItem from "./AdminGalleryItem";
import AdminGalleryModal from "./AdminGalleryModal";
import { COLORS } from "../../../config/Colors";
import ConfirmationModal from "../../ui/ConfirmationModal";
import { useGaleria } from "../../../hooks/useGaleria";

const AdminGalleryPage = () => {
  const [isGalleryModalVisible, setGalleryModalVisible] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
  const [newGalleryItem, setNewGalleryItem] = useState({
    url_imagen: "",
    fecha: "",
    servicioId: "",
  });
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  const {
    publicaciones: galleryItems,
    loading,
    agregarPublicacion: createPublicacion,
    eliminarPublicacion,
  } = useGaleria();

  const openGalleryModal = (item = null) => {
    setSelectedGalleryItem(item);
    setNewGalleryItem({
      url_imagen: item?.url_imagen || "",
      fecha: item?.fecha || "",
      servicioId: item?.servicioId?.toString() || "",
    });
    setGalleryModalVisible(true);
  };

  const closeGalleryModal = () => {
    setGalleryModalVisible(false);
    setSelectedGalleryItem(null);
    setNewGalleryItem({ url_imagen: "", fecha: "", servicioId: "" });
  };

  const handleCreateGalleryItem = async () => {
    console.log("Intentando crear la publicación con:", newGalleryItem);
    try {
      const payload = {
        ...newGalleryItem,
        servicioId: parseInt(newGalleryItem.servicioId, 10),
      };
      await createPublicacion(payload);
      Alert.alert("Éxito", "Publicación creada correctamente.");
      closeGalleryModal();
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al crear la publicación.");
    }
  };

  const confirmDeleteGalleryItem = (id) => {
    setItemToDeleteId(id);
    setConfirmationModalVisible(true);
  };

  const handleDeleteGalleryItem = async () => {
    console.log("Intentando eliminar la publicación con id:", itemToDeleteId);
    setConfirmationModalVisible(false);
    const idToDelete = itemToDeleteId;
    setItemToDeleteId(null);
    try {
      await eliminarPublicacion(idToDelete);
      Alert.alert("Éxito", "Publicación eliminada correctamente.");
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al eliminar la publicación.");
    }
  };

  const cancelDeleteGalleryItem = () => {
    setConfirmationModalVisible(false);
    setItemToDeleteId(null);
  };

  const handleGalleryInputChange = (name, value) => {
    setNewGalleryItem({ ...newGalleryItem, [name]: value });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: COLORS.purple.middle.hex },
        ]}
        onPress={openGalleryModal}
      >
        <Text style={styles.buttonText}>Agregar Nueva Publicación</Text>
      </TouchableOpacity>
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Cargando publicaciones...
        </Text>
      ) : (
        <FlatList
          data={galleryItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AdminGalleryItem
              item={item}
              onEdit={openGalleryModal}
              onDelete={confirmDeleteGalleryItem}
            />
          )}
        />
      )}
      <AdminGalleryModal
        isVisible={isGalleryModalVisible}
        onClose={closeGalleryModal}
        onSubmit={handleCreateGalleryItem}
        newItem={newGalleryItem}
        onInputChange={handleGalleryInputChange}
      />
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        onClose={cancelDeleteGalleryItem}
        onConfirm={handleDeleteGalleryItem}
        message="¿Estás seguro de que deseas eliminar esta publicación?"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    backgroundColor: COLORS.purple.middle.hex,
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default AdminGalleryPage;
