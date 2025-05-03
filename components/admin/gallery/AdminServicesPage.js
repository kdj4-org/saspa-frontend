// components/admin/gallery/AdminServicesPage.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useServicios } from "../../../hooks/useServicios";
import AdminServiceItem from "./AdminServiceItem";
import AdminServiceModal from "./AdminServiceModal";
import { COLORS } from "../../../config/Colors";
import ConfirmationModal from "../../ui/ConfirmationModal";

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
  const {
    servicios: fetchedServices,
    loading,
    crearServicio,
    editarServicio,
    eliminarServicio,
  } = useServicios();

  useEffect(() => {
    if (!loading) {
      setServices(fetchedServices);
    }
  }, [fetchedServices, loading]);

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
    try {
      const payload = {
        nombre: newService.nombre,
        descripcion: newService.descripcion,
        duracion_minutos: parseInt(newService.duracion_minutos, 10),
        precio: parseFloat(newService.precio),
      };
      await crearServicio(payload);
      Alert.alert("Éxito", "Servicio creado correctamente.");
      closeServiceModal();
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al crear el servicio.");
    }
  };

  const handleUpdateService = async () => {
    console.log("Intentando actualizar el servicio");
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
      await editarServicio(selectedService.id, payload);
      Alert.alert("Éxito", "Servicio actualizado correctamente.");
      closeServiceModal();
    } catch (error) {
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
    try {
      await eliminarServicio(idToDelete);
      Alert.alert("Éxito", "Servicio eliminado correctamente.");
    } catch (error) {
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
      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Cargando servicios...
        </Text>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AdminServiceItem
              item={item}
              onEdit={() => openServiceModal(item)}
              onDelete={confirmDeleteService}
            />
          )}
        />
      )}
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
