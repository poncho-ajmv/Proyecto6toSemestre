import { useState } from "react";
import Tips from "../pages/Tips"; // Tu componente del chatbot existente
import '../assets/ChatIcon.css'; // Estilos para el ícono del chatbot

const ChatIcon = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  return (
    <div className="chat-icon-container">
      <div className={`chat-icon ${isChatOpen ? 'active' : ''}`} onClick={toggleChat}>
        💬 {/* Puedes usar un ícono de chat diferente si lo prefieres */}
      </div>
      {isChatOpen && (
        <div className="chat-window">
          <Tips />
        </div>
      )}
    </div>
  );
};

export default ChatIcon;
