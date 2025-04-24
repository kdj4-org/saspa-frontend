import "dotenv/config";

export default ({ config }) => ({
  ...config,
  name: "saspa",
  slug: "saspa",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  scheme: "saspa",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.kdj4.saspa",
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: ["expo-router"],
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "30ec88e0-53b6-4101-b55a-520fafb39f83",
    },
    API_URL: process.env.API_URL,
  },
});
