// app/(tabs)/admin/locations.js
import React, { useState } from "react";
import { StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";
import { Screen } from "../../../components/Screen";
import Card from "../../../components/Card";
import { Plus } from "../../../components/Icons";
import { useSedes } from "../../../hooks/useSedes";
import SedeForm from "../../../components/SedeForm";
import Modal from "react-native-modal";

export default function AdminLocations() {
  const { sedes, loading, createSede, editSede, removeSede } = useSedes(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingSede, setEditingSede] = useState(null);

  const openNew = () => {
    setEditingSede(null);
    setModalVisible(true);
  };
  const openEdit = (sede) => {
    setEditingSede(sede);
    setModalVisible(true);
  };
  const close = () => setModalVisible(false);

  // onSubmit recibirá {id?, ciudad, direccion}
  const handleSubmit = async ({ id, ciudad, direccion }) => {
    if (id) {
      await editSede(id, { ciudad, direccion });
    } else {
      await createSede({ ciudad, direccion });
    }
  };

  return (
    <Screen>
      <ScrollView>
        <Text style={styles.title}>Gestión de Sedes</Text>
        <TouchableOpacity onPress={openNew} style={styles.addButton}>
          <Plus />
          <Text style={styles.buttonText}>Agregar Sede</Text>
        </TouchableOpacity>

        {loading ? (
          <Text>Cargando…</Text>
        ) : (
          sedes.map((sede) => (
            <Card
              key={sede.id}
              isAdmin
              onEdit={() => openEdit(sede)}
              onDelete={() => removeSede(sede.id)}
            >
              <Text style={{ fontWeight: "bold" }}>{sede.direccion}</Text>
              <Text>{sede.ciudad}</Text>
            </Card>
          ))
        )}
      </ScrollView>

      <Modal isVisible={modalVisible} onBackdropPress={close}>
        <SedeForm
          initialData={editingSede}
          onClose={close}
          onSubmit={handleSubmit}
        />
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#5D3A9B",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#6CD081",
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 95,
    borderWidth: 2,
    borderColor: "#000",
    flexDirection: "row",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
