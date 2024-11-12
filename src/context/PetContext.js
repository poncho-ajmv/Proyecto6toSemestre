// src/context/PetContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const { user } = useAuth();
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get('http://localhost:5000/mascotas')
        .then(response => {
          const mascotasDelUsuario = response.data.filter(mascota => mascota.id_usuario === user.id_usuario);
          setMascotas(mascotasDelUsuario);
        })
        .catch(error => console.error('Error al cargar las mascotas:', error));
    }
  }, [user]);

  return (
    <PetContext.Provider value={{ mascotas }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => useContext(PetContext);
