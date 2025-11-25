import { View, Text, StyleSheet } from "react-native";

import { BudgetCategory } from "../types";

const PRIMARY = "#4f46e5";
const PRIMARY_TRACK = "#D9D8FB";
const SUCCESS = "#22C55E";
const SUCCESS_TRACK = "#D1FAE5";
const DANGER = "#EF4444";
const DANGER_TRACK = "#FEE2E2";

const formatAmount = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(safeValue);
  } catch (error) {
    return Math.round(safeValue).toString();
  }
};

export default function CategoryItem({
  category,
}: {
  category: BudgetCategory["categories"][0];
}) {
  const ratio = category.limitAmount
    ? category.totalExpenses / category.limitAmount
    : 0;

  const clampedRatio = Math.max(0, Math.min(ratio, 1));
  const totalFormatted = formatAmount(category.totalExpenses);
  const limitFormatted = formatAmount(category.limitAmount);

  const { barColor, trackColor } = (() => {
    if (ratio >= 1) {
      return { barColor: DANGER, trackColor: DANGER_TRACK };
    }
    if (ratio >= 0.75) {
      return { barColor: SUCCESS, trackColor: SUCCESS_TRACK };
    }
    return { barColor: PRIMARY, trackColor: PRIMARY_TRACK };
  })();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{category.name}</Text>
        <Text
          style={styles.amount}
        >{`$${totalFormatted} / $${limitFormatted}`}</Text>
      </View>
      <View style={[styles.progressTrack, { backgroundColor: trackColor }]}>
        <View
          style={[
            styles.progressFill,
            { width: `${clampedRatio * 100}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  amount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  progressTrack: {
    height: 8,
    marginTop: 16,
    borderRadius: 9999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 9999,
  },
});
