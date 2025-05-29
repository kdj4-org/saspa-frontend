import { useState, useEffect, useCallback } from "react";
import * as dateService from "../services/dates";
import { print_error } from "../utils/development";

export const useCitas = (initialEstado) => {
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [errorCitas, setErrorCitas] = useState(null);
  const [estado, setEstado] = useState(initialEstado);

  const loadCitas = useCallback(async (currentEstado) => {
    setLoadingCitas(true);
    setErrorCitas(null);
    try {
      const response = await dateService.fetchDates(currentEstado);
      setCitas(response.data);
    } catch (error) {
      print_error("Error fetching dates:", error);
      setErrorCitas(error.message || "Failed to load dates.");
      setCitas([]);
    } finally {
      setLoadingCitas(false);
    }
  }, []);

  const approveAppointment = useCallback(
    async (citaId) => {
      try {
        const response = await dateService.updateAppointmentStatus(
          citaId,
          "aprobar",
        );
        await loadCitas(estado);
        return response.data;
      } catch (error) {
        print_error("Error approving date:", error);
        setErrorCitas(error.message || "Failed to approve date.");
        throw error;
      }
    },
    [loadCitas, estado],
  );

  const rejectAppointment = useCallback(
    async (citaId) => {
      try {
        const response = await dateService.updateAppointmentStatus(
          citaId,
          "rechazar",
        );
        await loadCitas(estado);
        return response.data;
      } catch (error) {
        print_error("Error rejecting date:", error);
        setErrorCitas(error.message || "Failed to reject date.");
        throw error;
      }
    },
    [loadCitas, estado],
  );

  const cancelAppointment = useCallback(
    async (citaId) => {
      try {
        const response = await dateService.updateAppointmentStatus(
          citaId,
          "cancelar",
        );
        await loadCitas(estado);
        return response.data;
      } catch (error) {
        print_error("Error cancelling date:", error);
        setErrorCitas(error.message || "Failed to cancel date.");
        throw error;
      }
    },
    [loadCitas, estado],
  );

  const finishAppointment = useCallback(
    async (citaId) => {
      try {
        const response = await dateService.updateAppointment(citaId, {
          estado: "terminada",
        });
        await loadCitas(estado);
        return response.data;
      } catch (error) {
        print_error("Error finishing date:", error);
        setErrorCitas(error.message || "Failed to finish date.");
        throw error;
      }
    },
    [loadCitas, estado],
  );

  const updateEstado = useCallback(
    (newEstado) => {
      setEstado(newEstado);
      loadCitas(newEstado);
    },
    [loadCitas],
  );

  useEffect(() => {
    loadCitas(estado);
  }, [loadCitas, estado]);

  return {
    citas,
    loadingCitas,
    errorCitas,
    approveAppointment,
    rejectAppointment,
    cancelAppointment,
    finishAppointment,
    updateEstado,
  };
};
