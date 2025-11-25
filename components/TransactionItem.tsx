import React, { useMemo } from "react";
import { Transaction } from "../types";
import { View, Text, StyleSheet } from "react-native";

export default function TransactionItem({
  transaction,
}: {
  transaction: Transaction;
}) {
  const formattedTime = useMemo(() => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, [transaction.date]);

  const amountPrefix = transaction.type === "expense" ? "-" : "+";
  const amountValue = Number(transaction.amount).toFixed(2);
  const amountColorStyle =
    transaction.type === "income" ? styles.amountIncome : styles.amountExpense;

  const categoryEmoji = transaction.categoryEmoji || "💰";

  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{categoryEmoji}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>
            {transaction.name}
          </Text>
          <Text style={styles.hourText}>{formattedTime}</Text>
        </View>
      </View>
      <Text style={[styles.amountText, amountColorStyle]}>
        {`${amountPrefix}$${amountValue}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#141118",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
    marginBottom: 14,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    backgroundColor: "rgba(79, 70, 229, 0.1)",
  },
  iconText: {
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#141118",
    marginBottom: 2,
  },
  hourText: {
    fontSize: 13,
    color: "#6B7280",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
  },
  amountExpense: {
    color: "#EF4444",
  },
  amountIncome: {
    color: "#22C55E",
  },
});
