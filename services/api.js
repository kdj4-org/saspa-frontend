// services/api.js
import axios from "axios";
import Constants from "expo-constants";
import { getToken } from "../utils/asyncStorage";

const API_URL = Constants.expoConfig.extra.API_URL;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const needsAuth = !config.url.includes("/usuario/");

    if (needsAuth) {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `${token}`; // Inyecta el token, NO es necesario el "Bearer"
      }
      console.log("Verification header added");
    } else {
      delete config.headers;
      console.log("Headers cleaned");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Retorna error si por ejemplo el token no es válido
  }
);
