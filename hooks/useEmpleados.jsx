import { useState, useEffect, useCallback } from "react";
import * as empleadoService from "../services/team";
import { print_error } from "../utils/development";

export function useEmpleados({ admin = false }) {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (admin) {
        const res = await empleadoService.fetchEmpleados();
        setEmpleados(Array.isArray(res.data) ? res.data : []);
      } else {
        const res = await empleadoService.fetchEquipo();
        setEmpleados(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      print_error("Error cargando empleados", err);
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  }, [admin]);

  const crearEmpleado = useCallback(
    async (data) => {
      try {
        await empleadoService.createEmpleado(data);
        await load();
      } catch (error) {
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
        print_error("Error editando empleado:", error);
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
        print_error("Error eliminando empleado:", error);
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
    loadEmpleados: load,
  };
}
