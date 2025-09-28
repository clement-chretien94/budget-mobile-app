import { View, Text, StyleSheet } from "react-native";

import { BudgetCategory } from "../types";

export default function CategoryItem({
  category,
}: {
  category: BudgetCategory["categories"][0];
}) {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <View style={styles.info}>
        <Text
          style={{
            fontSize: 24,
            padding: 8,
            backgroundColor: "#F0F0F0",
            borderRadius: 8,
          }}
        >
          {category.emoji}
        </Text>
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.name}>{category.name}</Text>
          <Text>
            ${category.totalExpenses} / ${category.limitAmount}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            height: 8,
            width: "100%",
            backgroundColor: "#F0F0F0",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: 8,
              width: `${
                (category.totalExpenses / category.limitAmount) * 100
              }%`,
              backgroundColor:
                category.totalExpenses > category.limitAmount
                  ? "red"
                  : category.totalExpenses > 0.8 * category.limitAmount
                  ? "yellow"
                  : "green",
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
