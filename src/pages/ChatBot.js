import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { usePetContext } from "../context/PetContext";

// Importar componentes
import ChatHistory from "./ChatHistory";
import Loading from "./Loading";
import './CSS/Tips.css';

const ChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { mascotas } = usePetContext();

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

    setIsLoading(true);
    try {
      let responseText;

      if (userMessage === "¿Cuántas mascotas tengo?") {
        responseText = `Tienes ${mascotas.length} mascotas.`;
      } else if (userMessage === "¿Cuál es la raza de mis mascotas?") {
        const razas = mascotas.map(mascota => mascota.raza).join(", ");
        responseText = `Las razas de tus mascotas son: ${razas}.`;
      } else {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        responseText = response.text();
      }

      // Agregar el mensaje del usuario y la respuesta del bot al historial de chat
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

export default ChatBot;
