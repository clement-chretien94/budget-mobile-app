import { View, Text, StyleSheet, SectionList, Pressable } from "react-native";
import TransactionItem from "../../../components/TransactionItem";
import { useContext, useEffect, useMemo, useState } from "react";
import { Transaction } from "../../../types";
import { AuthContext } from "../../../utils/authContext";
import { getTransactions } from "../../../api";

const FILTER_OPTIONS: {
  label: string;
  value: "all" | "expense" | "income";
}[] = [
  { label: "All", value: "all" },
  { label: "Expenses", value: "expense" },
  { label: "Incomes", value: "income" },
];

const formatSectionTitle = (date: Date) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  if (isSameDay(date, today)) {
    return "Today";
  }

  if (isSameDay(date, yesterday)) {
    return "Yesterday";
  }

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function Transactions() {
  const authContext = useContext(AuthContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "expense" | "income"
  >("all");

  const loadData = async () => {
    if (authContext.jwtToken) {
      try {
        const fetchedTransactions = await getTransactions(
          authContext.jwtToken,
          selectedFilter
        );
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedFilter]);

  const sections = useMemo(() => {
    if (!transactions.length) {
      return [];
    }

    const groups = new Map<
      string,
      { title: string; dateValue: number; data: Transaction[] }
    >();

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const dateKey = `${transactionDate.getFullYear()}-${transactionDate.getMonth()}-${transactionDate.getDate()}`;
      const normalizedDate = new Date(
        transactionDate.getFullYear(),
        transactionDate.getMonth(),
        transactionDate.getDate()
      ).getTime();

      if (!groups.has(dateKey)) {
        groups.set(dateKey, {
          title: formatSectionTitle(transactionDate),
          dateValue: normalizedDate,
          data: [],
        });
      }

      groups.get(dateKey)?.data.push(transaction);
    });

    return Array.from(groups.values())
      .sort((a, b) => b.dateValue - a.dateValue)
      .map((group) => ({
        title: group.title,
        data: group.data.sort(
          (first, second) =>
            new Date(second.date).getTime() - new Date(first.date).getTime()
        ),
      }));
  }, [transactions]);

  return (
    <View style={styles.container}>
      <View style={styles.filterWrapper}>
        <View style={styles.filterContainer}>
          {FILTER_OPTIONS.map((option) => {
            const isActive = option.value === selectedFilter;
            return (
              <Pressable
                key={option.value}
                onPress={() => setSelectedFilter(option.value)}
                style={[
                  styles.filterButton,
                  isActive && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterLabel,
                    isActive && styles.filterLabelActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeading}>{section.title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No transactions</Text>
            <Text style={styles.emptyStateSubtitle}>
              Add your first expense or income to see it here.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F8",
  },
  filterWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 999,
  },
  filterButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#141118",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterLabelActive: {
    color: "#4F46E5",
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#141118",
    marginBottom: 12,
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 64,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#141118",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 12,
    marginTop: 8,
  },
});
