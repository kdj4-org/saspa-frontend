import { useState, useEffect, useCallback } from "react";
import * as teamService from "../services/teamServices";
import { print_error, print_warn } from "../utils/development";

export function useEmpleadosServicios(empleadoId) {
  const [serviciosVinculados, setServiciosVinculados] = useState([]);
  const [loadingServiciosVinculados, setLoadingServiciosVinculados] =
    useState(true);
  const [errorServiciosVinculados, setErrorServiciosVinculados] =
    useState(null);
  const [initialServiciosIds, setInitialServiciosIds] = useState([]);

  const loadServiciosVinculados = useCallback(async () => {
    if (!empleadoId) {
      setServiciosVinculados([]);
      setLoadingServiciosVinculados(false);
      setInitialServiciosIds([]);
      return;
    }

    setLoadingServiciosVinculados(true);
    setErrorServiciosVinculados(null);

    try {
      const res = await teamService.fetchServiciosVinculados(empleadoId);
      const data = Array.isArray(res.data) ? res.data : [];
      setServiciosVinculados(data);
      setInitialServiciosIds(data.map((item) => item.id));
    } catch (err) {
      print_error("Error cargando servicios vinculados", err);
      setErrorServiciosVinculados(
        err.message || "Error al cargar los servicios vinculados.",
      );
      setServiciosVinculados([]);
      setInitialServiciosIds([]);
    } finally {
      setLoadingServiciosVinculados(false);
    }
  }, [empleadoId]);

  const vincularServicioEmpleado = useCallback(
    async (servicioId) => {
      if (!empleadoId) {
        print_warn("Empleado ID no proporcionado para vincular servicio.");
        return;
      }
      try {
        const payload = { servicio_id: servicioId };
        const res = await teamService.vincularServicio(empleadoId, payload);
        await loadServiciosVinculados();
        return res.data;
      } catch (error) {
        print_error("Error al vincular servicio:", error);
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
        print_warn("Empleado ID no proporcionado para desvincular servicio.");
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
        print_error("Error al desvincular servicio:", error);
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
    initialServiciosIds,
  };
}
