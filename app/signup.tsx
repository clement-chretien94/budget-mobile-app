import { useContext, useState } from "react";
import {
  Alert,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../utils/authContext";
import { StatusBar } from "expo-status-bar";
import { Feather, MaterialIcons } from "@expo/vector-icons";

export default function Signup() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert("Oops", "Passwords do not match!");
      return;
    }
    authContext.signUp({ fullName, email, password });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.main}>
        <View style={styles.logoWrapper}>
          <View style={styles.logoTile}>
            <Feather name="pie-chart" size={32} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Create your account</Text>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#756388"
            />
          </View>

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

          <View style={styles.inputWrapper}>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#756388"
              secureTextEntry={!showConfirmPassword}
            />
            <Pressable
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              <MaterialIcons
                name={showConfirmPassword ? "visibility-off" : "visibility"}
                size={22}
                color="#756388"
              />
            </Pressable>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.9}
          onPress={handleSignUp}
        >
          <Text style={styles.submitLabel}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.footerLink}>Log in</Text>
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
  logoWrapper: {
    marginBottom: 32,
  },
  logoTile: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#101828",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#141118",
    textAlign: "center",
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  inputWrapper: {
    backgroundColor: "#F0EEF2",
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
  submitButton: {
    backgroundColor: "#4F46E5",
    alignSelf: "stretch",
    paddingVertical: 16,
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
