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
import { COLORS } from "../../../config/Colors";
import { useServicios } from "../../../hooks/useServicios";
import { useEmpleados } from "../../../hooks/useEmpleados";
// Importamos la función directa de servicios vinculados
import * as teamService from "../../../services/teamServices";

import AdminServiceItem from "./AdminServiceItem";
import AdminServiceModal from "./AdminServiceModal";
import ConfirmationModal from "../../ui/ConfirmationModal";

const AdminServicesPage = () => {
  // 1) Hookes de “servicios” y “empleados”:
  const {
    servicios: fetchedServices,
    loading: loadingServices,
    crearServicio,
    editarServicio,
    eliminarServicio,
  } = useServicios();
  const { empleados, loading: loadingEmpleados } = useEmpleados({
    admin: true,
  });

  // 2) Estados “normales” para lista y filtro:
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchText, setSearchText] = useState("");

  // 3) Estados para modales:
  const [isServiceModalVisible, setServiceModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [modalForm, setModalForm] = useState({
    nombre: "",
    descripcion: "",
    duracion_minutos: "",
    precio: "",
  });

  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  // —————————————————————————————————————————————
  // 4) Cuando fetchedServices cambia, actualizamos “services”
  useEffect(() => {
    if (!loadingServices) {
      setServices(fetchedServices);
    }
  }, [fetchedServices, loadingServices]);

  // 5) Filtrar por nombre
  useEffect(() => {
    const lower = searchText.toLowerCase();
    setFilteredServices(
      services.filter((svc) => svc.nombre.toLowerCase().includes(lower)),
    );
  }, [searchText, services]);

  // 6) Precargar el form si se selecciona un servicio
  useEffect(() => {
    if (selectedService) {
      setModalForm({
        nombre: selectedService.nombre || "",
        descripcion: selectedService.descripcion || "",
        duracion_minutos: selectedService.duracion_minutos?.toString() || "",
        precio: selectedService.precio?.toString() || "",
      });
    } else {
      setModalForm({
        nombre: "",
        descripcion: "",
        duracion_minutos: "",
        precio: "",
      });
    }
  }, [selectedService]);

  // —————————————————————————————————————————————
  // 7) Estado que contendrá, para cada empleadoId, su lista de servicios vinculados
  //    Será un objeto { [empleadoId]: [ {id, nombre, ...}, … ], … }
  const [empleadosServiciosMap, setEmpleadosServiciosMap] = useState({});

  // 8) useEffect que, al cargar la lista de empleados, recorre todos y
  //    hace la petición “fetchServiciosVinculados” para cada uno.
  useEffect(() => {
    // Si aún no hay empleados, no hacemos nada
    if (!empleados || empleados.length === 0) {
      setEmpleadosServiciosMap({});
      return;
    }

    let isCancelled = false;
    const nuevoMap = {};

    // Definimos una función async que recorra todos los empleados
    const cargarTodos = async () => {
      for (const emp of empleados) {
        try {
          // Petición a la API: GET /usuario/empleados/${emp.id}/servicios/
          const res = await teamService.fetchServiciosVinculados(emp.id);
          if (!isCancelled) {
            // Guardamos array de servicios en el map bajo la key “emp.id”
            nuevoMap[emp.id] = Array.isArray(res.data) ? res.data : [];
            // Actualizamos de forma incremental para no esperar a todos
            setEmpleadosServiciosMap({ ...nuevoMap });
          }
        } catch (err) {
          console.error(
            `Error trayendo servicios vinculados de empleado ${emp.id}`,
            err,
          );
          if (!isCancelled) {
            nuevoMap[emp.id] = [];
            setEmpleadosServiciosMap({ ...nuevoMap });
          }
        }
      }
    };

    cargarTodos();

    return () => {
      // Si el componente se desmonta, cortamos la actualización
      isCancelled = true;
    };
  }, [empleados]);

  // —————————————————————————————————————————————
  // 9) Funciones para abrir / cerrar modales
  const openServiceModal = (item = null) => {
    setSelectedService(item);
    setServiceModalVisible(true);
  };
  const closeServiceModal = () => {
    setServiceModalVisible(false);
    setSelectedService(null);
  };

  // 10) Crear / Editar servicio (idéntico a antes)
  const handleCreateService = async () => {
    try {
      const payload = {
        nombre: modalForm.nombre,
        descripcion: modalForm.descripcion,
        duracion_minutos: parseInt(modalForm.duracion_minutos, 10),
        precio: parseFloat(modalForm.precio),
      };
      await crearServicio(payload);
      Alert.alert("Éxito", "Servicio creado correctamente.");
      closeServiceModal();
    } catch {
      Alert.alert("Error", "Ocurrió un error al crear el servicio.");
    }
  };

  const handleUpdateService = async () => {
    if (!selectedService?.id) {
      Alert.alert("Error", "No se seleccionó ningún servicio para actualizar.");
      return;
    }
    try {
      const payload = {
        nombre: modalForm.nombre,
        descripcion: modalForm.descripcion,
        duracion_minutos: parseInt(modalForm.duracion_minutos, 10),
        precio: parseFloat(modalForm.precio),
      };
      await editarServicio(selectedService.id, payload);
      Alert.alert("Éxito", "Servicio actualizado correctamente.");
      closeServiceModal();
    } catch {
      Alert.alert("Error", "Ocurrió un error al actualizar el servicio.");
    }
  };

  // —————————————————————————————————————————————
  // 11) Antes de eliminar: comprobamos el “empleadosServiciosMap”
  //     Si algún empleado (clave `empId`) tiene, en employeesServiciosMap[empId],
  //     el servicio con `id === serviceIdAEliminar`, bloqueamos la eliminación.
  const confirmDeleteService = (serviceId) => {
    for (const emp of empleados) {
      const listaDeEseEmp = empleadosServiciosMap[emp.id] || [];
      const esta = listaDeEseEmp.some((srv) => srv.id === serviceId);
      if (esta) {
        Alert.alert(
          "No permitido",
          "No se puede eliminar este servicio porque hay empleados vinculados.",
        );
        return;
      }
    }
    // Si llegamos aquí, ningún empleado usa ese servicio → abrimos modal de confirmación
    setItemToDeleteId(serviceId);
    setConfirmationModalVisible(true);
  };

  const handleDeleteService = async () => {
    setConfirmationModalVisible(false);
    const idToDelete = itemToDeleteId;
    setItemToDeleteId(null);
    try {
      await eliminarServicio(idToDelete);
      Alert.alert("Éxito", "Servicio eliminado correctamente.");
    } catch {
      Alert.alert("Error", "Ocurrió un error al eliminar el servicio.");
    }
  };

  const cancelDeleteService = () => {
    setConfirmationModalVisible(false);
    setItemToDeleteId(null);
  };

  // 12) Handler para inputs del modal
  const handleServiceInputChange = (name, value) => {
    setModalForm({ ...modalForm, [name]: value });
  };

  // —————————————————————————————————————————————
  // 13) Loader global: si aún no terminaron de cargar empleados o servicios
  if (loadingServices || loadingEmpleados) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando datos…</Text>
      </View>
    );
  }

  // 14) Render final
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
        onPress={() => openServiceModal(null)}
      >
        <Text style={styles.buttonText}>Agregar Nuevo Servicio</Text>
      </TouchableOpacity>

      {filteredServices.length === 0 ? (
        <Text style={styles.noResultsText}>No hay servicios disponibles.</Text>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AdminServiceItem
              item={item}
              onEdit={() => openServiceModal(item)}
              onDelete={() => confirmDeleteService(item.id)}
            />
          )}
        />
      )}

      <AdminServiceModal
        isVisible={isServiceModalVisible}
        onClose={closeServiceModal}
        onSubmit={selectedService ? handleUpdateService : handleCreateService}
        newItem={modalForm}
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
    padding: 12,
    backgroundColor: COLORS.purple.background.hex,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.purple.background.hex,
  },
  loadingText: {
    color: COLORS.purple.text.hex,
    fontSize: 16,
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
    backgroundColor: "#fff",
  },
  addButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.purple.text.hex,
    fontSize: 16,
  },
});

export default AdminServicesPage;
