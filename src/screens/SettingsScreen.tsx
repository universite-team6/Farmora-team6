import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    Alert,
} from "react-native";

import auth from "@react-native-firebase/auth"; // 🔥 logout için doğru kullanım

const SettingsScreen = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            "Çıkış Yap",
            "Hesabınızdan çıkmak istediğinize emin misiniz?",
            [
                { text: "İptal", style: "cancel" },
                {
                    text: "Çıkış Yap",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await auth().signOut(); // 🔥 DOĞRU logout
                        } catch (e) {
                            console.error(e);
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ayarlar</Text>

            {/* Bildirimler */}
            <View style={styles.row}>
                <View>
                    <Text style={styles.rowTitle}>Bildirimler</Text>
                    <Text style={styles.rowSubtitle}>
                        Günlük hatırlatmalar ve görev bildirimleri
                    </Text>
                </View>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                />
            </View>

            {/* Tema */}
            <View style={styles.row}>
                <View>
                    <Text style={styles.rowTitle}>Karanlık Mod</Text>
                    <Text style={styles.rowSubtitle}>Karanlık tema görünümü</Text>
                </View>
                <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                />
            </View>

            {/* Dil */}
            <View style={styles.row}>
                <View>
                    <Text style={styles.rowTitle}>Dil</Text>
                    <Text style={styles.rowSubtitle}>Şimdilik: Türkçe</Text>
                </View>
            </View>

            {/* Çıkış Yap */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff6c9",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    row: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 1,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    rowSubtitle: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
        maxWidth: 220,
    },
    logoutButton: {
        marginTop: 24,
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#FF5252",
        alignItems: "center",
    },
    logoutText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default SettingsScreen;
