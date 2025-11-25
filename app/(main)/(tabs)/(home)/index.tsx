import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { AuthContext } from "../../../../utils/authContext";
import {
  Budget,
  BudgetCategory,
  Category,
  Transaction,
} from "../../../../types";
import {
  createBudget,
  getCategoriesByBudget,
  getCurrentBudget,
  getTransactionsByBudget,
} from "../../../../api";
import TransactionItem from "../../../../components/TransactionItem";
import CategoryItem from "../../../../components/CategoryItem";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadData = async ({
    showLoader = false,
  }: { showLoader?: boolean } = {}) => {
    if (!authContext.jwtToken) {
      setBudget(null);
      setCategories([]);
      setTransactions([]);
      if (showLoader) {
        setIsLoading(false);
      }
      return;
    }

    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const currentBudget = await getCurrentBudget(authContext.jwtToken);
      setBudget(currentBudget);

      const [fetchedCategories, fetchedTransactions] = await Promise.all([
        getCategoriesByBudget(authContext.jwtToken, currentBudget.id),
        getTransactionsByBudget(authContext.jwtToken, currentBudget.id, 3),
      ]);

      setCategories(fetchedCategories);
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching budget:", error);
      setBudget(null);
      setCategories([]);
      setTransactions([]);
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData({ showLoader: true });
  }, [authContext.jwtToken]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [authContext.jwtToken])
  );

  const handleCreateBudget = async () => {
    if (authContext.jwtToken) {
      try {
        const budget = await createBudget(authContext.jwtToken, {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        });

        setBudget(budget);
        loadData({ showLoader: true });
      } catch (error) {
        console.error("Error creating budget:", error);
      }
    }
  };

  const handleAddTransaction = () => {
    router.push("/add_transaction");
  };

  const greetingName = useMemo(() => {
    const rawName = authContext.user?.fullName ?? "";
    const first = rawName.trim().split(/\s+/)[0];
    return first || "there";
  }, [authContext.user?.fullName]);

  const formatCurrency = (value: number) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    try {
      return `$${new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(safeValue)}`;
    } catch (error) {
      return `$${Math.round(safeValue)}`;
    }
  };

  const categoriesForPreview = useMemo<BudgetCategory["categories"]>(() => {
    return categories.map((category) => {
      const expensesFromCategory = Array.isArray(category.transactions)
        ? category.transactions.reduce((acc, transaction) => {
            if (transaction.type === "expense") {
              return acc + Number(transaction.amount);
            }
            return acc;
          }, 0)
        : undefined;

      const expensesFromRecent = transactions.reduce((acc, transaction) => {
        if (
          transaction.categoryId === category.id &&
          transaction.type === "expense"
        ) {
          return acc + Number(transaction.amount);
        }
        return acc;
      }, 0);

      return {
        id: category.id,
        name: category.name,
        emoji: category.emoji,
        limitAmount: Number(category.limitAmount) || 0,
        totalExpenses: expensesFromCategory
          ? expensesFromCategory
          : expensesFromRecent,
      };
    });
  }, [categories, transactions]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4f46e5" />
          <Text style={styles.loadingText}>Loading your budget...</Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.greetings}>Hello, {greetingName} 👋</Text>
          </View>
          {budget ? (
            <>
              <View style={styles.heroCard}>
                <Text style={styles.heroLabel}>Remaining Balance</Text>
                <Text style={styles.heroTotal}>
                  {formatCurrency(budget.totalBalance)}
                </Text>
              </View>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Budget categories</Text>
                  <Link href="/categories" style={styles.sectionAction}>
                    View all
                  </Link>
                </View>

                {categoriesForPreview.length ? (
                  <View>
                    {categoriesForPreview.slice(0, 3).map((category) => (
                      <View
                        key={category.id}
                        style={styles.categoryItemWrapper}
                      >
                        <CategoryItem category={category} />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.sectionEmpty}>
                    <Text style={styles.sectionEmptyTitle}>
                      No categories yet
                    </Text>
                    <Text style={styles.sectionEmptySubtitle}>
                      Add categories to organize your spending.
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent transactions</Text>
                  <Link href="/transactions" style={styles.sectionAction}>
                    View all
                  </Link>
                </View>

                {transactions.length ? (
                  <View>
                    {transactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))}
                  </View>
                ) : (
                  <View style={styles.sectionEmpty}>
                    <Text style={styles.sectionEmptyTitle}>
                      No transactions
                    </Text>
                    <Text style={styles.sectionEmptySubtitle}>
                      Add your first expense or income to see it here.
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyTitle}>No budget yet</Text>
              <Text style={styles.emptySubtitle}>
                Create your budget for this month to start tracking your
                spending and earnings.
              </Text>
              <Pressable
                onPress={handleCreateBudget}
                style={({ pressed }) => [
                  styles.primaryAction,
                  pressed && styles.primaryActionPressed,
                ]}
              >
                <Text style={styles.primaryActionText}>Create a budget</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}

      <Pressable style={styles.fab} onPress={handleAddTransaction}>
        <Text style={styles.fabSymbol}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F8",
    paddingTop: 36,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 8,
  },
  greetings: {
    fontSize: 26,
    fontWeight: "700",
    color: "#141118",
  },
  heroCard: {
    backgroundColor: "#4f46e5",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#4f46e5",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    marginBottom: 16,
  },
  heroLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  heroTotal: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginTop: 6,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#141118",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    marginHorizontal: -6,
  },
  summaryPill: {
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 6,
    marginBottom: 12,
    flexGrow: 1,
    minWidth: 110,
  },
  summaryPillLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  summaryPillValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#141118",
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4f46e5",
  },
  categoryItemWrapper: {
    marginBottom: 14,
  },
  transactionItemWrapper: {
    marginBottom: 14,
  },
  sectionEmpty: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#141118",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  sectionEmptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#141118",
  },
  sectionEmptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  emptyStateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#141118",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#141118",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 12,
  },
  primaryAction: {
    backgroundColor: "#4f46e5",
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  primaryActionPressed: {
    opacity: 0.85,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    color: "#6B7280",
    fontSize: 15,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  fabSymbol: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
  },
});
