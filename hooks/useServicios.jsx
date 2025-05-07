// [src/hooks/useServicios.js]
import { useState, useEffect, useCallback } from "react";
import * as servicio from "../services/services";

export function useServicios() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await servicio.fetchServicios();
      setServicios(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando servicios", err);
      setServicios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearServicio = useCallback(
    async (data) => {
      try {
        await servicio.createServicio(data);
        await load();
      } catch (error) {
        console.error("Error creando servicio:", error);
        throw error;
      }
    },
    [load]
  );

  const editarServicio = useCallback(
    async (id, data) => {
      try {
        await servicio.updateServicio(id, data);
        await load();
      } catch (error) {
        console.error("Error editando servicio:", error);
        throw error;
      }
    },
    [load]
  );

  const eliminarServicio = useCallback(
    async (id) => {
      try {
        await servicio.deleteServicio(id);
        await load();
      } catch (error) {
        console.error("Error eliminando servicio:", error);
        throw error;
      }
    },
    [load]
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    servicios,
    loading,
    crearServicio,
    editarServicio,
    eliminarServicio,
  };
}
