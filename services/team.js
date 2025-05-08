// services/team.js
import { api } from "./api";

// ===== USER =====

// GET /cliente/equipo/
export const fetchEquipo = () => {
  console.log("Configuracion de la peticion", api.defaults);
  return api.get("/cliente/equipo/");
};

// ===== ADMIN =====

// POST /admin/empleados
export const createEmpleado = (payload) =>
  api.post("/admin/empleados/", payload);

// PUT /admin/empleados/:id
export const updateEmpleado = (id, payload) =>
  api.put(`/admin/empleados/${id}/`, payload);

// DELETE /admin/sedes/:id
export const deleteEmpleado = (id) => api.delete(`/admin/empleados/${id}/`);
