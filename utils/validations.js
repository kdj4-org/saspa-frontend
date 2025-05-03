// src/utils/validation.js

// Expresiones regulares para validación de campos
export const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\d{7,15}$/;
export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,}$/;

/**
 * Valida los campos del formulario de registro.
 * @param {{ name: string, email: string, phone: string, password: string, confirm: string }} form
 * @returns {{ [key: string]: string }} Objeto con mensajes de error por campo.
 */
export function validateFields(form) {
  const errs = {};

  if (!nameRegex.test(form.name)) {
    errs.name =
      "El nombre debe tener al menos 3 letras y solo contener letras y espacios.";
  }
  if (!emailRegex.test(form.email)) {
    errs.email = "Ingresa un correo electrónico válido.";
  }
  if (!phoneRegex.test(form.phone)) {
    errs.phone = "El teléfono debe tener solo dígitos (7–15 caracteres).";
  }
  if (!passwordRegex.test(form.password)) {
    errs.password =
      "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un carácter especial, sin espacios.";
  }
  if (form.password !== form.confirm) {
    errs.confirm = "Las contraseñas no coinciden.";
  }

  return errs;
}
