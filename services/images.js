// services/images.js
import { api } from "./api";

export const subirImagen = async (imagen) => {
  const formData = new FormData();

  formData.append("image", {
    uri: imagen.uri,
    type: imagen.type || "image/jpeg",
    name: imagen.fileName || "imagen.jpg",
  });

  console.log("Subiendo imagen:", formData);

  return api.post("/admin/subir-imagen/", formData);
};
