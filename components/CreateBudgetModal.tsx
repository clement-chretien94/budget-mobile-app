import { useContext, useState } from "react";
import { View, Text, Modal, StyleSheet, Button, TextInput } from "react-native";
import { createBudget } from "../api";
import { Budget, BudgetCategory } from "../types";
import { AuthContext } from "../utils/authContext";

interface CreateBudgetModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedDate: { month: number; year: number };
  setBudget: (budget: any) => void;
}

export default function CreateBudgetModal({
  modalVisible,
  setModalVisible,
  selectedDate,
  setBudget,
}: CreateBudgetModalProps) {
  const authContext = useContext(AuthContext);
  const [budgetAmount, setBudgetAmount] = useState(1000);

  const handleCreateBudget = async () => {
    if (authContext.jwtToken) {
      console.log("Creating budget with amount:", budgetAmount);
      try {
        const budget = await createBudget(authContext.jwtToken, {
          month: selectedDate.month,
          year: selectedDate.year,
          stableIncome: budgetAmount,
        });

        const budgetCategory: BudgetCategory = {
          ...budget,
          categories: budget.categories
            ? budget.categories.map((cat: any) => ({
                ...cat,
                totalExpenses: cat.totalExpenses ?? 0,
              }))
            : [],
        };

        setBudget(budgetCategory);
      } catch (error) {
        console.error("Error creating budget:", error);
      }
    }
    setModalVisible(false);
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>
            Create a Budget for {selectedDate.month}/{selectedDate.year}
          </Text>
          <Text style={styles.label}>Enter your budget amount:</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>$</Text>
            <TextInput
              placeholder="Enter budget amount"
              keyboardType="numeric"
              value={budgetAmount.toString()}
              onChangeText={(text) => setBudgetAmount(Number(text))}
            />
          </View>
          <Button
            title="Create Budget"
            onPress={handleCreateBudget}
            color="#007AFF"
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
});
