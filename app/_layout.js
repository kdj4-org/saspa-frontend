import "./../global.css";
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";
import { AuthProvider } from "../context/authContext";

export default function Layout() {
  return (
    <>
      <View className="flex-1">
        <AuthProvider>
          <Redirect href="/register" />
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
