// src/hooks/useSedes.jsx
import { useState, useEffect, useCallback } from "react";
import * as sedeService from "../services/locations";

export function useSedes() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await sedeService.fetchSedes();
      setSedes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando sedes", err);
      setSedes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearSede = useCallback(
    async (data) => {
      try {
        await sedeService.createSede(data);
        await load();
      } catch (error) {
        console.error("Error creando sede:", error);
        throw error;
      }
    },
    [load],
  );

  const editarSede = useCallback(
    async (id, data) => {
      try {
        await sedeService.updateSede(id, data);
        await load();
      } catch (error) {
        console.error("Error editando sede:", error);
        throw error;
      }
    },
    [load],
  );

  const eliminarSede = useCallback(
    async (id) => {
      try {
        await sedeService.deleteSede(id);
        await load();
      } catch (error) {
        console.error("Error eliminando sede:", error);
        throw error;
      }
    },
    [load],
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    sedes,
    loading,
    crearSede,
    editarSede,
    eliminarSede,
  };
}
