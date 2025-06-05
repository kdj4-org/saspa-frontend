import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../../context/authContext";
import { useRouter } from "expo-router";
import { COLORS } from "../../../config/Colors";

const UserHeader = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const nombre = user?.nombre || "";
  const iniciales = nombre
    .split(" ")
    .slice(0, 2)
    .map((n) => n[1]?.toUpperCase());

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{iniciales}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{nombre}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.purple.text.hex,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  info: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.purple.text.hex,
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: COLORS.purple.text.hex,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default UserHeader;
