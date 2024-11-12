// Map.js
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "./CSS/Map.css"; // Importamos los estilos de CSS

mapboxgl.accessToken = 'pk.eyJ1IjoicG9uY2hvLWFqbXYiLCJhIjoiY20zYnI0Zm9mMHR1cDJrcTI3cngxMjRpeSJ9.B635730RwvK62CewreTFxA';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const geolocateControl = useRef(null);
  const geocoderContainer = useRef(null); // Contenedor para el geocoder

  useEffect(() => {
    if (map.current) return; // Si el mapa ya está inicializado, no hacer nada

    // Inicializa el mapa
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-90.5133, 14.6349], // Coordenadas iniciales de Guatemala
      zoom: 9,
    });

    // Agrega control de geolocalización
    geolocateControl.current = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.current.addControl(geolocateControl.current);

    // Agrega la barra de búsqueda en un contenedor específico
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: true,
    });

    geocoderContainer.current.appendChild(geocoder.onAdd(map.current));

    // Escucha eventos de búsqueda y mueve el mapa a la posición buscada
    geocoder.on("result", (e) => {
      map.current.flyTo({
        center: e.result.geometry.coordinates,
        zoom: 15,
        essential: true,
      });
    });

    // Obtén la ubicación del usuario al cargar el mapa
    geolocateControl.current.on("geolocate", (e) => {
      const userLocation = [e.coords.longitude, e.coords.latitude];
      map.current.flyTo({
        center: userLocation,
        zoom: 15,
      });
    });
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {/* Contenedor para el geocoder, posicionado en la esquina superior derecha */}
      <div ref={geocoderContainer} className="geocoder-container" />
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Map;
