import { useContext, useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Switch } from "react-native";
import { AuthContext } from "../../../../utils/authContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function Settings() {
  const authContext = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);

  const userName = useMemo(() => {
    return authContext.user?.fullName || "Guest User";
  }, [authContext.user?.fullName]);

  const userEmail = useMemo(() => {
    return authContext.user?.email || "unknown@email.com";
  }, [authContext.user?.email]);

  const avatarSource = {
    uri: "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg",
  };

  const handleToggleDark = () => setDarkMode((v) => !v);

  return (
    <View style={styles.container}>
      {/* Profile Header Block */}
      <View style={styles.profileBlock}>
        <View style={styles.avatarWrapper}>
          <Image source={avatarSource} style={styles.avatar} />
        </View>
        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>
      </View>

      {/* Settings List */}
      <View style={styles.rowCard}>
        <Text style={styles.rowLabel}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={handleToggleDark}
          trackColor={{ false: "#E5E7EB", true: "#4F46E5" }}
          thumbColor={"#FFFFFF"}
          style={{ width: 24, height: 24 }}
        />
      </View>
      <Link href="/create-category" style={styles.rowCard} asChild>
        <Pressable>
          <Text style={styles.rowLabel}>Manage Categories</Text>
          <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
        </Pressable>
      </Link>
      <Link href="/security" style={styles.rowCard} asChild>
        <Pressable>
          <Text style={styles.rowLabel}>Security</Text>
          <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
        </Pressable>
      </Link>
      <Link href="/help-support" style={styles.rowCard} asChild>
        <Pressable>
          <Text style={styles.rowLabel}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
        </Pressable>
      </Link>

      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={authContext.logOut}>
        <Text style={styles.logoutLabel}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F8",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  profileBlock: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFE7D3",
    overflow: "hidden",
    shadowColor: "#141118",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#141118",
    marginTop: 16,
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: "#141118",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
    marginBottom: 14,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#141118",
  },
  logoutButton: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 2,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EF4444",
  },
});
