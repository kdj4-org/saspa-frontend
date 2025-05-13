// services/images.js
import * as FileSystem from "expo-file-system";
import { api } from "./api";

export const subirImagen = async (imagen) => {
  const base64 = await FileSystem.readAsStringAsync(imagen.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const extension = imagen.uri.split(".").pop().toLowerCase();
  const mime =
    {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
    }[extension] || "image/jpeg";

  const payload = {
    filename: imagen.fileName || imagen.name || "imagen.jpg",
    data: `data:${mime};base64,${base64}`,
  };

  console.log("Subiendo imagen:", payload.filename);

  const response = await api.post("/admin/subir-imagen/", payload);
  return response.data;
};
