// task/SetGoals.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const SetGoals = ({ onSaveGoals }) => {
    const [task, setTask] = useState('');
    const [time, setTime] = useState('');
    const [goals, setGoals] = useState([]);

    const addGoal = () => {
        if (task && time) {
            setGoals((prevGoals) => [
                ...prevGoals,
                { id: Math.random().toString(), task, time, completed: false },
            ]);
            setTask('');
            setTime('');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Asignar nuevas metas</Text>

            <TextInput
                placeholder="Meta"
                style={styles.input}
                value={task}
                onChangeText={setTask}
            />

            <TextInput
                placeholder="Tiempo en minutos"
                style={styles.input}
                value={time}
                onChangeText={setTime}
                keyboardType="numeric"
            />

            <Button title="Agregar Meta" onPress={addGoal} />

            <FlatList
                data={goals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.goalItem}>
                        <Text>{item.task} - {item.time} mins</Text>
                    </View>
                )}
            />

            <Button
                title="Guardar Metas"
                onPress={() => onSaveGoals(goals)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    goalItem: {
        padding: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default SetGoals;
