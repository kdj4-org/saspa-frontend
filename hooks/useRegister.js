import { useState } from "react";
import { fetchRegister } from "../services/auth"; // Asegúrate que la ruta es correcta

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async ({ name, email, password, phone }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchRegister({
        nombre: name,
        rol: "cliente",
        email,
        password,
        telefono: phone,
      });
      const { token } = response.data;
      return { token, success: true };
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 400) {
          setError("Datos incompletos o mal formateados.");
        } else if (status === 401) {
          setError("Error al registrar. Verifica los datos."); // Adaptado para registro
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

  return { register, loading, error };
}
