import { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { AuthContext } from "../../../utils/authContext";

export default function Tab() {
  const authContext = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text>Tab Settings</Text>

      {/* Log Out Button */}
      <View style={styles.logoutButton}>
        <Button title="Log out!" onPress={authContext.logOut} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  logoutButton: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
