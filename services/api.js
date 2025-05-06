// services/api.js
import axios from "axios";
import Constants from "expo-constants";
import { getToken } from "../utils/asyncStorage";

const API_URL = Constants.expoConfig.extra.API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Este interceptor se dispara antes de cada petición
api.interceptors.request.use(
  async (config) => {
    // Obtengo el token
    const token = await getToken();

    // Reinicio a cero todos los headers
    config.headers = {};

    // Siempre quiero JSON
    config.headers["Content-Type"] = "application/json";
    config.headers["Accept"] = "application/json";

    // Si la ruta no es pública, inyecto el access token
    if (!config.url.startsWith("/usuario/") && token) {
      config.headers["Authorization"] = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
