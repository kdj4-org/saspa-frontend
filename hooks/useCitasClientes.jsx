// src/hooks/useCitasCliente.js

import { useState, useEffect, useCallback } from "react";
import * as citasService from "../services/dates";

export function useCitasCliente(usuarioId) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== CARGAR CITAS DEL CLIENTE =====
  const loadCitasClientes = useCallback(async () => {
    if (usuarioId == null) return;
    setLoading(true);
    setError(null);

    try {
      const res = await citasService.fetchClientDates(usuarioId);
      setCitas(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando citas del cliente:", err);
      setError(err);
      setCitas([]);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  // ===== CREAR CITA PARA EL CLIENTE =====
  const crearCitaCliente = useCallback(
    async (data) => {
      setError(null);
      try {
        await citasService.createClientAppointment(usuarioId, data);
        await loadCitasClientes();
      } catch (err) {
        console.error("Error creando cita:", err);
        setError(err);
        throw err;
      }
    },
    [usuarioId, loadCitasClientes],
  );

  useEffect(() => {
    loadCitasClientes();
  }, [loadCitasClientes]);

  return {
    citas,
    loading,
    error,
    crearCitaCliente,
  };
}
