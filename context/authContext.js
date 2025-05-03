// src/context/authContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { setToken, getToken, removeToken } from "../utils/asyncStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = getToken("token");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser({ token });
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
    try {
      const res = await api.post("/usuario/login", credentials);
      const { token, user } = res.data;
      setToken("token");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data) => {
    try {
      delete api.defaults.headers.common["Authorization"];
      const res = await api.post("/cliente/registrar/", data);
      const { token, user } = res.data;
      setToken("token");
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    removeToken("token");
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
