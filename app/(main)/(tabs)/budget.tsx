import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { Budget, BudgetCategory } from "../../../types";
import { getBudgetByDate, getCurrentBudget } from "../../../api";
import { AuthContext } from "../../../utils/authContext";
import CategoryItem from "../../../components/CategoryItem";

export default function Tab() {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [budget, setBudget] = useState<BudgetCategory | null>(null);

  useEffect(() => {
    loadData(selectedMonth.month, selectedMonth.year);
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

  if (loading || !budget) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable style={styles.button}>
          <Text>{"<"}</Text>
        </Pressable>
        <Text style={{ fontSize: 16, marginHorizontal: 16 }}>
          {budget.month}/{budget.year}
        </Text>
        <Pressable style={styles.button}>
          <Text>{">"}</Text>
        </Pressable>
      </View>
      <FlatList
        data={budget.categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CategoryItem category={item} />}
      />
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
