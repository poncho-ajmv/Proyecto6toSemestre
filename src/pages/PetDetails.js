// PetDetails.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocation } from 'react-router-dom';

const PetDetails = () => {
  const location = useLocation();
  const { pet } = location.state || {};

  if (!pet) {
    return <Text>Mascota no encontrada</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles de la Mascota</Text>
      <Text style={styles.detail}>Nombre: {pet.name}</Text>
      <Text style={styles.detail}>Tipo: {pet.type}</Text>
      <Text style={styles.detail}>Edad: {pet.age}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default PetDetails;
