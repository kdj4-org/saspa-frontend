import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Screen } from "../components/Screen";
import { useLogin } from "../hooks/useLogin";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorContrasena, setErrorContrasena] = useState("");
  const { login, loading, error } = useLogin();

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleLogin = async () => {
    setErrorCorreo("");
    setErrorContrasena("");

    if (!correo) return setErrorCorreo("El correo es obligatorio.");
    if (!validarEmail(correo)) return setErrorCorreo("Correo no válido.");
    if (!contrasena) return setErrorContrasena("Contraseña obligatoria.");

    const result = await login({ email: correo, password: contrasena });

    if (result.success) {
      console.log("TOKEN:", result.token);
      console.log("Inicio de sesión exitoso.");
      // Aquí puedes redirigir al usuario a la pantalla principal o donde desees
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <Text style={styles.subtitle}>Correo/Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo/Teléfono"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errorCorreo ? <Text style={styles.error}>{errorCorreo}</Text> : null}
        <Text style={styles.subtitle}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />
        {errorContrasena ? (
          <Text style={styles.error}>{errorContrasena}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cargando..." : "Inicio Sesión"}
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#EAC696",
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#370E49",
    borderRadius: 50,
    fontFamily: "cursive",
  },
  error: { color: "red", marginBottom: 12, fontSize: 14 },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#9F71B3",
    borderColor: "#370E49",
  },
  button: {
    backgroundColor: "#EAC696",
    padding: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 5,
    borderColor: "#370E49",
    alignSelf: "center",
  },
  buttonText: {
    color: "#370E49",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bolder",
    marginBottom: 8,
    color: "#370E49",
  },
});
