// src/components/Chatbot/ChatbotContext.jsx
import React, { createContext, useState, useContext } from "react";
import { ChatbotAPI } from "../../Api/chatbotAPI";

export const ChatbotContext = createContext();

export const ChatbotProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "👋 Hi! I'm EduNex AI, your assistant. Ask me anything!" },
  ]);
  const [botTyping, setBotTyping] = useState(false);
  const [userData, setUserData] = useState({
    name: "Student",
    role: "student",
    username: "",
    email: "",
  });

  // --- Suggest Quizzes ---
  const suggestQuizzes = async (subject) => {
    try {
      const datasets = await ChatbotAPI.getDatasets();
      const subjectDataset = datasets.find((d) => d.subject === subject);
      if (subjectDataset) {
        await ChatbotAPI.saveStudentAnalysis({
          username: userData.username,
          suggested_quiz: subjectDataset.id,
        });
      }
    } catch (err) {
      console.error("Quiz suggestion failed:", err);
    }
  };

  // --- Send Message ---
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setBotTyping(true);

    try {
      const lowerText = text.toLowerCase();
      let botReply = "🤖 Sorry, I couldn't understand your query.";

      // --- Map queries to APIs dynamically ---
      // Ye simple example: keyword match
      if (lowerText.includes("career")) {
        if (ChatbotAPI.getCareerAdvice) {
          const res = await ChatbotAPI.getCareerAdvice(text, userData.username);
          botReply = res || "Here is a career suggestion.";
        }
      } else if (lowerText.includes("dropout")) {
        if (ChatbotAPI.predictStudentDropout) {
          const res = await ChatbotAPI.predictStudentDropout(userData.username);
          botReply = res.risk_level === "high" 
            ? `⚠️ Your dropout risk is HIGH in ${res.subject}.` 
            : "✅ Your dropout risk is low.";
          if (res.risk_level === "high") await suggestQuizzes(res.subject);
        }
      } else if (lowerText.includes("quiz")) {
        if (ChatbotAPI.fetch_quiz_summary) {
          botReply = await ChatbotAPI.fetch_quiz_summary();
        }
      } else if (lowerText.includes("attendance")) {
        botReply = await ChatbotAPI.fetch_attendance_table();
      } else if (lowerText.includes("performance")) {
        botReply = await ChatbotAPI.get_student_performance();
      } 
      // aur APIs ke liye aur keywords add kar sakte hain dynamically

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: JSON.stringify(botReply) },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: "❌ Something went wrong." },
      ]);
    } finally {
      setBotTyping(false);
    }
  };

  return (
    <ChatbotContext.Provider value={{ messages, botTyping, sendMessage, userData, setUserData }}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => useContext(ChatbotContext);
