// services/team.js
import { api } from "./api";

// ===== USER =====

// GET /cliente/equipo/
export const fetchEquipo = () => {
  return api.get("/cliente/equipo/");
};

// ===== ADMIN =====
// GET /admin/empleados/
export const fetchEmpleados = () => {
  return api.get("/admin/empleados/");
};

// POST /admin/empleados
export const createEmpleado = (payload) =>
  api.post("/admin/empleados/", payload);

// PUT /admin/empleados/:id
export const updateEmpleado = (id, payload) =>
  api.put(`/admin/empleados/${id}/`, payload);

// DELETE /admin/sedes/:id
export const deleteEmpleado = (id) => api.delete(`/admin/empleados/${id}/`);
