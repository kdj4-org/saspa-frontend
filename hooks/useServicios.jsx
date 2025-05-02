// [src/hooks/useServicios.js]
import { useState, useEffect, useCallback } from "react";
import * as servicio from "../services/services";

export function useServicios(isAdmin) {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = isAdmin
        ? await servicio.fetchServicios()
        : await servicio.fetchServicios();
      setServicios(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("error cargando servicios", err);
      setServicios([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const crearServicio = async (data) => {
    await servicio.createServicio(data);
    await load();
  };

  const editarServicio = async (id, data) => {
    await servicio.updateServicio(id, data);
    await load();
  };

  const eliminarServicio = async (id) => {
    await servicio.deleteServicio(id);
    await load();
  };

  useEffect(() => {
    load();
  }, [isAdmin, load]);

  return {
    servicios,
    loading,
    crearServicio,
    editarServicio,
    eliminarServicio,
  };
}
