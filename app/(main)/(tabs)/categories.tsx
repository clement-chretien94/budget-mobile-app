import { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { BudgetCategory } from "../../../types";
import { createBudget, getBudgetByDate } from "../../../api";
import { AuthContext } from "../../../utils/authContext";
import CategoryItem from "../../../components/CategoryItem";
import AddCategoryModal from "../../../components/AddCategoryModal";

export default function Tab() {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [budget, setBudget] = useState<BudgetCategory | null>(null);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    loadData(selectedDate.month, selectedDate.year);
  }, []);

  const monthLabel = useMemo(() => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[selectedDate.month - 1]} ${selectedDate.year}`;
  }, [selectedDate.month, selectedDate.year]);

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
          month: selectedDate.month,
          year: selectedDate.year,
        });

        const budgetCategory: BudgetCategory = {
          ...budget,
          categories: [],
        };

        setBudget(budgetCategory);
      } catch (error) {
        console.error("Error creating budget:", error);
      }
    }
  };

  const handleAddCategory = () => {
    setCategoryModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthSelector}>
        <Pressable style={styles.monthButton} onPress={handlePreviousMonth}>
          <MaterialIcons name="chevron-left" size={24} color="#6B7280" />
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <Pressable style={styles.monthButton} onPress={handleNextMonth}>
          <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
        </Pressable>
      </View>
      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={styles.loadingText}>Loading categories…</Text>
          </View>
        )}

        {!loading && !budget && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Set up this month's budget</Text>
            <Text style={styles.emptySubtitle}>
              Create a budget to start tracking your spending categories.
            </Text>
            <Pressable
              style={styles.primaryAction}
              onPress={handleCreateBudget}
            >
              <Text style={styles.primaryActionText}>Create this budget</Text>
            </Pressable>
          </View>
        )}

        {!loading && budget && budget.categories.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No categories yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your first category to keep your spending organized.
            </Text>
            <Pressable style={styles.primaryAction} onPress={handleAddCategory}>
              <Text style={styles.primaryActionText}>Add Category</Text>
            </Pressable>
          </View>
        )}

        {!loading && budget && budget.categories.length > 0 && (
          <FlatList
            data={budget.categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CategoryItem category={item} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {budget && !loading && (
        <Pressable style={styles.fab} onPress={handleAddCategory}>
          <Text style={styles.fabSymbol}>+</Text>
        </Pressable>
      )}

      {budget && (
        <AddCategoryModal
          modalVisible={categoryModalVisible}
          setModalVisible={setCategoryModalVisible}
          budget={budget}
          reloadBudget={() => loadData(selectedDate.month, selectedDate.year)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F6F6F8",
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  monthButton: {
    height: 40,
    width: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#141118",
    marginHorizontal: 24,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#141118",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryAction: {
    backgroundColor: "#4f46e5",
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryActionText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 120,
    paddingTop: 4,
  },
  separator: {
    height: 16,
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
