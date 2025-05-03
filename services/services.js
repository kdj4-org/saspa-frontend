// services/servicios.js
import { api } from "./api";
import Constants from "expo-constants";
import { servicesMock } from "./mocks/servicesMock";

const USE_MOCKS = Constants.expoConfig.extra.USE_MOCKS === "true";

// ===== USER =====

// GET /usuario/servicios
export const fetchServicios = () => {
  if (USE_MOCKS) {
    return Promise.resolve({ data: servicesMock });
  }
  console.log("Configuracion de la peticion", api.defaults);
  return api.get("/usuario/servicios");
};

// ===== ADMIN =====

// POST /admin/servicios
export const createServicio = (payload) =>
  api.post("/admin/servicios", payload);

// PUT /admin/servicios/:id
export const updateServicio = (id, payload) =>
  api.put(`/admin/servicios/${id}`, payload);

// DELETE /admin/servicios/:id
export const deleteServicio = (id) => api.delete(`/admin/servicios/${id}`);
