import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import { auth, firestore } from "../config/firebase";

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔵 Giriş Yap
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "E-posta ve şifre gerekli.");
      return;
    }

    setLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert("Başarılı", "Giriş yapıldı!");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Giriş Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Kayıt Ol
  const handleSignUp = async () => {
    if (!email || !password || !age) {
      Alert.alert("Eksik Bilgi", "E-posta, şifre ve yaş gerekli.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;

      await firestore().collection("users").doc(user.uid).set({
        email: user.email,
        age: parseInt(age),
        createdAt: firestore.FieldValue.serverTimestamp(),
        totalMinutes: 0,
      });

      Alert.alert("Başarılı", "Kayıt tamamlandı!");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Kayıt Hatası", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7c5b35" />
        <Text style={styles.loadingText}>İşlem yapılıyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giriş / Kayıt</Text>

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#b08b5c"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre (min 6 karakter)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#b08b5c"
      />

      <TextInput
        style={styles.input}
        placeholder="Yaş (sadece kayıt için)"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholderTextColor="#b08b5c"
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
          <Text style={styles.buttonPrimaryText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={handleSignUp}>
          <Text style={styles.buttonSecondaryText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff6c9", // HomeScreen'e benzer sıcak arka plan
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "800",
    color: "#7c5b35", // ana kahverengi
  },
  input: {
    height: 50,
    borderColor: "#d4b28a",
    borderWidth: 1.5,
    backgroundColor: "#fffaf0",
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  buttonsContainer: {
    marginTop: 10,
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: "#7c5b35",
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: "#fffaf0",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: "#f3e2c5",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7c5b35",
  },
  buttonSecondaryText: {
    color: "#7c5b35",
    fontWeight: "700",
    fontSize: 15,
  },
  loadingText: {
    marginTop: 10,
    color: "#7c5b35",
  },
});

export default AuthScreen;
