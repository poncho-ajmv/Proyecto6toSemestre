import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const IA = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inteligencia Artificial</Text>
            <Text style={styles.description}>Explora las funcionalidades de IA en esta sección.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default IA;
