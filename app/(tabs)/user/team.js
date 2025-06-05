import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Screen } from "../../../components/Screen";
import { useEmpleados } from "../../../hooks/useEmpleados";
import { useEmpleadosServicios } from "../../../hooks/useEmpleadosServicios";
import { useServicios } from "../../../hooks/useServicios";
import { COLORS } from "../../../config/Colors";
import EmpleadoServiciosModal from "../../../components/user/team/EmpleadoServiciosModal";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.9;
const CARD_HEIGHT = 240;

export default function EmpleadosScreen() {
  const { empleados, loading: loadingEmpleados } = useEmpleados({
    admin: false,
  });
  const {
    servicios: allServicios,
    loading: loadingAllServicios,
    error: errorAllServicios,
  } = useServicios();

  const [sorted, setSorted] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null);
  const [serviciosVinculadosNombres, setServiciosVinculadosNombres] = useState(
    [],
  );

  const {
    serviciosVinculados: serviciosVinculadosIds,
    loadingServiciosVinculados,
    errorServiciosVinculados,
    loadServiciosVinculados,
  } = useEmpleadosServicios(selectedEmpleadoId);

  useEffect(() => {
    if (empleados) {
      setSorted(
        [...empleados].sort((a, b) => a.nombre.localeCompare(b.nombre)),
      );
    }
  }, [empleados]);

  useEffect(() => {
    if (selectedEmpleadoId) {
      loadServiciosVinculados();
    }
  }, [selectedEmpleadoId, loadServiciosVinculados]);

  useEffect(() => {
    if (serviciosVinculadosIds && allServicios) {
      const nombres = serviciosVinculadosIds
        .map((linkedService) => {
          const servicio = allServicios.find((s) => s.id === linkedService.id);
          return servicio ? { id: servicio.id, nombre: servicio.nombre } : null;
        })
        .filter(Boolean);
      setServiciosVinculadosNombres(nombres);
    } else {
      setServiciosVinculadosNombres([]);
    }
  }, [serviciosVinculadosIds, allServicios]);

  const openImage = useCallback((url) => setSelectedImage(url), []);
  const closeImage = useCallback(() => setSelectedImage(null), []);

  const openServiciosModal = useCallback((empleadoId) => {
    setSelectedEmpleadoId(empleadoId);
    setModalVisible(true);
  }, []);

  const closeServiciosModal = useCallback(() => {
    setModalVisible(false);
    setSelectedEmpleadoId(null);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.url_foto && (
        <TouchableOpacity onPress={() => openImage(item.url_foto)}>
          <Image source={{ uri: item.url_foto }} style={styles.image} />
        </TouchableOpacity>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text>Sede: {item.sede ?? "-"}</Text>
        <TouchableOpacity
          style={styles.serviciosButton}
          onPress={() => openServiciosModal(item.id)}
        >
          <Text style={styles.serviciosButtonText}>Mostrar Servicios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const selectedEmpleado = empleados?.find((e) => e.id === selectedEmpleadoId);
  const selectedSede = selectedEmpleado?.sede ?? "-";

  return (
    <Screen>
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>Nuestro Equipo</Text>
      </View>

      {loadingEmpleados || loadingServiciosVinculados || loadingAllServicios ? (
        <View style={styles.loadingWrapper}>
          <Text style={styles.loading}>Cargando empleados y servicios…</Text>
        </View>
      ) : errorServiciosVinculados || errorAllServicios ? (
        <View style={styles.loadingWrapper}>
          <Text style={styles.error}>
            Hubo un problema al cargar la información. Por favor, intenta más
            tarde.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(i) => i.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.empty}>No hay empleados disponibles.</Text>
          }
        />
      )}

      {selectedImage && (
        <View style={styles.overlay}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.close} onPress={closeImage}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      <EmpleadoServiciosModal
        isVisible={modalVisible}
        empleado={selectedEmpleado}
        onClose={closeServiciosModal}
        servicios={serviciosVinculadosNombres}
        error={errorAllServicios}
        sede={selectedSede}
        loading={loadingServiciosVinculados}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    padding: 16,
    backgroundColor: COLORS.purple.background.hex,
    marginTop: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.purple.text.hex,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loading: { textAlign: "center", marginTop: 20 },
  error: { textAlign: "center", marginTop: 20, color: "red" },
  listContainer: { padding: 16, paddingBottom: 40 },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: "100%",
    height: CARD_HEIGHT * 0.5,
  },
  info: {
    padding: 8,
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(93,58,155,0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  fullImage: {
    width: "90%",
    height: "70%",
  },
  close: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 15,
    padding: 5,
  },
  closeText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  serviciosButton: {
    backgroundColor: COLORS.purple.middle.hex,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 8,
  },
  serviciosButtonText: {
    color: COLORS.purple.text.hex,
    fontWeight: "bold",
  },
});
