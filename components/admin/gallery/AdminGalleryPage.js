// components/admin/gallery/AdminGalleryPage.js
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert, // Ya no se usa directamente para la confirmación
} from "react-native";
import {
  fetchPublicaciones,
  createPublicacion,
  deletePublicacion,
} from "../../../services/gallery";
import { useStorage } from "../../../hooks/useStorage";
import AdminGalleryItem from "./AdminGalleryItem";
import AdminGalleryModal from "./AdminGalleryModal";
import { COLORS } from "../../../config/Colors";
import Constants from "expo-constants";
import ConfirmationModal from "../../ui/ConfirmationModal";

const USE_MOCKS = Constants.expoConfig.extra.USE_MOCKS === "true";

const AdminGalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
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
  const { getItem: getToken } = useStorage("adminToken");

  const loadGalleryItems = useCallback(async () => {
    const token = await getToken();
    if (!token && !USE_MOCKS) {
      Alert.alert("Error", "No se encontró el token de administrador.");
      return;
    }
    try {
      const response = await fetchPublicaciones({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data) {
        setGalleryItems(response.data);
      } else {
        console.error("Error fetching gallery items:", response);
        Alert.alert("Error", "No se pudieron cargar las publicaciones.");
      }
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      Alert.alert("Error", "Ocurrió un error al cargar las publicaciones.");
    }
  }, [getToken]);

  useEffect(() => {
    loadGalleryItems();
  }, [loadGalleryItems]);

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
    const token = await getToken();
    if (!token && !USE_MOCKS) {
      Alert.alert("Error", "No se encontró el token de administrador.");
      return;
    }
    try {
      const payload = {
        ...newGalleryItem,
        servicioId: parseInt(newGalleryItem.servicioId, 10),
      };
      const response = await createPublicacion(payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.id) {
        Alert.alert("Éxito", "Publicación creada correctamente.");
        loadGalleryItems();
        closeGalleryModal();
      } else {
        Alert.alert("Error", "No se pudo crear la publicación.");
      }
    } catch (error) {
      console.error("Error creating gallery item:", error);
      Alert.alert("Error", "Ocurrió un error al crear la publicación.");
    }
  };

  const confirmDeleteGalleryItem = (id) => {
    setItemToDeleteId(id);
    setConfirmationModalVisible(true);
  };

  const handleDeleteGalleryItem = async () => {
    setConfirmationModalVisible(false);
    const idToDelete = itemToDeleteId;
    setItemToDeleteId(null);
    const token = await getToken();
    if (!token && !USE_MOCKS) {
      Alert.alert("Error", "No se encontró el token de administrador.");
      return;
    }
    try {
      const response = await deletePublicacion(idToDelete, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.mensaje) {
        Alert.alert("Éxito", response.mensaje);
        loadGalleryItems();
      } else {
        Alert.alert("Error", "No se pudo eliminar la publicación.");
      }
    } catch (error) {
      console.error("Error deleting gallery item:", error);
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

  const handleUpdateGalleryItem = () => {
    Alert.alert(
      "Info",
      "La edición de publicaciones no está implementada en esta versión."
    );
    closeGalleryModal();
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
      <FlatList
        data={galleryItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AdminGalleryItem
            item={item}
            onEdit={openGalleryModal}
            onDelete={confirmDeleteGalleryItem} // Usa la nueva función para confirmar
          />
        )}
      />
      <AdminGalleryModal
        isVisible={isGalleryModalVisible}
        onClose={closeGalleryModal}
        onSubmit={
          selectedGalleryItem
            ? handleUpdateGalleryItem
            : handleCreateGalleryItem
        }
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
