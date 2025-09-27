import { View, Text, StyleSheet, FlatList } from "react-native";
import TransactionItem from "../../../components/TransactionItem";
import { useContext, useEffect, useState } from "react";
import { Transaction } from "../../../types";
import { AuthContext } from "../../../utils/authContext";
import { getTransactions } from "../../../api";

export default function Transactions() {
  const authContext = useContext(AuthContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (authContext.jwtToken) {
      try {
        console.log("Fetching transactions...");
        let transactions = await getTransactions(authContext.jwtToken);
        setTransactions(transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 16,
  },
});
