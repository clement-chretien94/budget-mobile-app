import { useContext, useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { AuthContext } from "../../utils/authContext";
import { Budget, Category, Transaction } from "../../types";
import { getCurrentBudget } from "../../api";

// Only for demo purposes, in the real app you would fetch this data from the API
const transactions: Transaction[] = [
  {
    id: 1,
    amount: 100,
    description: "Groceries",
    type: "expense",
    date: "2023-10-01",
    categoryId: 1,
    budgetId: 1,
    createdAt: "2023-10-01T00:00:00Z",
    updatedAt: "2023-10-01T00:00:00Z",
  },
  {
    id: 2,
    amount: 50,
    description: "Salary",
    type: "income",
    date: "2023-10-05",
    categoryId: 2,
    budgetId: 1,
    createdAt: "2023-10-05T00:00:00Z",
    updatedAt: "2023-10-05T00:00:00Z",
  },
  {
    id: 3,
    amount: 20,
    description: "Transport",
    type: "expense",
    date: "2023-10-10",
    categoryId: 1,
    budgetId: 1,
    createdAt: "2023-10-10T00:00:00Z",
    updatedAt: "2023-10-10T00:00:00Z",
  },
];

const categories: Category[] = [
  {
    id: 1,
    name: "Food",
    emoji: "🍔",
    color: "#FF6347",
    limitAmount: 500,
    userId: 1,
    createdAt: "2023-10-01T00:00:00Z",
    updatedAt: "2023-10-01T00:00:00Z",
    transactions: transactions.filter((t) => t.categoryId === 1),
  },
  {
    id: 2,
    name: "Salary",
    emoji: "💰",
    color: "#32CD32",
    limitAmount: 2000,
    userId: 1,
    createdAt: "2023-10-01T00:00:00Z",
    updatedAt: "2023-10-01T00:00:00Z",
    transactions: transactions.filter((t) => t.categoryId === 2),
  },
];

export default function Home() {
  const authContext = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [budget, setBudget] = useState<Budget | null>(null);

  useEffect(() => {
    const getBudget = async () => {
      if (authContext.jwtToken) {
        try {
          const budget = await getCurrentBudget(authContext.jwtToken);
          setBudget(budget);
        } catch (error) {
          console.error("Error fetching budget:", error);
        }
      }
    };
    getBudget();
    setisLoading(false);
  }, []);

  const getTotalBalance = () => {
    const totalIncome =
      (budget?.stableIncome || 0) +
      transactions.reduce((acc, transaction) => {
        if (transaction.type === "income") {
          return acc + transaction.amount;
        }
        return acc;
      }, 0);
    const totalExpense = transactions.reduce((acc, transaction) => {
      if (transaction.type === "expense") {
        return acc + transaction.amount;
      }
      return acc;
    }, 0);
    return totalIncome - totalExpense;
  };

  const getTotalTransaction = (transactions: Transaction[]) => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === "expense") {
        return acc + transaction.amount;
      } else if (transaction.type === "income") {
        return acc - transaction.amount;
      }
      return acc;
    }, 0);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>My Budget</Text>

      {/* Total Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>${getTotalBalance()}</Text>
      </View>

      {/* Budget Categories */}
      <Text style={styles.sectionTitle}>Budget Categories</Text>
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <View
            key={category.id}
            style={[styles.categoryCard, { backgroundColor: category.color }]}
          >
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryAmount}>
              {getTotalTransaction(category.transactions)}/
              {category.limitAmount || 0}
            </Text>
          </View>
        ))}
      </View>

      {/* Recent Transactions */}
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text style={styles.transactionDescription}>
              {item.description}
            </Text>
            <Text style={styles.transactionAmount}>${item.amount}</Text>
          </View>
        )}
      />

      <Button title="Log out!" onPress={authContext.logOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  balanceContainer: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 8,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  categoryName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryAmount: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionDescription: {
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
