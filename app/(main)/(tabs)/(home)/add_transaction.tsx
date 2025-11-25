import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../../../../utils/authContext";
import {
  Category,
  TransactionCreate,
  TransactionType,
} from "../../../../types";
import { createTransaction, getCategories } from "../../../../api";

const TRANSACTION_TYPES: {
  label: string;
  value: "expense" | "income";
}[] = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];

export default function AddTransaction() {
  const authContext = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isCreated, setIsCreated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<TransactionType>("expense");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [date, setDate] = useState(new Date(Date.now()));

  const handleSave = async () => {
    if (isSubmitting || isCreated) {
      return;
    }

    if (!authContext.jwtToken) {
      console.error("JWT token is missing");
      return;
    }
    if (!name || !amount || (type === "expense" && !selectedCategory)) {
      setError("Please fill all required fields");
      return;
    }

    const transactionData: TransactionCreate = {
      name,
      type,
      amount: parseFloat(amount),
      date,
      categoryId: type === "expense" ? selectedCategory! : undefined,
    };

    try {
      setIsSubmitting(true);
      await createTransaction(authContext.jwtToken, transactionData);
      setIsCreated(true);
      setName("");
      setAmount("");
      setError("");
      setTimeout(() => {
        setIsCreated(false);
      }, 1400);
    } catch (error) {
      console.error("Error creating transaction:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred");
      }
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [authContext.jwtToken]);

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

  // Reload categories whenever this screen regains focus
  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [authContext.jwtToken])
  );

  const resolvedCategoryValue =
    selectedCategory ?? (categories.length ? categories[0].id : "");

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.card}>
        <View style={styles.filterWrapper}>
          <View style={styles.filterContainer}>
            {TRANSACTION_TYPES.map((option) => {
              const isActive = option.value === type;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setType(option.value as TransactionType)}
                  style={[
                    styles.filterButton,
                    isActive && styles.filterButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterLabel,
                      isActive && styles.filterLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Transaction name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#9CA3AF"
            returnKeyType="next"
          />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Amount</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currencyPrefix}>$</Text>
            <TextInput
              style={styles.inputControl}
              placeholder="0.00"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
        {type === "expense" && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Category</Text>
            {isLoading ? (
              <View style={styles.inlineLoader}>
                <ActivityIndicator size="small" color="#4f46e5" />
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
        )}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.dateInput}
            activeOpacity={0.85}
          >
            <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={[styles.feedback, styles.errorFeedback]}>
          <Text style={styles.feedbackText}>{error}</Text>
        </View>
      ) : null}

      {isCreated ? (
        <View style={[styles.feedback, styles.successFeedback]}>
          <Text style={styles.feedbackText}>
            Transaction successfully created
          </Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleSave}
        disabled={isSubmitting || isCreated}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && !isSubmitting && !isCreated
            ? styles.primaryButtonPressed
            : null,
          (isSubmitting || isCreated) && styles.primaryButtonDisabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonLabel}>
            {isCreated ? "Saved!" : "Save transaction"}
          </Text>
        )}
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setShowDatePicker(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F6F6F8",
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 48,
  },
  filterWrapper: {
    paddingHorizontal: 0,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 999,
  },
  filterButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#141118",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterLabelActive: {
    color: "#4F46E5",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#141118",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginRight: 6,
  },
  inputControl: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    color: "#111827",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "#F9FAFB",
  },
  dateText: {
    fontSize: 15,
    color: "#111827",
  },
  feedback: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  errorFeedback: {
    backgroundColor: "#FEE2E2",
  },
  successFeedback: {
    backgroundColor: "#DCFCE7",
  },
  feedbackText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.05,
  },
  primaryButtonLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  inlineLoader: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
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
