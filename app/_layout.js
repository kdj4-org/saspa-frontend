import "./../global.css";
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from "expo-router";
import { View, Text } from "react-native";
import { AuthProvider, useAuth } from "../context/authContext";

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    // Mientras se comprueba la sesión
    return <Text>Comprobando sesión...</Text>;
  }

  if (!user) {
    // No está autenticado
    return <Redirect href="/login" />;
  }

  // Está autenticado, redirige según rol
  if (user.rol === "admin") {
    return <Redirect href="/admin" />;
  }

  return <Redirect href="/user" />;
}

export default function Layout() {
  return (
    <>
      <View className="flex-1">
        <AuthProvider>
          {/* Comprueba rol y estado de autenticación */}
          <ProtectedRoutes />

          {/* Stack para rutas hijas si las hubiera */}
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AuthProvider>
        <StatusBar style="auto" />
      </View>
    </>
  );
}
