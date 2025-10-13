import { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { AuthContext } from "../../../../utils/authContext";
import { createCategory } from "../../../../api";

export default function CreateCategory() {
  const authContext = useContext(AuthContext);

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("");

  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState("");

  const handleCreateCategory = async () => {
    if (!authContext.jwtToken) {
      console.error("JWT token is missing");
      return;
    }

    if (!name || !emoji || !color) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await createCategory(authContext.jwtToken, {
        name,
        emoji,
        color,
      });
      setIsCreated(true);
      setTimeout(() => {
        setIsCreated(false);
      }, 1000);
      setError("");
      setName("");
      setEmoji("");
      setColor("");
    } catch (error) {
      console.error("Error creating category:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred");
      }
      return;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Category Emoji</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter category emoji"
        value={emoji}
        onChangeText={setEmoji}
      />
      <Text style={styles.label}>Category Color</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputText}
          placeholder="Enter category color (hex)"
          autoCapitalize="none"
          autoCorrect={false}
          value={color}
          onChangeText={setColor}
        />
        <View
          style={[
            styles.colorSwatch,
            { backgroundColor: color ? color : "#fff" },
          ]}
        />
      </View>
      <Button
        title={isCreated ? "Created" : "Save"}
        color={isCreated ? "green" : undefined}
        onPress={isCreated ? undefined : handleCreateCategory}
      />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  inputText: {
    flex: 1,
    padding: 10,
  },
  colorSwatch: {
    width: 28,
    alignSelf: "stretch",
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
});
