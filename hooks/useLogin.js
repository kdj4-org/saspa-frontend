import { useState } from "react";
import { fetchlogin } from "../services/auth"; // Asegúrate que la ruta es correcta

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchlogin({ email, password });
      const { token } = response.data;
      return { token, success: true };
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 400) {
          setError("Datos incompletos o mal formateados.");
        } else if (status === 401) {
          setError("Credenciales incorrectas.");
        } else {
          setError("Error desconocido. Intenta más tarde.");
        }
      } else {
        setError("Sin conexión al servidor.");
      }
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
