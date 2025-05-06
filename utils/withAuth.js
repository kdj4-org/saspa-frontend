// src/utils/withAuth.jsx
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/authContext";
import { View, ActivityIndicator } from "react-native";

export default function withAuth(
  Component,
  { authorizedRoles = null, requireAuth = true, redirectTo = "/login" } = {},
) {
  return function Wrapped(props) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
      if (loading) return;
      if (requireAuth && !user) {
        router.replace(redirectTo);
        return;
      }
      if (authorizedRoles && !authorizedRoles.includes(user.rol)) {
        if (router.pathname !== redirectTo) {
          router.replace(redirectTo);
        }
        return;
      }
      setAllowed((prev) => prev || true);
    }, [user, loading, router]);

    if (loading || !allowed) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return <Component {...props} />;
  };
}
