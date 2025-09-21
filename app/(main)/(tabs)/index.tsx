import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { AuthContext } from "../../../utils/authContext";
import { Budget, Category, Transaction } from "../../../types";
import {
  createBudget,
  createCategory,
  getCategories,
  getCurrentBudget,
  getTransactions,
} from "../../../api";
import TransactionModal from "../../../components/transactionModal";

// Only for demo purposes, in the real app you would fetch this data from the API
const transactions: Transaction[] = [];
// const transactions: Transaction[] = [
//   {
//     id: 1,
//     amount: 50,
//     type: "expense",
//     description: "Groceries",
//     date: "2023-10-01T00:00:00Z",
//     categoryId: 1,
//     createdAt: "2023-10-01T00:00:00Z",
//     updatedAt: "2023-10-01T00:00:00Z",
//   },
//   {
//     id: 2,
//     amount: 100,
//     type: "expense",
//     description: "Electricity Bill",
//     date: "2023-10-01T00:00:00Z",
//     categoryId: 3,
//     createdAt: "2023-10-01T00:00:00Z",
//     updatedAt: "2023-10-01T00:00:00Z",
//   },
//   {
//     id: 3,
//     amount: 30,
//     type: "expense",
//     description: "Dinner out",
//     date: "2023-10-02T00:00:00Z",
//     categoryId: 1,
//     createdAt: "2023-10-01T00:00:00Z",
//     updatedAt: "2023-10-01T00:00:00Z",
//   },
// ];

export default function Home() {
  const authContext = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);

  useEffect(() => {
    const getBudget = async () => {
      if (authContext.jwtToken) {
        try {
          const budget = await getCurrentBudget(authContext.jwtToken);
          setBudget(budget);

          const categories = await getCategories(
            authContext.jwtToken,
            budget.id
          );
          setCategories(categories);

          const transactions = await getTransactions(
            authContext.jwtToken,
            budget.id
          );
          setTransactions(transactions);
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

  const getTotalCategory = (categoryId: number) => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.categoryId === categoryId) {
        if (transaction.type === "expense") {
          return acc + transaction.amount;
        }
      }
      return acc;
    }, 0);
  };

  const handleCreateBudget = async () => {
    console.log("Create Budget button pressed");
    if (authContext.jwtToken) {
      try {
        const budget = await createBudget(authContext.jwtToken, {
          stableIncome: 1500,
        });
        setBudget(budget);
      } catch (error) {
        console.error("Error creating budget:", error);
      }
    }
  };

  const handleCreateCategory = async () => {
    console.log("Create Category button pressed");
    if (authContext.jwtToken) {
      try {
        const category = await createCategory(authContext.jwtToken, {
          name: "New Category",
          emoji: "🆕",
          color: "#FF69B4",
          limitAmount: 100,
          budgetId: budget?.id || 0, // Use the current budget ID
        });
        setCategories([...categories, category]);
      } catch (error) {
        console.error("Error creating budget:", error);
      }
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>My Budget</Text>

      {!budget ? (
        <>
          <Text style={styles.sectionTitle}>
            No budget found for this month. Please create a budget.
          </Text>
          <Button title="Create Budget" onPress={handleCreateBudget} />
        </>
      ) : (
        <>
          {/* Total Balance */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>${getTotalBalance()}</Text>
          </View>

          {/* Budget Categories */}
          <Text style={styles.sectionTitle}>Budget Categories</Text>
          <FlatList
            data={categories}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item: category }) => (
              <View
                style={[
                  styles.categoryCard,
                  { backgroundColor: category.color },
                ]}
              >
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryAmount}>
                  {getTotalCategory(category.id)}/
                  {"limitAmount" in category ? category.limitAmount || 0 : 0}
                </Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          />

          {/* Recent Transactions */}
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.transactionItem}>
                <Text style={styles.transactionDescription}>{item.name}</Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: item.type === "income" ? "green" : "red" },
                  ]}
                >{`${item.type === "expense" ? "-" : ""}$${item.amount}`}</Text>
              </View>
            )}
          />
        </>
      )}

      {/* Add Transaction Button */}
      <Button
        title="Add Transaction"
        onPress={() => setTransactionModalOpen(true)}
      />

      <TransactionModal
        budgetId={budget?.id || 0}
        saveTransaction={(newTransaction) =>
          setTransactions([...transactions, newTransaction])
        }
        isOpen={isTransactionModalOpen}
        closeModal={() => setTransactionModalOpen(false)}
      />
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
  },
  categoryCard: {
    width: 160,
    height: 120,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryName: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  categoryAmount: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  addCategoryText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
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
