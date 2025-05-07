// src/utils/asyncStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getToken() {
  const json = await AsyncStorage.getItem("token");
  return json ? JSON.parse(json) : null;
}

export async function setToken(token) {
  await AsyncStorage.setItem("token", JSON.stringify(token));
}

export async function removeToken() {
  await AsyncStorage.removeItem("token");
}
