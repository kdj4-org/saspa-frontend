import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Screen } from "../components/Screen";
import { useRouter } from "expo-router";
import { useRegister } from "../hooks/useRegister"; // Asegúrate de crear este hook

export default function Register() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");

  const [errorNombre, setErrorNombre] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorContrasena, setErrorContrasena] = useState("");
  const [errorConfirmarContrasena, setErrorConfirmarContrasena] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");

  const { register, loading, error } = useRegister(); // Custom hook para la lógica de registro

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validarTelefono = (telefono) => /^\d+$/.test(telefono); // Simple validación numérica

  const handleRegister = async () => {
    setErrorNombre("");
    setErrorCorreo("");
    setErrorTelefono("");
    setErrorContrasena("");
    setErrorConfirmarContrasena("");
    setErrorGeneral("");

    if (!nombre) return setErrorNombre("El nombre es obligatorio.");
    if (!correo) return setErrorCorreo("El correo es obligatorio.");
    if (!validarEmail(correo)) return setErrorCorreo("Correo no válido.");
    if (!telefono) return setErrorTelefono("El teléfono es obligatorio.");
    if (!validarTelefono(telefono))
      return setErrorTelefono("Teléfono no válido.");
    if (!contrasena) return setErrorContrasena("La contraseña es obligatoria.");
    if (!confirmarContrasena)
      return setErrorConfirmarContrasena("Debes confirmar la contraseña.");
    if (contrasena !== confirmarContrasena)
      return setErrorConfirmarContrasena("Las contraseñas no coinciden.");

    const result = await register({
      name: nombre,
      email: correo,
      phone: telefono,
      password: contrasena,
    });

    if (result?.success) {
      console.log("Usuario registrado exitosamente:", result.data);
      // Aquí puedes redirigir al usuario a la pantalla de inicio de sesión o mostrar un mensaje de éxito
      router.push("/login"); // Ejemplo de redirección
    } else {
      setErrorGeneral(result?.error || "Error al registrar el usuario.");
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>

        <Text style={styles.subtitle}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        {errorNombre ? <Text style={styles.error}>{errorNombre}</Text> : null}

        <Text style={styles.subtitle}>Correo</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errorCorreo ? <Text style={styles.error}>{errorCorreo}</Text> : null}

        <Text style={styles.subtitle}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
        {errorTelefono ? (
          <Text style={styles.error}>{errorTelefono}</Text>
        ) : null}

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

        <Text style={styles.subtitle}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          value={confirmarContrasena}
          onChangeText={setConfirmarContrasena}
          secureTextEntry
        />
        {errorConfirmarContrasena ? (
          <Text style={styles.error}>{errorConfirmarContrasena}</Text>
        ) : null}

        {errorGeneral ? <Text style={styles.error}>{errorGeneral}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Registrando..." : "Registrarse"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.loginLink}>¿Ya tienes cuenta?</Text>
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
  loginLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#370E49",
    fontSize: 16,
  },
});
