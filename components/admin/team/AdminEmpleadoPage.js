// components/admin/team/AdminEmpleadosPage.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useEmpleados } from "../../../hooks/useEmpleados";
import { useSedes } from "../../../hooks/useSedes";
import AdminEmpleadoItem from "./AdminEmpleadoItem";
import AdminEmpleadoModal from "./AdminEmpleadoModal";
import ConfirmationModal from "../../ui/ConfirmationModal";
import { COLORS } from "../../../config/Colors";

const AdminEmpleadosPage = () => {
  const {
    empleados,
    loading,
    crearEmpleado,
    editarEmpleado,
    eliminarEmpleado,
  } = useEmpleados();
  const { sedes } = useSedes();

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

  useEffect(() => {
    const enriched = empleados.map((e) => ({
      ...e,
      sedeObj: sedes.find((s) => s.id === e.sede || s.id === e.sede_id) || null,
    }));
    setFiltered(
      enriched.filter((e) =>
        e.nombre.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, empleados, sedes]);

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
        Alert.alert("Éxito", "Empleado actualizado.");
      } else {
        await crearEmpleado(payload);
        Alert.alert("Éxito", "Empleado creado.");
      }
      closeModal();
    } catch (err) {
      Alert.alert("Error", "Ocurrió un problema.");
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
      Alert.alert("Éxito", "Empleado eliminado.");
    } catch {
      Alert.alert("Error", "No se pudo eliminar.");
    }
  };

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar por nombre"
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: COLORS.purple.middle.hex }]}
        onPress={() => openModal(null)}
      >
        <Text style={styles.addText}>Agregar Nuevo Empleado</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loading}>Cargando empleados…</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <AdminEmpleadoItem
              item={{ ...item, sede: item.sedeObj }}
              onEdit={() => openModal(item)}
              onDelete={confirmDelete}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  search: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 8,
    marginBottom: 12,
    backgroundColor: "white",
  },
  addBtn: { padding: 10, borderRadius: 5, marginBottom: 12 },
  addText: { color: "#fff", textAlign: "center" },
  loading: { textAlign: "center", marginTop: 20 },
});

export default AdminEmpleadosPage;
