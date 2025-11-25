import { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../../../../utils/authContext";
import { createCategory } from "../../../../api";

export default function CreateCategory() {
  const authContext = useContext(AuthContext);

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (isCreated) return;
    if (!authContext.jwtToken) {
      console.error("JWT token is missing");
      return;
    }
    if (!name || !emoji) {
      setError("Please fill all required fields");
      return;
    }
    try {
      await createCategory(authContext.jwtToken, { name, emoji });
      setIsCreated(true);
      setName("");
      setEmoji("");
      setError("");
      setTimeout(() => setIsCreated(false), 1400);
    } catch (err) {
      console.error("Error creating category:", err);
      if (err instanceof Error) setError(err.message);
      else setError("An error occurred");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Category name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9CA3AF"
            returnKeyType="next"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Emoji</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 🛒"
            value={emoji}
            onChangeText={setEmoji}
            maxLength={6}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {error ? (
        <View style={[styles.feedback, styles.errorFeedback]}>
          <Text style={styles.feedbackText}>{error}</Text>
        </View>
      ) : null}

      {isCreated ? (
        <View style={[styles.feedback, styles.successFeedback]}>
          <Text style={styles.feedbackText}>Category successfully created</Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleSave}
        disabled={isCreated}
        style={() => [
          styles.primaryButton,
          isCreated && styles.primaryButtonDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Save category"
      >
        <Text style={styles.primaryButtonLabel}>
          {isCreated ? "Saved!" : "Save category"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F6F8",
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#141118",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  feedback: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  errorFeedback: {
    backgroundColor: "#FEE2E2",
  },
  successFeedback: {
    backgroundColor: "#DCFCE7",
  },
  feedbackText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.05,
  },
  primaryButtonLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
