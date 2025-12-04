import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const StatsScreen = () => {
    const uid = auth().currentUser?.uid;

    // UID yoksa yükleniyor göster
    if (!uid) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Yükleniyor...</Text>
            </View>
        );
    }

    const [sessions, setSessions] = useState<any[]>([]);
    const [totalMinutes, setTotalMinutes] = useState(0);

    useEffect(() => {
        // --- Kullanıcı verileri (totalMinutes)
        const unsubUser = firestore()
            .collection("users")
            .doc(uid)
            .onSnapshot((doc) => {
                if (!doc.exists) {
                    setTotalMinutes(0);
                    return;
                }
                const data = doc.data();
                setTotalMinutes(data?.totalMinutes ?? 0);
            });

        // --- Oturum geçmişi
        const unsubSessions = firestore()
            .collection("users")
            .doc(uid)
            .collection("sessions")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                if (!snapshot) {
                    setSessions([]);
                    return;
                }

                const arr: any[] = [];
                snapshot.forEach((doc) => arr.push(doc.data()));
                setSessions(arr);
            });

        return () => {
            unsubUser();
            unsubSessions();
        };
    }, [uid]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>İstatistikler</Text>

            {/* GENEL DURUM */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Genel Durum</Text>
                <Text style={styles.item}>Toplam Çalışma: {totalMinutes} dakika</Text>
                <Text style={styles.item}>Toplam Oturum Sayısı: {sessions.length}</Text>
            </View>

            {/* GEÇMİŞ OTURUMLAR */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Geçmiş Oturumlar</Text>

                {sessions.length === 0 ? (
                    <Text style={styles.item}>Henüz çalışma kaydı yok.</Text>
                ) : (
                    sessions.map((s, index) => (
                        <Text key={index} style={styles.item}>
                            • {s.minutes} dk —{" "}
                            {s.timestamp?.toDate().toLocaleString()}
                        </Text>
                    ))
                )}
            </View>

            {/* ÖZET */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Özet</Text>
                <Text style={styles.item}>
                    Bugüne kadar toplam {totalMinutes} dakika çalıştın! 🔥
                </Text>
                <Text style={styles.item}>
                    Düzenli çalışmaya devam ederek adanı büyütüyorsun 🌱
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "#555",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff6c9",
    },
    content: {
        padding: 16,
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    item: {
        fontSize: 14,
        marginBottom: 4,
    },
});

export default StatsScreen;
