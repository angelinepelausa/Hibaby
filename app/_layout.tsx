import { Stack } from "expo-router";
import './globals.css';

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
      name="index"
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="login"
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="register"
      options={{ headerShown: false }}
    />  

    <Stack.Screen
      name="(tabs)"
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="households/[id]"
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="housekeepers/[id]"
      options={{ headerShown: false }}
    />

    <Stack.Screen
        name="editprofile" 
        options={{ headerShown: false }}
      />
    </Stack>;
}
