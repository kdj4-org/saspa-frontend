// services/galeria.js
import { api } from "./api";
import Constants from "expo-constants";
import { galleryMock } from "./mocks/galleryMocks";

const USE_MOCKS = Constants.expoConfig.extra.USE_MOCKS === "true";

// ===== USER =====

// GET /usuario/publicaciones
export const fetchPublicaciones = () => {
  if (USE_MOCKS) {
    return Promise.resolve({ data: galleryMock });
  }
  return api.get("/usuario/publicaciones/");
};

// ===== ADMIN =====

// POST /admin/publicaciones
export const createPublicacion = (payload) =>
  api.post("/admin/publicaciones/", payload);

// DELETE /admin/publicaciones/:id
export const deletePublicacion = (id) =>
  api.delete(`/admin/publicaciones/${id}/`);
