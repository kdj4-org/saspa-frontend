import React, { useState, useCallback, useEffect } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Screen } from "../../../components/Screen";
import { useServicios } from "../../../hooks/useServicios";
import { useGaleria } from "../../../hooks/useGaleria";

const { width: screenWidth } = Dimensions.get("window");
const CAROUSEL_ITEM_WIDTH = screenWidth * 0.7;
const CAROUSEL_WIDTH = screenWidth * 0.95;
const CAROUSEL_HEIGHT = 200;
const OVERLAY_OPACITY = 0.95;
const CLOSE_BUTTON_SIZE = 30;
const PURPLE = "#5D3A9B";

export default function Gallery() {
  const { servicios, loading: loadingServicios } = useServicios(false);
  const { publicaciones, loading: loadingGaleria } = useGaleria();
  const [selectedImage, setSelectedImage] = useState(null);
  const [sortedPublicaciones, setSortedPublicaciones] = useState([]);
  const [sortedServicios, setSortedServicios] = useState([]);

  useEffect(() => {
    if (publicaciones?.length) {
      setSortedPublicaciones(
        [...publicaciones].sort(
          (a, b) =>
            new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)
        )
      );
    } else {
      setSortedPublicaciones([]);
    }
  }, [publicaciones]);

  useEffect(() => {
    if (servicios?.length) {
      setSortedServicios(
        [...servicios].sort((a, b) => a.nombre.localeCompare(b.nombre))
      );
    } else {
      setSortedServicios([]);
    }
  }, [servicios]);

  const handleImagePress = useCallback(
    (imageUrl) => setSelectedImage(imageUrl),
    []
  );
  const handleClosePreview = useCallback(() => setSelectedImage(null), []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nuestros Servicios</Text>
        <Text style={styles.subtitle}>Ofrecemos servicios de: </Text>
        {loadingServicios ? (
          <Text style={styles.loading}>Cargando servicios…</Text>
        ) : sortedServicios.length ? (
          sortedServicios.map((servicio) => (
            <Text key={servicio.id} style={styles.listItem}>
              • {servicio.nombre}
            </Text>
          ))
        ) : (
          <Text style={styles.empty}>No hay servicios.</Text>
        )}

        <Text style={styles.sectionTitle}>Nuestra Galería</Text>
        <View style={[styles.galleryWrapper, { height: CAROUSEL_HEIGHT }]}>
          {loadingGaleria ? (
            <Text style={styles.loading}>Cargando galería…</Text>
          ) : sortedPublicaciones.length ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={CAROUSEL_ITEM_WIDTH + 16}
              snapToAlignment="start"
              decelerationRate="fast"
            >
              {sortedPublicaciones.map((publicacion) => (
                <TouchableOpacity
                  key={publicacion.id}
                  style={[styles.carouselItem, { width: CAROUSEL_ITEM_WIDTH }]}
                  onPress={() => handleImagePress(publicacion.url_imagen)}
                >
                  <Image
                    source={{ uri: publicacion.url_imagen }}
                    style={styles.carouselImage}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.empty}>No hay imágenes.</Text>
          )}
        </View>

        {selectedImage && (
          <View style={styles.fullscreenOverlay}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClosePreview}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: PURPLE,
  },
  subtitle: { fontSize: 18, marginBottom: 8, color: PURPLE },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    color: PURPLE,
    textAlign: "center",
  },
  loading: { textAlign: "center", marginTop: 20 },
  empty: { textAlign: "center", marginTop: 20, color: "#888" },
  listItem: { fontSize: 16, marginBottom: 4, color: PURPLE },
  galleryWrapper: {
    width: CAROUSEL_WIDTH,
    borderRadius: 10,
    backgroundColor: PURPLE,
    overflow: "hidden",
    marginTop: 16,
    alignSelf: "center",
    height: CAROUSEL_HEIGHT,
    padding: 8,
    justifyContent: "center",
  },
  carouselItem: {
    height: "100%",
    marginRight: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  fullscreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(93, 58, 155, ${OVERLAY_OPACITY})`,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  fullscreenImage: { width: "90%", height: "90%", resizeMode: "contain" },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    width: CLOSE_BUTTON_SIZE,
    height: CLOSE_BUTTON_SIZE,
    borderRadius: CLOSE_BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 11,
  },
  closeButtonText: { color: "white", fontSize: 20, fontWeight: "bold" },
});
