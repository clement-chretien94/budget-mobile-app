import { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthContext } from "../../utils/authContext";

export default function Tab() {
  const authContext = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text>Tab Home</Text>
      <Button title="Log out!" onPress={authContext.logOut} />
      <Text>Token: {authContext.jwtToken}</Text>
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
