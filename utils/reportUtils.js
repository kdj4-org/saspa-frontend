export const PERIODS = {
  WEEKLY: "semanal",
  MONTHLY: "mensual",
  YEARLY: "anual",
};

export function generarResumenCitas(citas, periodo) {
  const ahora = new Date();
  let fechaInicio;
  const top = 3;

  switch (periodo) {
    case PERIODS.WEEKLY:
      fechaInicio = new Date(ahora);
      fechaInicio.setDate(ahora.getDate() - 7);
      break;
    case PERIODS.MONTHLY:
      fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      break;
    case PERIODS.YEARLY:
      fechaInicio = new Date(ahora.getFullYear(), 0, 1);
      break;
    default:
      return null;
  }

  const enRango = citas.filter((c) => new Date(c.fecha) >= fechaInicio);

  const contarTop = (clave) => {
    const mapa = {};
    for (const cita of enRango) {
      const key = cita[clave];
      if (key) mapa[key] = (mapa[key] || 0) + 1;
    }
    const entradas = Object.entries(mapa);
    return entradas
      .sort((a, b) => b[1] - a[1])
      .slice(0, top)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }));
  };

  return {
    especialistas: contarTop("empleadoNombre"),
    servicios: contarTop("servicioNombre"),
    sedes: contarTop("sedeNombre"),
  };
}
