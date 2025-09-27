import React from "react";
import { Transaction } from "../types";
import { View, Text, StyleSheet } from "react-native";

export default function TransactionItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  return (
    <View style={styles.transactionItem}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Text
          style={{
            fontSize: 24,
            padding: 8,
            backgroundColor: "#F0F0F0",
            borderRadius: 8,
          }}
        >
          {transaction.categoryEmoji}
        </Text>
        <View>
          <Text style={styles.transactionDescription}>{transaction.name}</Text>
          <Text style={{ color: "#6c757d" }}>{transaction.categoryName}</Text>
        </View>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: transaction.type === "income" ? "green" : "red" },
        ]}
      >{`${transaction.type === "expense" ? "-" : "+"}$${
        transaction.amount
      }`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  transactionDescription: {
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
