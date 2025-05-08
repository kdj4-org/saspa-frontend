// services/locations.js
import { api } from "./api";

// ===== USER =====

// GET /usuario/servicios
export const fetchSedes = () => {
  console.log("Configuracion de la peticion", api.defaults);
  return api.get("/usuario/sedes/");
};

// ===== ADMIN =====

// POST /admin/sedes
export const createSede = (payload) => api.post("/admin/sedes/", payload);

// PUT /admin/sedes/:id
export const updateSede = (id, payload) =>
  api.put(`/admin/sedes/${id}/`, payload);

// DELETE /admin/sedes/:id
export const deleteSede = (id) => api.delete(`/admin/sedes/${id}/`);
