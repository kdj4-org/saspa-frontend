import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Screen } from "../components/Screen";
import { useAuth } from "../context/authContext";
import { useRouter } from "expo-router";
import { validateLogin } from "../utils/validations";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const newErrors = validateLogin(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const usr = await login({ email: form.email, password: form.password });
      const rol = usr?.rol;

      console.log("Usuario logueado:", usr);
      console.log("Rol del usuario:", rol);

      if (rol === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/user");
      }
    } catch (err) {
      const resp = err.response;
      const data = resp?.data || {};
      // Mapear errores específicos de login
      setErrors({
        general: data.message ?? "Error al iniciar sesión",
        email:
          data.message === "User not found" || resp?.status === 404
            ? "Correo no registrado"
            : undefined,
        password:
          data.message === "Incorrect password" || resp?.status === 401
            ? "Contraseña incorrecta"
            : undefined,
      });
    }
  };

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: undefined, general: undefined });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Inicio de sesión</Text>
        {errors.general && <Text style={styles.error}>{errors.general}</Text>}

        <Text style={styles.subtitle}>Correo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(val) => onChange("email", val)}
        />
        {(errors.email || errors.sameEmail) && (
          <Text style={styles.error}>{errors.email || errors.sameEmail}</Text>
        )}

        <Text style={styles.subtitle}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={form.password}
          onChangeText={(val) => onChange("password", val)}
        />
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.textRegister}>¿No tienes cuenta? Registrate</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#5D3A9B",
    textAlign: "center",
    marginBottom: 120,
    marginTop: 50,
  },
  error: { color: "red", fontSize: 14, marginBottom: 8 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    marginBottom: 4,
    backgroundColor: "#9F71B3",
    borderColor: "#370E49",
  },
  button: {
    backgroundColor: "#E0B6AB",
    borderColor: "#5D3A9B",
    borderWidth: 2,
    padding: 12,
    borderRadius: 999,
    marginTop: 80,
    marginBottom: 12,
    marginHorizontal: 90,
  },
  buttonText: {
    color: "#5D3A9B",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#370E49",
    marginTop: 12,
  },
  textRegister: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#370E49",
    textAlign: "center",
  },
});
