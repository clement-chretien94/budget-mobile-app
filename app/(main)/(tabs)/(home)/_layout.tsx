import { Stack } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="add_transaction"
        options={{
          title: "Add Transaction",
          header: (props) => (
            <CustomHeader {...props} title="Add Transaction" />
          ),
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
