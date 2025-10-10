import { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { AuthContext } from "../../../utils/authContext";

export default function Tab() {
  const authContext = useContext(AuthContext);

  const handleCreateCategory = () => {
    // Logic to create a new category
  };

  return (
    <View style={styles.container}>
      <Text>Tab Settings</Text>
      <Button title="Create new category" onPress={handleCreateCategory} />

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
  logoutButton: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
