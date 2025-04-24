// src/hooks/useSedes.js
import { useState, useEffect, useCallback } from "react";
import * as location from "../services/locations";

export function useSedes(isAdmin) {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // 👇 Elige el endpoint correcto
      const res = isAdmin
        ? await location.fetchSedesAdmin()
        : await location.fetchSedes();
      setSedes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("error cargando sedes", err);
      setSedes([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const createSede = async (data) => {
    await location.createSede(data);
    await load();
  };

  const editSede = async (id, data) => {
    await location.updateSede(id, data);
    await load();
  };

  const removeSede = async (id) => {
    await location.deleteSede(id);
    await load();
  };

  useEffect(() => {
    load();
  }, [isAdmin, load]);

  return { sedes, loading, createSede, editSede, removeSede };
}
