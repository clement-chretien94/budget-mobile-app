import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import CustomHeader from "../../../components/CustomHeader";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "blue",
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          header: () => <CustomHeader title="Transactions" />,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="receipt-long" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          header: () => <CustomHeader title="Categories" />,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="pie-chart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
