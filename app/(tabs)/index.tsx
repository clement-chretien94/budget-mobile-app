import { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthContext } from "../../utils/authContext";

export default function Tab() {
  const authContext = useContext(AuthContext);
  const user = authContext.user;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user?.username}</Text>
      <Button title="Log out!" onPress={authContext.logOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
