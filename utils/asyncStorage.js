// src/utils/asyncStorage.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getToken() {
  const json = await AsyncStorage.getItem("userToken");
  return json ? JSON.parse(json) : null;
}

export async function setToken(token) {
  await AsyncStorage.setItem("userToken", JSON.stringify(token));
}

export async function removeToken() {
  await AsyncStorage.removeItem("userToken");
}
