import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import './CSS/DataBase.css';

const Tips = () => {
  const [razaGenerada, setRazaGenerada] = useState(null);
  const [imagenRaza, setImagenRaza] = useState(null);
  const [razaBuscada, setRazaBuscada] = useState("");
  const genAI = new GoogleGenerativeAI("AIzaSyCaEJfaliwhax_NBJWKsRGe9AyYT0McUi8");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generarRaza = async () => {
    if (!razaBuscada.trim()) return;

    try {
      const prompt = `
        Genera la información de una raza de ${razaBuscada} en el siguiente formato:
        Raza: [Nombre de la raza]
        Origen: [País o región de origen]
        Se encuentra en: [Ubicación geográfica común]
        Altura promedio: [Rango de altura en cm]
        Peso promedio: [Rango de peso en kg]
        Bibliografía: [Referencias relevantes]
        Atributos: [Lista de características y personalidad]
      `;
      
      const result = await model.generateContent(prompt);
      const razaInfo = await result.response.text();
      setRazaGenerada(razaInfo);

      const razaNombre = razaInfo.match(/Raza: (.*)/)?.[1]?.trim();
      if (razaNombre) {
        const respuestaImagen = await fetch(`https://api.unsplash.com/search/photos?query=${razaNombre}&client_id=XRMEQkqKQGVYCH1Tu-h9YrRweDxmwE_yrR0vDqumHOw`);
        const dataImagen = await respuestaImagen.json();
        setImagenRaza(dataImagen.results[0]?.urls?.small || null);
      } else {
        setImagenRaza(null);
      }
    } catch (error) {
      console.error("Error al generar raza o imagen:", error);
    }
  };

  return (
    <div className="container">
      <h1>Generador de Información de Raza</h1>
      
      <input
        type="text"
        placeholder="Escriba el nombre de la raza"
        value={razaBuscada}
        onChange={(e) => setRazaBuscada(e.target.value)}
        className="raza-input"
      />
      <button onClick={generarRaza}>Buscar Raza</button>

      {razaGenerada ? (
        <div className="pet-info">
          <h2>Información Generada:</h2>
          <pre>{razaGenerada}</pre>
          {imagenRaza ? (
            <img src={imagenRaza} alt="Imagen de la raza" className="raza-imagen" />
          ) : (
            <p>No se encontró una imagen para esta raza.</p>
          )}
        </div>
      ) : (
        <p>Escriba el nombre de una raza para buscar su información.</p>
      )}
    </div>
  );
};

export default Tips;
