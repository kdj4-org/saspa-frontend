// components/admin/gallery/AdminServicesPage.js
import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert, // Ya no se usa directamente para la confirmación
  TextInput,
} from "react-native";
import {
  fetchServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../../../services/services";
import { useStorage } from "../../../hooks/useStorage";
import AdminServiceItem from "./AdminServiceItem";
import AdminServiceModal from "./AdminServiceModal";
import { COLORS } from "../../../config/Colors";
import Constants from "expo-constants";
import ConfirmationModal from "../../ui/ConfirmationModal";

const USE_MOCKS = Constants.expoConfig.extra.USE_MOCKS === "true";

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isServiceModalVisible, setServiceModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [newService, setNewService] = useState({
    nombre: "",
    descripcion: "",
    duracion_minutos: "",
    precio: "",
  });
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const { getItem: getToken } = useStorage("adminToken");

  const loadServices = useCallback(async () => {
    const token = await getToken();
    if (!token && !USE_MOCKS) {
      Alert.alert("Error", "No se encontró el token de administrador.");
      return;
    }
    try {
      const response = await fetchServicios({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data) {
        setServices(response.data);
      } else {
        console.error("Error fetching services:", response);
        Alert.alert("Error", "No se pudieron cargar los servicios.");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      Alert.alert("Error", "Ocurrió un error al cargar los servicios.");
    }
  }, [getToken]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    const lowerSearchText = searchText.toLowerCase();
    const filtered = services.filter((service) =>
      service.nombre.toLowerCase().includes(lowerSearchText)
    );
    setFilteredServices(filtered);
  }, [searchText, services]);

  const openServiceModal = (item = null) => {
    setSelectedService(item);
    setNewService({
      nombre: item?.nombre || "",
      descripcion: item?.descripcion || "",
      duracion_minutos: item?.duracion_minutos?.toString() || "",
      precio: item?.precio?.toString() || "",
    });
    setServiceModalVisible(true);
  };

  const closeServiceModal = () => {
    setServiceModalVisible(false);
    setSelectedService(null);
    setNewService({
      nombre: "",
      descripcion: "",
      duracion_minutos: "",
      precio: "",
    });
  };

  const handleCreateService = async () => {
    const token = await getToken();
    if (!token && !USE_MOCKS) {
      Alert.alert("Error", "No se encontró el token de administrador.");
      return;
    }
    try {
      const payload = {
        nombre: newService.nombre,
        descripcion: newService.descripcion,
        duracion_minutos: parseInt(newService.duracion_minutos, 10),
        precio: parseFloat(newService.precio),
      };
      const response = await createServicio(payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.mensaje) {
        Alert.alert("Éxito", response.mensaje);
        loadServices();
        closeServiceModal();
      } else {
        Alert.alert("Error", "No se pudo crear el servicio.");
      }
    } catch (error) {
      console.error("Error creating service:", error);
      Alert.alert("Error", "Ocurrió un error al crear el servicio.");
    }
  };

  const handleUpdateService = async () => {
    const token = await getToken();
    if (!token && !USE_MOCKS) {
      Alert.alert("Error", "No se encontró el token de administrador.");
      return;
    }
    if (!selectedService?.id) {
      Alert.alert("Error", "No se seleccionó ningún servicio para actualizar.");
      return;
    }
    try {
      const payload = {
        nombre: newService.nombre,
        descripcion: newService.descripcion,
        duracion_minutos: parseInt(newService.duracion_minutos, 10),
        precio: parseFloat(newService.precio),
      };
      const response = await updateServicio(selectedService.id, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.mensaje) {
        Alert.alert("Éxito", response.mensaje);
        loadServices();
        closeServiceModal();
      } else {
        Alert.alert("Error", "No se pudo actualizar el servicio.");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      Alert.alert("Error", "Ocurrió un error al actualizar el servicio.");
    }
  };

  const confirmDeleteService = (id) => {
    setItemToDeleteId(id);
    setConfirmationModalVisible(true);
  };

  const handleDeleteService = async () => {
    setConfirmationModalVisible(false);
    const idToDelete = itemToDeleteId;
    setItemToDeleteId(null);
    const token = await getToken();
    if (!token && !USE_MOCKS) {
      Alert.alert("Error", "No se encontró el token de administrador.");
      return;
    }
    try {
      const response = await deleteServicio(idToDelete, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.mensaje) {
        Alert.alert("Éxito", response.mensaje);
        loadServices();
      } else {
        Alert.alert("Error", "No se pudo eliminar el servicio.");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      Alert.alert("Error", "Ocurrió un error al eliminar el servicio.");
    }
  };

  const cancelDeleteService = () => {
    setConfirmationModalVisible(false);
    setItemToDeleteId(null);
  };

  const handleServiceInputChange = (name, value) => {
    setNewService({ ...newService, [name]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar servicio por nombre"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: COLORS.purple.middle.hex },
        ]}
        onPress={openServiceModal}
      >
        <Text style={styles.buttonText}>Agregar Nuevo Servicio</Text>
      </TouchableOpacity>
      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AdminServiceItem
            item={item}
            onEdit={openServiceModal}
            onDelete={confirmDeleteService} // Usa la nueva función para confirmar
          />
        )}
      />
      <AdminServiceModal
        isVisible={isServiceModalVisible}
        onClose={closeServiceModal}
        onSubmit={selectedService ? handleUpdateService : handleCreateService}
        newItem={newService}
        onInputChange={handleServiceInputChange}
      />
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        onClose={cancelDeleteService}
        onConfirm={handleDeleteService}
        message="¿Estás seguro de que deseas eliminar este servicio?"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 16,
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "white",
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

export default AdminServicesPage;
