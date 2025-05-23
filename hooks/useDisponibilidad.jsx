// src/hooks/useDisponibilidad.jsx
import { useState, useEffect, useCallback } from "react";
import * as disponibilidadService from "../services/disponibility";

/**
 * Custom hook to manage empleados' disponibilidad and bloqueos.
 */
export function useDisponibilidad() {
  const [horarios, setHorarios] = useState([]);
  const [bloqueos, setBloqueos] = useState([]);
  const [loadingBloqueos, setLoadingBloqueos] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== DISPONIBILIDAD EMPLEADOS =====

  const loadHorarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await disponibilidadService.fetchDisponibilidadEmpleados();
      setHorarios(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando disponibilidad de empleados", err);
      setError(err);
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearDisponibilidad = async (empleadoId, payload) => {
    try {
      await disponibilidadService.createDisponibilidadEmpleado(
        empleadoId,
        payload,
      );
      await loadHorarios();
    } catch (err) {
      console.error("Error al crear disponibilidad:", err);
      throw err;
    }
  };

  const actualizarDisponibilidad = async (empleadoId, payload) => {
    try {
      await disponibilidadService.updateDisponibilidadEmpleado(
        empleadoId,
        payload,
      );
      await loadHorarios();
    } catch (err) {
      console.error("Error al actualizar disponibilidad:", err);
      throw err;
    }
  };

  // ===== BLOQUEOS EMPLEADOS =====

  const loadBloqueos = useCallback(async () => {
    setLoadingBloqueos(true);
    setError(null);
    try {
      const res = await disponibilidadService.fetchBloqueos();
      setBloqueos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando bloqueos de empleados", err);
      setError(err);
      setBloqueos([]);
    } finally {
      setLoadingBloqueos(false);
    }
  }, []);

  const crearBloqueo = async (payload) => {
    try {
      await disponibilidadService.createBloqueo(payload);
      await loadBloqueos();
    } catch (err) {
      console.error("Error al crear bloqueo:", err);
      throw err;
    }
  };

  const deleteBloqueo = async (bloqueoId) => {
    try {
      await disponibilidadService.deleteBloqueo(bloqueoId);
      await loadBloqueos();
    } catch (err) {
      console.error("Error al eliminar bloqueo:", err);
      throw err;
    }
  };

  useEffect(() => {
    loadHorarios();
  }, [loadHorarios]);

  return {
    horarios,
    bloqueos,
    loading,
    loadingBloqueos,
    error,
    crearDisponibilidad,
    actualizarDisponibilidad,
    crearBloqueo,
    deleteBloqueo,
  };
}
