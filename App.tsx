// App.tsx
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, ActivityIndicator } from "react-native";

import auth from "@react-native-firebase/auth";  // 🔥 DOĞRU AUTH

import AuthScreen from "./src/screens/AuthScreen";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false);
    });

    return unsubscribe; // cleanup
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <RootNavigator /> : <AuthScreen />}
    </NavigationContainer>
  );
}
