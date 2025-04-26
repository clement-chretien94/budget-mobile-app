import { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthContext } from "../utils/authContext";

export default function Login() {
  const authContext = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button title="Login in!" onPress={authContext.logIn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
