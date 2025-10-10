import { useContext, useEffect, useState, useCallback } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../../../utils/authContext";
import { Budget, Category, Transaction } from "../../../types";
import {
  createBudget,
  createCategory,
  getCategoriesByBudget,
  getCurrentBudget,
  getTransactionsByBudget,
} from "../../../api";
import TransactionItem from "../../../components/TransactionItem";
import CreateBudgetModal from "../../../components/CreateBudgetModal";

export default function Home() {
  const authContext = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadData();
    setisLoading(false);
  }, [authContext.jwtToken]);

  const loadData = async () => {
    if (authContext.jwtToken) {
      try {
        const budget = await getCurrentBudget(authContext.jwtToken);
        setBudget(budget);

        const categories = await getCategoriesByBudget(
          authContext.jwtToken,
          budget.id
        );
        setCategories(categories);

        let transactions = await getTransactionsByBudget(
          authContext.jwtToken,
          budget.id,
          3
        );

        setTransactions(transactions);
      } catch (error) {
        console.error("Error fetching budget:", error);
      }
    }
  };

  // Refaire l'appel API quand on revient sur cet écran
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [authContext.jwtToken])
  );

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
    setModalVisible(true);
  };

  const handleCreateCategory = async () => {
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
          <CreateBudgetModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            selectedDate={{
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            }}
            setBudget={setBudget}
          />
        </>
      ) : (
        <>
          {/* Total Balance */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>${budget.totalBalance}</Text>
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
            renderItem={({ item }) => <TransactionItem transaction={item} />}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
});
