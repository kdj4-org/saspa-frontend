// components/admin/sedes/AdminSedesPage.js

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
import { useSedes } from "../../../hooks/useSedes";
import { useEmpleados } from "../../../hooks/useEmpleados";
import AdminSedeItem from "./AdminSedeItem";
import AdminSedeModal from "./AdminSedeModal";
import ConfirmationModal from "../../ui/ConfirmationModal";
import { COLORS } from "../../../config/Colors";

const AdminSedesPage = () => {
  const { sedes, loading, crearSede, editarSede, eliminarSede } = useSedes();
  const { empleados } = useEmpleados({ admin: true });
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    direccion: "",
    barrio: "",
    ciudad: "",
    horario: "",
    url_imagen: null,
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  // Filtra sedes según búsqueda por barrio
  useEffect(() => {
    setFiltered(
      sedes.filter((s) =>
        s.barrio.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, sedes]);

  // Cuando cambia “selected”, precarga el formulario
  useEffect(() => {
    if (selected) {
      setForm({ ...selected });
    } else {
      setForm({
        direccion: "",
        barrio: "",
        ciudad: "",
        horario: "",
        url_imagen: null,
      });
    }
  }, [selected]);

  const openModal = (sede) => {
    setSelected(sede || null);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const handleSave = async () => {
    try {
      const payload = {
        direccion: form.direccion,
        barrio: form.barrio,
        ciudad: form.ciudad,
        horario: form.horario,
        url_imagen: form.url_imagen,
      };
      if (selected?.id) {
        await editarSede(selected.id, payload);
        Alert.alert("Éxito", "Sede actualizada.");
      } else {
        await crearSede(payload);
        Alert.alert("Éxito", "Sede creada.");
      }
      closeModal();
    } catch (err) {
      Alert.alert("Error", "Ocurrió un problema al guardar.");
    }
  };

  // Antes de eliminar, comprueba si hay empleados con esta sede
  const confirmDelete = (id) => {
    // Filtrar empleados cuyo campo `sede_id` coincida con esta sede
    const vinculados = empleados.filter((emp) => emp.sede_id === id);
    if (vinculados.length > 0) {
      Alert.alert(
        "No permitido",
        "No se puede eliminar esta sede porque hay empleados asignados.",
      );
      return;
    }
    setToDelete(id);
    setConfirmVisible(true);
  };

  const doDelete = async () => {
    setConfirmVisible(false);
    try {
      await eliminarSede(toDelete);
      Alert.alert("Éxito", "Sede eliminada.");
    } catch {
      Alert.alert("Error", "No se pudo eliminar la sede.");
    }
  };

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Buscar por barrio"
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: COLORS.purple.middle.hex }]}
        onPress={() => openModal(null)}
      >
        <Text style={styles.addText}>Agregar Nueva Sede</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loading}>Cargando sedes…</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <AdminSedeItem
              item={item}
              onEdit={() => openModal(item)}
              onDelete={() => confirmDelete(item.id)}
            />
          )}
        />
      )}

      <AdminSedeModal
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
        message="¿Eliminar esta sede?"
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

export default AdminSedesPage;
