import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
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

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [limitAmount, setLimitAmount] = useState(0);

  useEffect(() => {
    // Load categories initially and whenever modal is opened
    if (modalVisible) {
      loadCategories();
    }
  }, [authContext.jwtToken, modalVisible]);

  const loadCategories = async () => {
    setIsLoading(true);
    if (authContext.jwtToken) {
      const categories = await getCategories(authContext.jwtToken);
      setCategories(categories);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].id);
      }
    }
    setIsLoading(false);
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

  const resolvedCategoryValue =
    selectedCategory ?? (categories.length ? categories[0].id : "");

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Add category</Text>
          <Text style={styles.subtitle}>
            Attach a category to the {budget.month}/{budget.year} budget and set
            its spending limit.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Category</Text>
            {isLoading ? (
              <View style={styles.inlineLoader}>
                <ActivityIndicator color="#4F46E5" />
                <Text style={styles.loaderText}>Loading categories...</Text>
              </View>
            ) : (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={resolvedCategoryValue}
                  onValueChange={(itemValue) =>
                    setSelectedCategory(
                      typeof itemValue === "number"
                        ? itemValue
                        : Number(itemValue)
                    )
                  }
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
              </View>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Limit amount</Text>
            <View style={styles.inputRow}>
              <Text style={styles.currencyPrefix}>$</Text>
              <TextInput
                style={styles.inputControl}
                placeholder="0"
                keyboardType="numeric"
                value={limitAmount.toString()}
                onChangeText={(text) => setLimitAmount(Number(text))}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <Pressable
            onPress={handleAddCategory}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed ? styles.primaryButtonPressed : null,
            ]}
          >
            <Text style={styles.primaryButtonLabel}>Add Category</Text>
          </Pressable>
          <Pressable
            onPress={() => setModalVisible(false)}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonLabel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 420,
    shadowColor: "#141118",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#141118",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4F46E5",
    marginRight: 6,
  },
  inputControl: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: "#111827",
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    marginTop: 4,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 12,
  },
  secondaryButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  inlineLoader: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F9FAFB",
  },
  loaderText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#6B7280",
  },
});
