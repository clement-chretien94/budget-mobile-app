import { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { AuthContext } from "../../../../utils/authContext";
import { Link } from "expo-router";

export default function Settings() {
  const authContext = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Link style={styles.link} href="/create-category">
        Create new category
      </Link>

      <View style={styles.logoutButton}>
        <Button title="Log out!" onPress={authContext.logOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },
  link: {
    marginVertical: 20,
    backgroundColor: "#007BFF",
    color: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    overflow: "hidden",
  },
  logoutButton: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
