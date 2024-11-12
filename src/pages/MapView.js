import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const [location, setLocation] = useState([14.609620, -90.499984]); // Coordenadas de la Universidad Galileo, sede central
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error obteniendo la geolocalización:", error.message);
          alert("No se pudo obtener la ubicación. Por favor, verifica los permisos.");
        }
      );
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      if (!response.ok) throw new Error("Error al buscar la ubicación");
      
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLocation([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Ubicación no encontrada");
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error.message);
      alert("Hubo un error en la búsqueda de la ubicación.");
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '5px' }}>Hora actual: {currentTime}</div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '5px', width: '250px' }}
            aria-label="Buscar ubicación"
          />
          <button type="submit" style={{ padding: '5px' }}>Buscar</button>
        </form>
      </div>
      <MapContainer center={location} zoom={18} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={location}>
          <Popup>
            Ubicación actual: Latitud {location[0]}, Longitud {location[1]}
          </Popup>
        </Marker>
        <MapUpdater center={location} />
      </MapContainer>
    </div>
  );
};

const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

export default MapView;
