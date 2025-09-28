import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Button,
} from "react-native";
import { Budget, BudgetCategory } from "../../../types";
import { createBudget, getBudgetByDate, getCurrentBudget } from "../../../api";
import { AuthContext } from "../../../utils/authContext";
import CategoryItem from "../../../components/CategoryItem";

export default function Tab() {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [budget, setBudget] = useState<BudgetCategory | null>(null);

  useEffect(() => {
    loadData(selectedDate.month, selectedDate.year);
  }, []);

  const loadData = async (month: number, year: number) => {
    if (authContext.jwtToken) {
      try {
        setLoading(true);
        const budget = await getBudgetByDate(authContext.jwtToken, month, year);
        setBudget(budget);
      } catch (error) {
        console.error("Error fetching budget:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handlePreviousMonth = () => {
    let newMonth = selectedDate.month - 1;
    let newYear = selectedDate.year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setSelectedDate({ month: newMonth, year: newYear });
    loadData(newMonth, newYear);
  };

  const handleNextMonth = () => {
    let newMonth = selectedDate.month + 1;
    let newYear = selectedDate.year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setSelectedDate({ month: newMonth, year: newYear });
    loadData(newMonth, newYear);
  };

  const handleCreateBudget = async () => {
    if (authContext.jwtToken) {
      try {
        const budget = await createBudget(authContext.jwtToken, {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          stableIncome: 1500,
        });

        const budgetCategory: BudgetCategory = {
          ...budget,
          categories: budget.categories.map((cat: any) => ({
            ...cat,
            totalExpenses: cat.totalExpenses ?? 0,
          })),
        };

        setBudget(budgetCategory);
      } catch (error) {
        console.error("Error creating budget:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable style={styles.button} onPress={handlePreviousMonth}>
          <Text>{"<"}</Text>
        </Pressable>
        <Text style={{ fontSize: 16, marginHorizontal: 16 }}>
          {selectedDate.month}/{selectedDate.year}
        </Text>
        <Pressable style={styles.button} onPress={handleNextMonth}>
          <Text>{">"}</Text>
        </Pressable>
      </View>
      {!budget && (
        <>
          <Text style={{ marginTop: 20 }}>
            No budget data available for this month.
          </Text>
          <Button title="Create this Budget" onPress={handleCreateBudget} />
        </>
      )}
      {budget && budget.categories.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No categories found for this budget. Please add categories.
        </Text>
      )}
      {budget && budget.categories.length > 0 && (
        <FlatList
          data={budget.categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CategoryItem category={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
  },
  button: {
    padding: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
});
