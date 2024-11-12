// src/context/BestGuessContext.js
import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const BestGuessContext = createContext();

// Proveedor del contexto
export const BestGuessProvider = ({ children }) => {
  const [bestGuess, setBestGuess] = useState(null);

  return (
    <BestGuessContext.Provider value={{ bestGuess, setBestGuess }}>
      {children}
    </BestGuessContext.Provider>
  );
};

// Hook para usar el Best Guess
export const useBestGuess = () => {
  return useContext(BestGuessContext);
};
