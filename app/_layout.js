import "./../global.css";
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  return (
    <>
      <Redirect href="/user" />
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <StatusBar style="auto" />
      </View>
    </>
  );
}
