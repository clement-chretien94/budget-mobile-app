import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../utils/authContext";

export default function Layout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
        <Stack.Screen name="login" options={{ animation: "none" }} />
      </Stack>
    </AuthProvider>
  );
}
