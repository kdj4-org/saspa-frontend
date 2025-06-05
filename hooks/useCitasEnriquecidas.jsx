import { useEffect, useState } from "react";
import { useCitas } from "./useCitas";
import { useServicios } from "./useServicios";
import { useSedes } from "./useSedes";
import { useEmpleados } from "./useEmpleados";

export function useCitasEnriquecidas(estadoInicial) {
  const {
    citas,
    loadingCitas,
    errorCitas,
    approveAppointment,
    rejectAppointment,
    cancelAppointment,
    finishAppointment,
    updateEstado,
  } = useCitas(estadoInicial);

  const { servicios } = useServicios();
  const { sedes } = useSedes();
  const { empleados } = useEmpleados({ admin: true });

  const [citasEnriquecidas, setCitasEnriquecidas] = useState([]);

  useEffect(() => {
    const enriquecidas = citas.map((cita) => {
      const servicio = servicios.find((s) => s.id === cita.servicio_id);
      const sede = sedes.find((s) => s.id === cita.sede_id);
      const empleado = empleados.find((e) => e.id === cita.empleado_id);

      return {
        ...cita,
        servicioNombre: servicio?.nombre || "Servicio desconocido",
        clienteNombre: `Cliente #${cita.usuario_id}`,
        sedeNombre: sede
          ? `${sede.direccion} (${sede.ciudad})`
          : "Sede desconocida",
        empleadoNombre: empleado?.nombre || "Empleado desconocido",
      };
    });

    setCitasEnriquecidas(enriquecidas);
  }, [citas, servicios, sedes, empleados]);

  return {
    citas: citasEnriquecidas,
    loadingCitas,
    errorCitas,
    approveAppointment,
    rejectAppointment,
    cancelAppointment,
    finishAppointment,
    updateEstado,
  };
}
