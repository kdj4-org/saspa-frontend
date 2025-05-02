// src/hooks/useGaleria.jsx
import { useState, useEffect, useCallback } from "react";
import * as galeria from "../services/gallery";

export function useGaleria() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPublicaciones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await galeria.fetchPublicaciones();
      setPublicaciones(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("error cargando publicaciones de la galería", err);
      setPublicaciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const agregarPublicacion = async (data) => {
    try {
      await galeria.createPublicacion(data);
      await loadPublicaciones();
    } catch (error) {
      console.error("Error al agregar publicación:", error);
    }
  };

  const eliminarPublicacion = async (id) => {
    try {
      await galeria.deletePublicacion(id);
      await loadPublicaciones();
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
    }
  };

  useEffect(() => {
    loadPublicaciones();
  }, [loadPublicaciones]);

  return { publicaciones, loading, agregarPublicacion, eliminarPublicacion };
}
