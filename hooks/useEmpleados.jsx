// src/hooks/useEmpleados.jsx
import { useState, useEffect, useCallback } from "react";
import * as empleadoService from "../services/team";

export function useEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await empleadoService.fetchEquipo();
      setEmpleados(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error cargando empleados", err);
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const crearEmpleado = useCallback(
    async (data) => {
      try {
        await empleadoService.createEmpleado(data);
        await load();
      } catch (error) {
        console.error("Error creando empleado:", error);
        throw error;
      }
    },
    [load],
  );

  const editarEmpleado = useCallback(
    async (id, data) => {
      try {
        await empleadoService.updateEmpleado(id, data);
        await load();
      } catch (error) {
        console.error("Error editando empleado:", error);
        throw error;
      }
    },
    [load],
  );

  const eliminarEmpleado = useCallback(
    async (id) => {
      try {
        await empleadoService.deleteEmpleado(id);
        await load();
      } catch (error) {
        console.error("Error eliminando empleado:", error);
        throw error;
      }
    },
    [load],
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    empleados,
    loading,
    crearEmpleado,
    editarEmpleado,
    eliminarEmpleado,
  };
}
