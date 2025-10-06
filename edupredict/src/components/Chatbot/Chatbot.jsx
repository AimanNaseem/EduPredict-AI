import React, { useState } from "react";
import { useChatbot } from "./ChatbotContext";

const ChatbotUI = () => {
  const { messages, sendMessage, botTyping } = useChatbot();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.sender}>
            {msg.text}
          </div>
        ))}
        {botTyping && <div className="bot-typing">🤖 Typing...</div>}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Ask me anything..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatbotUI;
