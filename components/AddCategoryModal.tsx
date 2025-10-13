import { useContext, useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, Button, TextInput } from "react-native";
import { addCategoryToBudget, getCategories } from "../api";
import { BudgetCategory, Category } from "../types";
import { AuthContext } from "../utils/authContext";
import { Picker } from "@react-native-picker/picker";

interface AddCategoryModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  budget: BudgetCategory;
  reloadBudget: () => void;
}

export default function AddCategoryModal({
  modalVisible,
  setModalVisible,
  budget,
  reloadBudget,
}: AddCategoryModalProps) {
  const authContext = useContext(AuthContext);

  const [isLoading, setisLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [limitAmount, setLimitAmount] = useState(250);

  useEffect(() => {
    // Load categories initially and whenever modal is opened
    if (modalVisible) {
      loadCategories();
    }
  }, [authContext.jwtToken, modalVisible]);

  const loadCategories = async () => {
    setisLoading(true);
    if (authContext.jwtToken) {
      const categories = await getCategories(authContext.jwtToken);
      setCategories(categories);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].id);
      }
    }
    setisLoading(false);
  };

  const handleAddCategory = async () => {
    if (authContext.jwtToken) {
      console.log(
        `Adding category ${selectedCategory} with limit: ${limitAmount}`
      );
      try {
        await addCategoryToBudget(authContext.jwtToken, {
          budgetId: budget.id,
          categoryId: selectedCategory ?? 1,
          limitAmount: limitAmount,
        });

        // Refresh budget data
        reloadBudget();
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
            Add a category for budget {budget.month}/{budget.year}
          </Text>
          <Text style={styles.label}>Select a category:</Text>
          {isLoading ? (
            <Text>Loading categories...</Text>
          ) : (
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              {categories.map((category) => (
                <Picker.Item
                  style={{ fontSize: 14 }}
                  key={category.id}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          )}
          <Text style={styles.label}>Enter your limit amount:</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>$</Text>
            <TextInput
              placeholder="Enter category limit amount"
              keyboardType="numeric"
              value={limitAmount.toString()}
              onChangeText={(text) => setLimitAmount(Number(text))}
            />
          </View>
          <Button
            title="Add Category"
            onPress={handleAddCategory}
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
