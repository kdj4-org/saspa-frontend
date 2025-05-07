// src/context/authContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, setToken, removeToken } from "../utils/asyncStorage";
import { jwtDecode } from "jwt-decode";
import { api } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const user = jwtDecode(token);
          setUser(user);
        }
      } catch (error) {
        console.log("Error cargando usuario:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/usuario/login/", credentials);
    console.log("Respuesta de login:", res.data);

    const { Authorization: token } = res.data;
    if (!token) throw new Error("Token no recibido");

    await setToken(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const user = jwtDecode(token);
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const res = await api.post("/cliente/registrar/", data);
    const { Authorization: token } = res.data;
    if (!token) throw new Error("Token no recibido");

    await setToken(token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const user = jwtDecode(token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await removeToken();
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
