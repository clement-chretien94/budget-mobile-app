import { Redirect, Stack } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../utils/authContext";

export default function TabLayout() {
  const authContext = useContext(AuthContext);

  // Check if auth context is ready
  if (!authContext.isReady) {
    return null;
  }

  // Redirect to login if not logged in
  if (!authContext.isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
    </Stack>
  );
}
