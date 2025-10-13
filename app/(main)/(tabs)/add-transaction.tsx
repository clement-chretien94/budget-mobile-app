import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../../../utils/authContext";
import { Category, TransactionCreate, TransactionType } from "../../../types";
import { createTransaction, getCategories } from "../../../api";

export default function AddTransaction() {
  const authContext = useContext(AuthContext);

  const [isLoading, setisLoading] = useState(true);
  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<TransactionType>("expense");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [date, setDate] = useState(new Date(Date.now()));

  const handleSave = async () => {
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
      categoryId: selectedCategory || undefined,
    };

    try {
      await createTransaction(authContext.jwtToken, transactionData);
      setIsCreated(true);
      setTimeout(() => {
        setIsCreated(false);
      }, 1000);
      setError("");
    } catch (error) {
      console.error("Error creating transaction:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred");
      }
      return;
    }
  };

  useEffect(() => {
    loadCategories();
  }, [authContext.jwtToken]);

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

  // Reload categories whenever this screen regains focus
  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [authContext.jwtToken])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Transaction Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Transaction Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Text style={styles.label}>Transaction Type</Text>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue as TransactionType)}
      >
        <Picker.Item label="Expense" value="expense" />
        <Picker.Item label="Income" value="income" />
      </Picker>
      {type === "expense" && (
        <>
          <Text style={styles.label}>Transaction Category</Text>
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
        </>
      )}
      <Text style={styles.label}>Transaction Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.input}>{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
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
      <Button
        title={isCreated ? "Created" : "Save"}
        color={isCreated ? "green" : undefined}
        onPress={isCreated ? undefined : handleSave}
      />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    // marginBottom: 8,
    // color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
  },
});
