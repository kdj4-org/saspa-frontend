// services/teamServices.jsx
import { api } from "./api";
import Constants from "expo-constants";
import { serviciosVinculadosMock } from "./mocks/teamServicesMocks";

const USE_MOCKS = Constants.expoConfig.extra.USE_MOCKS === "true";

// GET /usuario/empleados/{empleadoId}/servicios/
export const fetchServiciosVinculados = (empleadoId) => {
  if (USE_MOCKS) {
    return Promise.resolve({
      data: serviciosVinculadosMock.filter(
        (item) => item.empleadoId === parseInt(empleadoId),
      ),
    });
  }
  return api.get(`/usuario/empleados/${empleadoId}/servicios/`);
};

// POST /admin/empleados/{empleadoId}/servicios/
export const vincularServicio = (empleadoId, servicioId) => {
  return api.post(`/admin/empleados/${empleadoId}/servicios/`, { servicioId });
};

// DELETE /admin/empleados/{empleadoId}/servicios/{servicioId}/
export const desvincularServicio = (empleadoId, servicioId) => {
  return api.delete(`/admin/empleados/${empleadoId}/servicios/${servicioId}/`);
};
