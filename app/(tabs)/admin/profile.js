import { ScrollView, Text, TouchableOpacity } from "react-native";
import { Screen } from "../../../components/Screen";
import { useAuth } from "../../../context/authContext";
import { useRouter } from "expo-router";

export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-black text-xl font-bold mb-6">Perfil</Text>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-purple-600 py-3 px-4 rounded-md"
        >
          <Text className="text-white text-center font-semibold">
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
