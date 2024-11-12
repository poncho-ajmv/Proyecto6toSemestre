import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { usePetContext } from "../context/PetContext"; // Cambiar a usePetContext

// Importar componentes
import ChatHistory from "./ChatHistory";
import Loading from "./Loading";

import './CSS/Tips.css';

const Tips = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { mascotas } = usePetContext(); // Usar el hook usePetContext

  // Generar preguntas visibles para el usuario y el mapeo interno
  const defaultQuestions = [
    "¿Cuántas mascotas tengo?",
    "¿Cuál es la raza de mis mascotas?",
    ...mascotas.map(
      (mascota) =>
        `¿Créame un plan alimenticio con la información que te doy para mi mascota ${mascota.nombre_mascota}?`
    ),
  ];

  // Mapeo para transformar preguntas visibles a las preguntas internas
  const questionMap = {
    "¿Cuántas mascotas tengo?": "Número de mascotas",
    "¿Cuál es la raza de mis mascotas?": "Información de razas",
    // Agregar el mapeo de las preguntas dinámicas generadas para cada mascota
    ...mascotas.reduce((map, mascota) => {
      const visibleQuestion = `¿Créame un plan alimenticio con la información que te doy para mi mascota ${mascota.nombre_mascota}?`;
      map[visibleQuestion] = `Generame un plan de alimentacion correcto pero hipotetico por favor${mascota.nombre_mascota}, de raza ${mascota.raza} , con la edad de ${mascota.edad}, con un peso de ${mascota.peso}`;
      return map;
    }, {}),
  };

  // Inicializar API de Gemini
  const genAI = new GoogleGenerativeAI("AIzaSyCaEJfaliwhax_NBJWKsRGe9AyYT0McUi8");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Función para manejar la entrada del usuario
  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  // Función para enviar el mensaje del usuario a Gemini
  const sendMessage = async (message) => {
    const userMessage = message || userInput;
    if (userMessage.trim() === "") return;

    // Obtener la pregunta interna a partir del mapeo
    const internalMessage = questionMap[userMessage] || userMessage;

    setIsLoading(true);
    try {
      let responseText;

      // Manejar las preguntas específicas del mapeo
      if (internalMessage === "Número de mascotas") {
        responseText = `Tienes ${mascotas.length} mascotas.`;
      } else if (internalMessage === "Información de razas") {
        const razas = mascotas.map((mascota) => mascota.raza).join(", ");
        responseText = `Las razas de tus mascotas son: ${razas}.`;
      } else {
        // Para otras preguntas, llamamos a la API
        const result = await model.generateContent(internalMessage);
        const response = await result.response;
        responseText = response.text();
      }

      // Agregar la respuesta al historial de chat
      setChatHistory([
        ...chatHistory,
        { type: "user", message: userMessage },
        { type: "bot", message: responseText },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // Función para limpiar el historial de chat
  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Chatbot</h1>

      <div className="chat-layout">
        <div className="chat-container rounded-lg shadow-md p-4">
          <ChatHistory chatHistory={chatHistory} />
          <Loading isLoading={isLoading} />
        </div>

        <div className="default-questions-container p-4">
          <h2 className="text-xl font-bold mb-4">Preguntas</h2>
          <ul>
            {defaultQuestions.map((question, index) => (
              <li key={index}>
                <button
                  className="question-button"
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="input-container mt-4">
        <input
          type="text"
          className="message-input px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <div className="button-group">
          <button
            className="send-button px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
            onClick={() => sendMessage()}
            disabled={isLoading}
          >
            Send
          </button>
          <button
            className="clear-button mt-4 px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
            onClick={clearChat}
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tips;
