import { Stack } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          header: () => <CustomHeader title="Profile" />,
        }}
      />
      <Stack.Screen
        name="create-category"
        options={{
          title: "Create Category",
          header: (props) => (
            <CustomHeader {...props} title="Create Category" />
          ),
        }}
      />
    </Stack>
  );
}
