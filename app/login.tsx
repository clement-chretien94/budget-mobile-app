import { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../utils/authContext";

export default function Login() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  // State to manage the username and password inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholder="Username"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Password"
        secureTextEntry
      />
      <Button
        title="Login in!"
        onPress={() => authContext.logIn({ username, password })}
      />
      <Text style={{ marginTop: 20 }}>
        Don't have an account?{" "}
        <Text
          onPress={() => {
            // Navigate to the signup page
            router.push("/signup");
          }}
          style={{ color: "blue" }}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});
