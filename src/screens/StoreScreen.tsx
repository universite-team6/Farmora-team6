import React from "react";
import { View, Text, StyleSheet } from "react-native";

const StoreScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Store</Text>
            <Text>Mağaza ekranı – rozetler, tema vb. burada olacak</Text>
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

export default StoreScreen;
