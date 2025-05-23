import { api } from "./api";

// ===== DISPONIBILIDAD EMPLEADOS =====

/**
 * Obtener la disponibilidad de todos los empleados
 * GET /admin/disponibilidad-empleados/
 */
export const fetchDisponibilidadEmpleados = () => {
  return api.get("/admin/disponibilidad-empleados/");
};

/**
 * Crear disponibilidad para un empleado
 * POST /admin/empleados/:empleadoId/disponibilidad/
 * @param {number|string} empleadoId
 * @param {{ disponibilidad: Array }} payload
 */
export const createDisponibilidadEmpleado = (empleadoId, payload) => {
  return api.post(`/admin/empleados/${empleadoId}/disponibilidad/`, payload);
};

/**
 * Actualizar disponibilidad de un empleado
 * PUT /admin/empleados/:empleadoId/disponibilidad/
 * @param {number|string} empleadoId
 * @param {{ disponibilidad: Array }} payload
 */
export const updateDisponibilidadEmpleado = (empleadoId, payload) => {
  return api.put(`/admin/empleados/${empleadoId}/disponibilidad/`, payload);
};

// ===== BLOQUEOS EMPLEADOS =====

/**
 * Obtener todos los bloqueos
 * GET /admin/bloqueo/
 */

export const fetchBloqueos = () => {
  return api.get("/admin/bloqueo/");
};

/**
 * Crear un bloqueo manual o generado automáticamente
 * POST /admin/bloqueo/
 * @param {{ fecha_inicio: string, fecha_fin: string, empleado_id: number|string, cita_id?: number|null }} payload
 */
export const createBloqueo = (payload) => {
  return api.post("/admin/bloqueo/", payload);
};

/**
 * Eliminar un bloqueo
 * DELETE /admin/bloqueo/:bloqueoId/
 * @param {number|string} bloqueoId
 */

export const deleteBloqueo = (bloqueoId) => {
  return api.delete(`/admin/bloqueo/${bloqueoId}/`);
};
