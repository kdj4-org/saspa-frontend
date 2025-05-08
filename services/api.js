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

// justo después de crear tu instancia `api`
api.interceptors.request.use(async (config) => {
  const token = await getToken();

  config.headers = {};

  config.headers["Content-Type"] = "application/json";
  config.headers["Accept"] = "application/json";

  if (!config.url.startsWith("/usuario/") && token) {
    config.headers["Authorization"] = `${token}`;
  }
  return config;
});
