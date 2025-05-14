import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEmpleados } from "../../../hooks/useEmpleados";
import { useSedes } from "../../../hooks/useSedes";
import AdminEmpleadoItem from "./AdminEmpleadoItem";
import AdminEmpleadoModal from "./AdminEmpleadoModal";
import AdminEmpleadoServiciosModal from "./AdminEmpleadoServiciosModal";
import ConfirmationModal from "../../ui/ConfirmationModal";
import OperationStatusModal from "../../ui/OperationStatusModal";
import SearchBar from "../../ui/SearchBar";
import ActionButton from "../../ui/ActionButton";
import { print_log } from "../../../utils/development";

const AdminEmpleadosPage = () => {
  const {
    empleados,
    loading,
    crearEmpleado,
    editarEmpleado,
    eliminarEmpleado,
  } = useEmpleados({ admin: true });
  const { sedes, loading: loadingSedes } = useSedes();

  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    sede: null,
    url_foto: null,
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [serviciosModalVisible, setServiciosModalVisible] = useState(false);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null);
  const [selectedEmpleadoNombre, setSelectedEmpleadoNombre] = useState("");
  const [operationStatusModalVisible, setOperationStatusModalVisible] =
    useState(false);
  const [operationStatus, setOperationStatus] = useState(null);

  const filterEmpleados = (empleados, sedes, search) => {
    return empleados.filter((e) =>
      e.nombre.toLowerCase().includes(search.toLowerCase()),
    );
  };

  useEffect(() => {
    setFiltered(filterEmpleados(empleados, sedes, search));
  }, [search, empleados, sedes]);

  useEffect(() => {
    print_log("Los empleados son: ", empleados);
  }, [filterEmpleados]);

  useEffect(() => {
    if (selected) {
      setForm({
        nombre: selected.nombre,
        sede: selected.sede?.id ?? selected.sede_id ?? null,
        url_foto: selected.url_foto,
      });
    } else {
      setForm({
        nombre: "",
        sede: null,
        url_foto: null,
      });
    }
  }, [selected]);

  const openModal = (e) => {
    setSelected(e || null);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const handleSave = async () => {
    try {
      const payload = {
        nombre: form.nombre,
        sede_id: form.sede,
        url_foto: form.url_foto,
      };
      if (selected?.id) {
        await editarEmpleado(selected.id, payload);
        print_log("Éxito", "Empleado actualizado.");
      } else {
        await crearEmpleado(payload);
        print_log("Éxito", "Empleado creado.");
      }
      closeModal();
    } catch (err) {
      print_log("Error", "Ocurrió un problema.");
    }
  };

  const confirmDelete = (id) => {
    setToDelete(id);
    setConfirmVisible(true);
  };
  const doDelete = async () => {
    setConfirmVisible(false);
    try {
      await eliminarEmpleado(toDelete);
      print_log("Éxito", "Empleado eliminado.");
    } catch {
      print_log("Error", "No se pudo eliminar.");
    }
  };

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const openServiciosModal = (empleado) => {
    setSelectedEmpleadoId(empleado.id);
    setSelectedEmpleadoNombre(empleado.nombre);
    setServiciosModalVisible(true);
  };

  const closeServiciosModal = (result) => {
    setServiciosModalVisible(false);
    setSelectedEmpleadoId(null);
    setSelectedEmpleadoNombre("");
    if (result === "success") {
      setOperationStatus("success");
      setOperationStatusModalVisible(true);
    } else if (result === "failure") {
      setOperationStatus("failure");
      setOperationStatusModalVisible(true);
    }
  };

  const closeOperationStatusModal = () => {
    setOperationStatusModalVisible(false);
    setOperationStatus(null);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar por nombre"
        value={search}
        onChangeText={setSearch}
      />
      <ActionButton
        title="Agregar Nuevo Empleado"
        onPress={() => openModal(null)}
      />

      {loading && loadingSedes ? (
        <Text style={styles.loading}>Cargando empleados…</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <AdminEmpleadoItem
              item={{ ...item }}
              sedes={sedes}
              onEdit={() => openModal(item)}
              onDelete={confirmDelete}
              onServicios={openServiciosModal}
            />
          )}
        />
      )}

      <AdminEmpleadoModal
        isVisible={modalVisible}
        onClose={closeModal}
        selectedItem={selected}
        formData={form}
        onInputChange={onChange}
        onSubmit={handleSave}
      />

      <ConfirmationModal
        isVisible={confirmVisible}
        onClose={() => setConfirmVisible(false)}
        onConfirm={doDelete}
        message="¿Eliminar este empleado?"
      />

      <AdminEmpleadoServiciosModal
        isVisible={serviciosModalVisible}
        onClose={closeServiciosModal}
        empleadoId={selectedEmpleadoId}
        empleadoNombre={selectedEmpleadoNombre}
      />

      <OperationStatusModal
        isVisible={operationStatusModalVisible}
        onClose={closeOperationStatusModal}
        status={operationStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  loading: { textAlign: "center", marginTop: 20 },
});

export default AdminEmpleadosPage;
