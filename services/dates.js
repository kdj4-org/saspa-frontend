import { api } from "./api";
import Constants from "expo-constants";
import { datesMock } from "./mocks/datesMocks";

const useMocks = Constants.expoConfig.extra.USE_MOCKS === "true";

export const fetchDates = (estado) => {
  if (useMocks) {
    if (estado) {
      return Promise.resolve({
        data: datesMock.filter((date) => date.estado === estado),
      });
    }
    return Promise.resolve({ data: datesMock });
  }
  const params = estado ? `?estado=${estado}` : "";
  return api.get(`/admin/citas/${params}`);
};

export const updateAppointmentStatus = (citaId, accion) => {
  return api.put(`/admin/citas/${citaId}/${accion}/`);
};

export const updateAppointment = (citaId, data) => {
  return api.put(`/admin/citas/${citaId}/`, data);
};
