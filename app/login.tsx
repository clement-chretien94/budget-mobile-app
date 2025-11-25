import { useContext, useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AuthContext } from "../utils/authContext";
import { StatusBar } from "expo-status-bar";

export default function Login() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back 👋</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#756388"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#756388"
              secureTextEntry={!showPassword}
            />
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={22}
                color="#756388"
              />
            </Pressable>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={() => authContext.logIn({ email, password })}
          >
            <Text style={styles.submitLabel}>Log In</Text>
          </TouchableOpacity>
          <Pressable
            style={styles.forgotButton}
            onPress={() =>
              Alert.alert(
                "Forgot password",
                "Implement your password reset flow here."
              )
            }
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <Pressable onPress={() => router.push("/signup")}>
          <Text style={styles.footerLink}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: "#F6F6F8",
    justifyContent: "space-between",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#141118",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputWrapper: {
    backgroundColor: "#F2F0F4",
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#141118",
  },
  iconButton: {
    paddingLeft: 12,
  },
  forgotButton: {
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotText: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  submitLabel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#756388",
    marginRight: 6,
  },
  footerLink: {
    color: "#4F46E5",
    fontWeight: "700",
  },
});
