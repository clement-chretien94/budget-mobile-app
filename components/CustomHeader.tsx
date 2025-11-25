import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

interface CustomHeaderProps extends Partial<NativeStackHeaderProps> {
  title: string;
  canGoBack?: boolean;
  onBackPress?: () => void;
}

export default function CustomHeader({
  title,
  navigation,
  canGoBack,
  onBackPress,
}: CustomHeaderProps) {
  const showBack = canGoBack || navigation?.canGoBack();

  const handlePress = () => {
    if (onBackPress) return onBackPress();
    if (navigation && navigation.canGoBack()) navigation.goBack();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "#F6F6F8" }}>
      <View style={styles.container}>
        {showBack ? (
          <TouchableOpacity
            onPress={handlePress}
            style={styles.leftBtn}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <MaterialIcons name="arrow-back" size={24} color="#17191C" />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftPlaceholder} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#141118",
  },
  leftBtn: {
    position: "absolute",
    left: 12,
    padding: 4,
    borderRadius: 24,
  },
  leftPlaceholder: {
    position: "absolute",
    left: 12,
    width: 24,
    height: 24,
  },
});
