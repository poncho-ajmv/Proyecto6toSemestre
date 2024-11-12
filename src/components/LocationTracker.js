// src/components/LocationTracker.js
import React, { useState, useEffect } from 'react';

const LocationTracker = ({ onLocationChange }) => {
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationChange([latitude, longitude]);
        },
        (error) => {
          console.error('Error obteniendo la ubicación:', error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.log('La geolocalización no es compatible con este navegador.');
    }
  }, [onLocationChange]);

  return null; // Este componente solo actualiza la ubicación, no tiene salida visual.
};

export default LocationTracker;
