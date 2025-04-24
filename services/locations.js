import { api } from "./api";

//GET /usuario/sedes
export const fetchSedes = () => api.get("/usuario/sedes");

//GET /admin/sedes
export const fetchSedesAdmin = () => api.get("/admin/sedes");

//POST /admin/sedes
export const createSede = (payload) => api.post("/admin/sedes", payload);

//PUT /admin/sedes/:id
export const updateSede = (id, payload) =>
  api.put(`/admin/sedes/${id}`, payload);

//DELETE /admin/sedes/:id
export const deleteSede = (id) => api.delete(`/admin/sedes/${id}`);
