import { api } from "./api";

// POST /usuario/login
export const fetchlogin = (payload) => api.post("/usuario/login", payload);
