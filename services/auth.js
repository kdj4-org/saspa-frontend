import { api } from "./api";

// POST /usuario/login
export const fetchlogin = (payload) => api.post("/usuario/login", payload);

// POST /usuario/registro
export const fetchRegister = (payload) =>
  api.post("/usuario/registrar", payload);
