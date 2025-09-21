import { useContext, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { createTransaction, getCategories } from "../api";
import {
  Category,
  Transaction,
  TransactionCreate,
  TransactionType,
} from "../types";
import { AuthContext } from "../utils/authContext";

type TransactionModalProps = {
  budgetId: number;
  saveTransaction: (transaction: Transaction) => void;
  isOpen: boolean;
  closeModal: () => void;
};

export default function TransactionModal({
  budgetId,
  isOpen,
  closeModal,
}: TransactionModalProps) {
  const authContext = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<TransactionType>("expense");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [date, setDate] = useState(new Date(Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [error, setError] = useState("");

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
      const transaction = await createTransaction(
        authContext.jwtToken,
        budgetId,
        transactionData
      );
    } catch (error) {
      console.error("Error creating transaction:", error);
      setError("Failed to create transaction");
      return;
    }

    closeModal();
  };

  useEffect(() => {
    console.log("TransactionModal useEffect called");
    loadCategories();
  }, [budgetId, authContext.jwtToken]);

  const loadCategories = async () => {
    if (authContext.jwtToken) {
      const categories = await getCategories(authContext.jwtToken, budgetId);
      setCategories(categories);
      if (categories.length > 0) {
        setSelectedCategory(categories[0].id);
      }
    }
    setisLoading(false);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>New transaction</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.modalBody}>
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
          <Button title="Save" onPress={handleSave} />
          {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  headerSpacer: {
    width: 60, // Approximativement la même largeur que le bouton Cancel
  },
  modalBody: {
    padding: 16,
    justifyContent: "center",
  },
  cancelButton: {
    color: "#007AFF",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonContainer: {
    backgroundColor: "#007AFF",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
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
