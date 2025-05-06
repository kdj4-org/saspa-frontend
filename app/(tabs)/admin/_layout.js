import { Tabs } from "expo-router";
import { View } from "react-native";
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  ImageIcon,
  MapPinIcon,
  UserIcon,
} from "../../../components/Icons";
import withAuth from "../../../utils/withAuth";

function TabsAdminLayout() {
  const iconWrapper = (IconComponent, focused, color) => (
    <View
      style={{
        transform: [{ scale: focused ? 1.3 : 1 }],
        padding: focused ? 2 : 0,
      }}
    >
      <IconComponent color={color} />
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#9f70b2",
          height: 60,
        },
        tabBarItemStyle: {
          paddingVertical: 12,
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "#333",
        tabBarActiveTintColor: "#6a0dad",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused, color }) =>
            iconWrapper(HomeIcon, focused, color),
        }}
      />
      <Tabs.Screen
        name="dates"
        options={{
          title: "Citas",
          tabBarIcon: ({ focused, color }) =>
            iconWrapper(CalendarIcon, focused, color),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: "Equipo",
          tabBarIcon: ({ focused, color }) =>
            iconWrapper(UsersIcon, focused, color),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: "Publicaciones",
          tabBarIcon: ({ focused, color }) =>
            iconWrapper(ImageIcon, focused, color),
        }}
      />
      <Tabs.Screen
        name="locations"
        options={{
          title: "Sedes",
          tabBarIcon: ({ focused, color }) =>
            iconWrapper(MapPinIcon, focused, color),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused, color }) =>
            iconWrapper(UserIcon, focused, color),
        }}
      />
    </Tabs>
  );
}

export default withAuth(TabsAdminLayout, {
  authorizedRoles: ["admin"],
  requireAuth: true,
  redirectTo: "/login",
});
