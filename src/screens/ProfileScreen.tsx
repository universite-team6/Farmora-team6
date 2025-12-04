import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text>Profil / istatistik ekranı</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 8,
    },
});

export default ProfileScreen;

