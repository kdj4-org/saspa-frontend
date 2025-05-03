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
    backgroundColor: "#D8BFD8",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#D8BFD8",
    paddingTop: 16,
    paddingBottom: 32,
  },
  logo: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginVertical: 12,
    marginHorizontal: 60,
  },
  logoContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#5D3A9B",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#E0B6AB",
    borderColor: "#5D3A9B",
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
    marginBottom: 16,
  },
  buttonText: {
    color: "#5D3A9B",
    fontSize: 18,
    fontWeight: "bold",
  },
  register: {
    color: "#5D3A9B",
    textDecorationLine: "underline",
    marginBottom: 24,
  },
  section: {
    color: "#5D3A9B",
    fontSize: 30,
    fontWeight: "600",
    marginBottom: 16,
  },
  text: {
    color: "#5D3A9B",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  sectionButton: {
    backgroundColor: "#E0B6AB",
    borderColor: "#5D3A9B",
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginVertical: 12,
    marginHorizontal: 12,
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
    marginHorizontal: 12, // espacio entre íconos
  },
  buttonRow: {
    flexDirection: "column",
  },
});
