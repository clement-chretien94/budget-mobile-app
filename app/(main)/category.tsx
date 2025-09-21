import { View, Text, StyleSheet } from "react-native";

export default function Category() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});
