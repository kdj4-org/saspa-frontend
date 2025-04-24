import React, { useState } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Screen } from "../../../components/Screen";
import Card from "../../../components/Card";
import { Plus } from "../../../components/Icons";
import { useSedes } from "../../../hooks/useSedes";
import CreateSedeForm from "../../../components/CreateSedeForm";
import Modal from "react-native-modal";

export default function AdminLocations() {
  const { sedes, loading, createSede, editSede, removeSede } = useSedes(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => setModalVisible(!isModalVisible);

  return (
    <Screen>
      <ScrollView className="p-4">
        <Text style={styles.title}>Nuestras Sedes</Text>
        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Plus />
          <Text style={styles.buttonText}>Agregar Sede</Text>
        </TouchableOpacity>

        {loading ? (
          <Text>Cargando…</Text>
        ) : Array.isArray(sedes) ? (
          sedes.map((sede) => (
            <Card
              key={sede.id}
              id={sede.id}
              isAdmin={true}
              onEdit={() => editSede(sede.id)}
              onDelete={() => removeSede(sede.id)}
            >
              <Text style={{ fontWeight: "bold" }}>{sede.direccion}</Text>
              <Text>{sede.ciudad}</Text>
            </Card>
          ))
        ) : (
          <Text>No hay sedes disponibles.</Text>
        )}
      </ScrollView>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <CreateSedeForm onClose={toggleModal} onSubmit={createSede} />
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
