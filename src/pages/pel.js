import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';


const PetGoals = ({ petName }) => {
    const [goals, setGoals] = useState([
        { id: '1', task: 'Alimentar a la mascota', completed: false },
        { id: '2', task: 'Pasear 30 minutos', completed: false },
        { id: '3', task: 'Jugar 15 minutos', completed: false },
    ]);
    const [newGoal, setNewGoal] = useState('');
    const [period, setPeriod] = useState('Día');

    const toggleGoal = (id) => {
        setGoals((prevGoals) =>
            prevGoals.map((goal) =>
                goal.id === id ? { ...goal, completed: !goal.completed } : goal
            )
        );
    };

    const addGoal = () => {
        if (newGoal.trim()) {
            const newGoalItem = { id: (goals.length + 1).toString(), task: newGoal, completed: false };
            setGoals([...goals, newGoalItem]);
            setNewGoal('');
        }
    };

    const completedCount = goals.filter(goal => goal.completed).length;
    const progress = completedCount / goals.length;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Metas del {period} para {petName}</Text>
            <Text style={styles.subtitle}>{completedCount}/{goals.length} completadas</Text>

            {/* Barra de progreso */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>

            <FlatList
                data={goals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.goalItem}
                        onPress={() => toggleGoal(item.id)}
                    >
                        <Text style={item.completed ? styles.completed : styles.uncompleted}>
                            {item.task}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            <TextInput
                style={styles.input}
                placeholder="Añadir nueva meta"
                value={newGoal}
                onChangeText={setNewGoal}
            />
            <View style={styles.buttonContainer}>
                <Button title="Añadir Meta" onPress={addGoal} />
            </View>

            <View style={styles.periodContainer}>
                <Text>Selecciona el periodo:</Text>
                <TouchableOpacity onPress={() => setPeriod('Día')}>
                    <Text style={period === 'Día' ? styles.selectedPeriod : styles.unselectedPeriod}>Día</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPeriod('Semana')}>
                    <Text style={period === 'Semana' ? styles.selectedPeriod : styles.unselectedPeriod}>Semana</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPeriod('Fin de Semana')}>
                    <Text style={period === 'Fin de Semana' ? styles.selectedPeriod : styles.unselectedPeriod}>Fin de Semana</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPeriod('Mes')}>
                    <Text style={period === 'Mes' ? styles.selectedPeriod : styles.unselectedPeriod}>Mes</Text>
                </TouchableOpacity>
            </View>
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
    subtitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    goalItem: {
        padding: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    completed: {
        textDecorationLine: 'line-through',
        color: 'green',
    },
    uncompleted: {
        color: 'black',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonContainer: {
        marginTop: 10,
    },
    periodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    selectedPeriod: {
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    unselectedPeriod: {
        color: '#000',
    },
    progressBarContainer: {
        height: 10,
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
});

export default PetGoals;
