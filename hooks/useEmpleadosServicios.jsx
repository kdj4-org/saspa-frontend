// src/hooks/useEmpleadosServicios.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import * as teamService from "../services/teamServices";

export function useEmpleadosServicios(empleadoId) {
  const [serviciosVinculados, setServiciosVinculados] = useState([]);
  const [loadingServiciosVinculados, setLoadingServiciosVinculados] =
    useState(true);
  const [errorServiciosVinculados, setErrorServiciosVinculados] =
    useState(null);
  const initialServiciosVinculados = useRef([]);

  const loadServiciosVinculados = useCallback(async () => {
    if (!empleadoId) {
      setServiciosVinculados([]);
      setLoadingServiciosVinculados(false);
      return;
    }

    setLoadingServiciosVinculados(true);
    setErrorServiciosVinculados(null);

    try {
      const res = await teamService.fetchServiciosVinculados(empleadoId);
      const data = Array.isArray(res.data) ? res.data : [];
      setServiciosVinculados(data);
      initialServiciosVinculados.current = data.map((item) => item.servicioId);
    } catch (err) {
      console.error("Error cargando servicios vinculados", err);
      setErrorServiciosVinculados(
        err.message || "Error al cargar los servicios vinculados.",
      );
      setServiciosVinculados([]);
      initialServiciosVinculados.current = [];
    } finally {
      setLoadingServiciosVinculados(false);
    }
  }, [empleadoId]);

  const vincularServicioEmpleado = useCallback(
    async (servicioId) => {
      if (!empleadoId) {
        console.warn("Empleado ID no proporcionado para vincular servicio.");
        return;
      }
      try {
        const res = await teamService.vincularServicio(empleadoId, servicioId);
        await loadServiciosVinculados();
        return res.data;
      } catch (error) {
        console.error("Error al vincular servicio:", error);
        setErrorServiciosVinculados(
          error.message || "Error al vincular el servicio.",
        );
        throw error;
      }
    },
    [empleadoId, loadServiciosVinculados],
  );

  const desvincularServicioEmpleado = useCallback(
    async (servicioId) => {
      if (!empleadoId) {
        console.warn("Empleado ID no proporcionado para desvincular servicio.");
        return;
      }
      try {
        const res = await teamService.desvincularServicio(
          empleadoId,
          servicioId,
        );
        await loadServiciosVinculados();
        return res.data;
      } catch (error) {
        console.error("Error al desvincular servicio:", error);
        setErrorServiciosVinculados(
          error.message || "Error al desvincular el servicio.",
        );
        throw error;
      }
    },
    [empleadoId, loadServiciosVinculados],
  );

  useEffect(() => {
    loadServiciosVinculados();
  }, [loadServiciosVinculados]);

  return {
    serviciosVinculados,
    loadingServiciosVinculados,
    errorServiciosVinculados,
    loadServiciosVinculados,
    vincularServicioEmpleado,
    desvincularServicioEmpleado,
    initialServiciosVinculados,
  };
}
