import Constants from "expo-constants";

export const isDevelopment =
  Constants.expoConfig.extra.ENVIRONMENT === "development";

export const print_log = (...args) => {
  if (isDevelopment) {
    console.log(args);
  }
};

export const print_warn = (...args) => {
  if (isDevelopment) {
    console.warn(args);
  }
};

export const print_error = (...args) => {
  if (isDevelopment) {
    console.error(args);
  }
};
