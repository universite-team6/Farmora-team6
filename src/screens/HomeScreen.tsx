import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import { auth, firestore } from "../config/firebase";


const HomeScreen = () => {
  const [minutes, setMinutes] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gold, setGold] = useState(0);

  const uid = auth().currentUser?.uid;

  // ALTIN TAKİBİ
  useEffect(() => {
    if (!uid) return;

    const userRef = firestore().collection("users").doc(uid);

    const unsub = userRef.onSnapshot((doc) => {
      const data = doc.data();
      setGold(data?.gold || 0);
    });

    return () => unsub();
  }, [uid]);

  // GERİ SAYIM
  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft === 0) {
      finishTimer(true);
      return;
    }

    const t = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [secondsLeft, isRunning]);

  const startTimer = () => {
    if (minutes === 0) return Alert.alert("Süre 0 olamaz!");
    setSecondsLeft(minutes * 60);
    setIsRunning(true);
  };

  const stopEarly = () => finishTimer(false);

  const finishTimer = async (completed: boolean) => {
    setIsRunning(false);

    if (!uid) return;
    try {
      await firestore()
        .collection("users")
        .doc(uid)
        .collection("sessions")
        .add({
          minutes,
          completed,
          timestamp: new Date(),
        });

      if (completed) {
        const earnedGold = minutes * 2;

        await firestore()
          .collection("users")
          .doc(uid)
          .set(
            {
              gold: firestore.FieldValue.increment(earnedGold),
              totalMinutes: firestore.FieldValue.increment(minutes),
            },
            { merge: true }
          );

        Alert.alert(
          "Tebrikler!",
          `${minutes} dk çalıştın! +${earnedGold} altın 🥳`
        );
      }
    } catch (e) {
      Alert.alert("Hata", "Kayıt yapılamadı.");
    }
  };

  const increase = () => {
    if (minutes + 30 <= 180) setMinutes(minutes + 30);
  };

  const decrease = () => {
    if (minutes - 30 >= 0) setMinutes(minutes - 30);
  };

  const formatSeconds = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${h}.${m.toString().padStart(2, "0")}.${s
      .toString()
      .padStart(2, "0")}`;
  };

  const formatPlannedTime = (m: number) => formatSeconds(m * 60);

  return (

    <View style={styles.container}>
      {/* ALTIN */}
      <View style={styles.goldContainer}>
        <Text style={styles.goldText}>💰 {gold}</Text>
      </View>

      {/* ADA ÇEMBERİ - sadece ÇEMBER İÇİNDE background image */}
      <View style={styles.imageCircle}>
        <ImageBackground
          source={require("../assets/arkaplan.jpg")}
          style={styles.circleBg}
          imageStyle={styles.circleBgImage}
        >
          <Image
            source={require("../assets/island1.png")}
            style={styles.islandImage}
            resizeMode="contain"
          />
        </ImageBackground>
      </View>

      <Text style={styles.title}>Odaklanma Sayacı</Text>

      {!isRunning ? (
        <View style={styles.row}>
          <TouchableOpacity onPress={decrease}>
            <Text style={styles.arrow}>v</Text>
          </TouchableOpacity>

          <Text style={styles.timerText}>{formatPlannedTime(minutes)}</Text>

          <TouchableOpacity onPress={increase}>
            <Text style={styles.arrow}>^</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.timerText}>{formatSeconds(secondsLeft)}</Text>

          <TouchableOpacity style={styles.stopBtn} onPress={stopEarly}>
            <Text style={styles.stopText}>SONLANDIR</Text>
          </TouchableOpacity>
        </>
      )}

      {!isRunning && (
        <TouchableOpacity style={styles.startBtn} onPress={startTimer}>
          <Text style={styles.startText}>BAŞLAT</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  // Ana ekran arka planı yine sarı 💛
  container: {
    flex: 1,
    backgroundColor: "#fff6c9",
    alignItems: "center",
    paddingTop: 40,
  },

  goldContainer: {
    position: "absolute",
    top: 40,
    right: 25,
    backgroundColor: "#ffe48a",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
  },

  goldText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  imageCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 4,
    borderColor: "#b98c3a",
    backgroundColor: "#fff6c9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // 🔥 her şey daire içinde kalsın
    marginTop: 130, // sayfanın ortasına doğru
    marginBottom: 10,
  },

  // Çember içindeki background (arkaplan.jpg)
  circleBg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  circleBgImage: {
    borderRadius: 130, // image kenarları da yuvarlak olsun
  },

  islandImage: {
    width: 200,
    height: 200,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#7c5b35",
  },


  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  arrow: {
    fontSize: 70,
    color: "#7c5b35",
    textAlign: "center",
    fontWeight: "bold",
    width: 90,  // 60 bazı oklar için yetersiz
  },


  timerText: {
    fontSize: 40,
    fontWeight: "700",
    minWidth: 160,
    textAlign: "center",
    color: "#7c5b35",
  },

  startBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#f2b45a",
    borderRadius: 999,
  },

  startText: {
    color: "#5b3a1a",
    fontSize: 20,
    fontWeight: "700",
  },

  stopBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#d9534f",
    borderRadius: 999,
  },

  stopText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
