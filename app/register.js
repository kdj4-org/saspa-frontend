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
import { validateFields } from "../utils/validations";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    rol: "cliente",
    phone: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    setErrors({});

    const newErrors = validateFields(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await register({
        nombre: form.name,
        rol: form.rol,
        email: form.email,
        password: form.password,
        telefono: form.phone,
      });
      router.push("/user");
    } catch (err) {
      console.log("Error al registrar:", err.message, err.response?.data, err);
      setErrors({
        ...errors,
        sameEmail: err.response?.data?.email
          ? "El correo ya existe"
          : undefined,
        samePhone: err.response?.data?.telefono
          ? "El teléfono ya existe"
          : undefined,
        general: err.response?.data?.message || "Error al registrar",
      });
    }
  };

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: undefined });
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>Registro</Text>
        {errors.general && <Text style={styles.error}>{errors.general}</Text>}

        <Text style={styles.subtitle}>Nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={form.name}
          onChangeText={(val) => onChange("name", val)}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        <Text style={styles.subtitle}>Correo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(val) => onChange("email", val)}
          autoCapitalize="none"
        />
        {(errors.email || errors.sameEmail) && (
          <Text style={styles.error}>{errors.email || errors.sameEmail}</Text>
        )}

        <Text style={styles.subtitle}>Teléfono:</Text>
        <TextInput
          style={styles.input}
          placeholder="Número de teléfono"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(val) => onChange("phone", val)}
        />
        {(errors.phone || errors.samePhone) && (
          <Text style={styles.error}>{errors.phone || errors.samePhone}</Text>
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

        <Text style={styles.subtitle}>Confirmar contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirmar contraseña"
          secureTextEntry
          value={form.confirm}
          onChangeText={(val) => onChange("confirm", val)}
        />
        {errors.confirm && <Text style={styles.error}>{errors.confirm}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.textLogin}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    marginBottom: 16,
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
    marginVertical: 12,
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
  textLogin: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#370E49",
    textAlign: "center",
  },
});
