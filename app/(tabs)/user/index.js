import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { Link } from "expo-router";
import { Screen } from "../../../components/Screen";
import {
  MailIcon,
  InstagramIcon,
  MessageCircleIcon,
} from "../../../components/Icons";

export default function IndexPage() {
  const handleMailPress = async () => {
    const email = "angelicamariaayalamondragon@gmail.com";
    const subject = "Consulta desde la app";
    const body = "Hola, quiero más información sobre sus servicios.";
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No se pudo abrir la aplicación de correo.");
    }
  };

  const handleWhatsAppPress = async () => {
    const phoneNumber = "573106472828";
    const message = "Hola, quiero más información sobre sus servicios.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "No se pudo abrir WhatsApp.");
    }
  };

  return (
    <Screen>
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Título */}
          <Text style={styles.title}>¡Bienvenidos!</Text>

          {/* Botón de reserva */}
          <Link asChild href={"/user/dates"}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>¡Reserva ya!</Text>
            </TouchableOpacity>
          </Link>
          <Link asChild href={"/login"}>
            <TouchableOpacity style={styles.sectionButton}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </Link>
          <Link asChild href={"/register"}>
            <TouchableOpacity style={styles.sectionButton}>
              <Text style={styles.buttonText}>Registrate</Text>
            </TouchableOpacity>
          </Link>

          {/* Enlace de registro */}
          <Text style={styles.register}>Regístrate</Text>

          {/* Secciones */}
          <Text style={styles.section}>¿Quiénes Somos?</Text>
          <Text style={styles.text}>
            "Somos Sueños de Angel, una empresa dedicada al cuidado y salud de
            tus uñas. Somos especialistas en podología y quiropedia, con
            consulta médica especializada. Además, ofrecemos servicios como
            depilación con cera en cualquier parte del cuerpo y diseño de
            cejas."
          </Text>

          <View style={styles.buttonRow}>
            <Link asChild href={"/user/team"}>
              <TouchableOpacity style={styles.sectionButton}>
                <Text style={styles.sectionText}>Nuestro equipo</Text>
              </TouchableOpacity>
            </Link>

            <Link asChild href={"/user/locations"}>
              <TouchableOpacity style={styles.sectionButton}>
                <Text style={styles.sectionText}>Nuestras sedes</Text>
              </TouchableOpacity>
            </Link>

            <Link asChild href={"/user/gallery"}>
              <TouchableOpacity style={styles.sectionButton}>
                <Text style={styles.sectionText}>Nuestros servicios</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={styles.section}>Contacto</Text>

          {/* Íconos de contacto */}
          <View style={styles.iconRow}>
            <MailIcon
              style={styles.icon}
              size={32}
              color="#5D3A9B"
              onPress={() => handleMailPress()}
            />

            <Link
              asChild
              href="https://www.instagram.com/suenosdeangel_cuidadoybelleza/"
            >
              <InstagramIcon style={styles.icon} size={32} color="#5D3A9B" />
            </Link>

            <MessageCircleIcon
              style={styles.icon}
              size={32}
              color="#5D3A9B"
              onPress={() => handleWhatsAppPress()}
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#E0BBE4", // purple-200
    paddingHorizontal: 16, // px-4
    paddingTop: 16, // pt-4
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E0BBE4",
    paddingTop: 16, // pt-4
    paddingBottom: 32, // py-8
  },
  logo: {
    width: 200, // w-48
    height: 150, // h-32
    borderRadius: 12, // rounded-xl
    marginVertical: 12, // mb-6
    marginHorizontal: 60, // mb-6
  },
  logoContainer: {
    backgroundColor: "#ffffff", // fondo blanco
    padding: 20,
    borderRadius: 16,
    shadowColor: "#FFD700", // color dorado
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10, // para Android
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16, // mb-4
  },
  title: {
    color: "#5D3A9B", // purple-800
    fontSize: 36, // text-4xl
    fontWeight: "bold", // font-bold
    marginBottom: 16, // mb-4
  },
  button: {
    backgroundColor: "#FDE68A", // yellow-300
    borderColor: "#5D3A9B", // purple-800
    borderWidth: 2, // border-2
    paddingVertical: 12, // py-3
    paddingHorizontal: 32, // px-8
    borderRadius: 999, // rounded-full
    marginBottom: 16, // mb-4
  },
  buttonText: {
    color: "#5D3A9B",
    fontSize: 18, // text-lg
    fontWeight: "bold",
  },
  register: {
    color: "#5D3A9B",
    textDecorationLine: "underline",
    marginBottom: 24, // mb-6
  },
  section: {
    color: "#5D3A9B",
    fontSize: 30, // text-3xl
    fontWeight: "600", // font-semibold
    marginBottom: 16, // mb-4
  },
  text: {
    color: "#5D3A9B",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24, // mb-6
  },
  sectionButton: {
    backgroundColor: "#FDE68A", // yellow-300
    borderColor: "#5D3A9B", // purple-800
    borderWidth: 2, // border-2
    paddingVertical: 12, // py-3
    paddingHorizontal: 18, // px-6
    borderRadius: 999, // rounded-full
    marginVertical: 12, // mb-3
    marginHorizontal: 12, // mb-3
  },
  sectionText: {
    color: "#5D3A9B",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  iconRow: {
    flexDirection: "row",
  },
  icon: {
    marginHorizontal: 12, // espacio entre íconos (~space-x-6)
  },
  buttonRow: {
    flexDirection: "column",
  },
});
