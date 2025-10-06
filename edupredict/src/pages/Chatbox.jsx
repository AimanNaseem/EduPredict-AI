// // components/Chatbot.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { Send } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([
//     { id: 1, sender: "bot", text: "👋 Hi! I'm EduNex AI, your career guide. What subject or career are you curious about?" },
//   ]);
  
//   const [input, setInput] = useState("");
//   const [open, setOpen] = useState(false);
//   const [botTyping, setBotTyping] = useState(false);
//   const scrollRef = useRef(null);
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     username: "",
//     role: "",
//   });

//   // Token decode (as it is)
//   function parseJwt(token) {
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => %${("00" + c.charCodeAt(0).toString(16)).slice(-2)})
//           .join("")
//       );
//       return JSON.parse(jsonPayload);
//     } catch {
//       return null;
//     }
//   }

//   useEffect(() => {
//     const adminToken = localStorage.getItem("admin");
//     const teacherToken = localStorage.getItem("teacher");
//     const studentToken = localStorage.getItem("student");

//     const token = adminToken || teacherToken || studentToken;
//     if (token) {
//       const decoded = parseJwt(token);
//       if (decoded) {
//         setUserData({
//           name: decoded.name || "U",
//           email: decoded.email || "",
//           username: decoded.username || "",
//           role: decoded.role || "",
//         });
//       }
//     }
//   }, []);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { id: Date.now(), sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setBotTyping(true);

//     try {
//       const res = await fetch("http://localhost:8000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       });
//       const data = await res.json();
//       const botMessage = {
//         id: Date.now() + 1,
//         sender: "bot",
//         text: data.reply,
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now() + 1, sender: "bot", text: "❌ Gemini API failed" },
//       ]);
//     } finally {
//       setBotTyping(false);
//     }
//   };

//   // Auto-scroll
//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages, botTyping]);

//   return (
//     <div className="fixed bottom-5 right-5 z-50">
//       {/* Floating Chat Button */}
//       <AnimatePresence>
//       <motion.button
//   onClick={() => setOpen(!open)}
//   className="cursor-pointer flex flex-col items-center focus:outline-none"
//   initial={{ scale: 1 }}
//   whileHover={{ scale: 1.1 }}
//   whileTap={{ scale: 0.95 }}
// >
//   {/* Bot Avatar */}
//   <motion.img
//     src="assets/ai_agent.png"
//     alt="EduNex AI Assistant"
//     className="w-24 h-24 object-contain drop-shadow-xl"
//     animate={{ y: [0, -8, 0] }}
//     transition={{ 
//       y: { repeat: Infinity, repeatType: "loop", duration: 2, ease: "easeInOut" } 
//     }}
//   />

//   {/* Waving Chat Bubble */}
  
//     {!open && (
//       <motion.div
//         className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-xl shadow-lg"
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -10 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//       >
//         👋 Hi! Need Help?
//       </motion.div>
//     )}

// </motion.button>
// </AnimatePresence>

//       {/* Chat Window */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 30 }}
//             transition={{ duration: 0.3 }}
//             className="mt-3 w-80 sm:w-96 h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white px-4 py-4 flex justify-between items-center rounded-t-3xl shadow-md">
//               <h2 className="font-bold text-lg flex items-center gap-2">
//                 EduNex AI <span className="animate-pulse">🤖</span>
//               </h2>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="text-white text-xl font-bold hover:text-gray-200 transition"
//               >
//                 ✖
//               </button>
//             </div>

//             {/* Messages */}
//             <div
//               ref={scrollRef}
//               className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-gray-100"
//             >
//               {messages.map((msg) => (
//                 <motion.div
//                   key={msg.id}
//                   initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className={`flex ${
//                     msg.sender === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   {msg.sender === "bot" && (
//                     <div className="w-9 h-9 bg-[#c4bef0] text-white rounded-full flex items-center justify-center text-sm font-bold mr-2 shadow-md">
//                       🤖
//                     </div>
//                   )}
//                   <div
//                     className={`max-w-[70%] px-4 py-2 rounded-2xl break-words text-sm leading-relaxed shadow ${
//                       msg.sender === "user"
//                         ? "bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white rounded-br-none"
//                         : "bg-white text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     {msg.text}
//                   </div>
//                   {msg.sender === "user" && (
//                     <div className="w-9 h-9 bg-[#9078e2] text-white rounded-full flex items-center justify-center text-sm font-bold ml-2 shadow-md">
//                       {userData?.name?.charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                 </motion.div>
//               ))}

//               {/* Typing Indicator */}
//               {botTyping && (
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 bg-indigo-400 text-white rounded-full flex items-center justify-center">
//                     🤖
//                   </div>
//                   <div className="flex gap-1">
//                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
//                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
//                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Input */}
//             <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 placeholder="Ask about careers, subjects..."
//                 className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9078e2] bg-gray-50 text-sm"
//               />
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleSend}
//                 className="bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white p-3 rounded-full shadow hover:shadow-lg transition"
//               >
//                 <Send className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Chatbot;















import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, BookOpen, TrendingUp, AlertCircle, Target, XIcon, Users, AlertTriangle, BarChart, UserCheck } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [studentStats, setStudentStats] = useState([]);
  const [classStats, setClassStats] = useState(null);
  const scrollRef = useRef(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
    student_id: "",
    batch_id: "",
    courses: ""
  });

  // --- Speech recognition hook ---
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [speakingId, setSpeakingId] = useState(null);
const confettiCanvasRef = useRef(null);    // sparkle confetti 
  // --- Token Decode ---
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
function formatDateTime(date) {
  // Example: 29 Sep 2025, 01:45 AM
  return new Date(date).toLocaleString([], {
    // day: "2-digit",
    // month: "short",
    // year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true      // ✅ forces 12-hour format with AM/PM
  });
}

  // --- Load user info ---
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const teacher = localStorage.getItem("teacher");
    const student = localStorage.getItem("student");
    const token = admin || teacher || student;

    if (token) {
      const decoded = parseJwt(JSON.parse(token).token);
      if (decoded) {
        setUserData({
          name: decoded.name || "",
          email: decoded.email || "",
          username: decoded.username || "",
          role: decoded.role || "",
          student_id: decoded.student_id || "",
          batch_id: decoded.batch_id || "",
          courses: decoded.courses || ""
        });
 
        // Role-based welcome messages
        if (decoded.role === "student") {
          setMessages([
            {
              id: 1,
              sender: "bot",
              text: `👋 Welcome back, ${decoded.name}! I'm your personal AI career counselor. Ask me anything about your performance, courses, or career guidance.`,
              timestamp: new Date()
            }
          ]);
        } else if (decoded.role === "teacher") {
          setMessages([
            {
              id: 1,
              sender: "bot",
              text: `👋 Welcome Professor ${decoded.name}! I'm your AI teaching assistant. I can help you analyze student performance, identify at-risk students, and provide teaching insights for your ${decoded.courses} class (Batch: ${decoded.batch_id}).`,
              timestamp: new Date()
            }
          ]);
        } 
        else {
          setMessages([
            {
              id: 1,
              sender: "bot",
              text: "❌ Only students can access personalized career counseling. Please login as a student."
            }
          ]);
        }
      }
    } else {
      setMessages([{ id: 1, sender: "bot", text: "👋 Please login to access EduNex AI counseling." }]);
    }
  }, []);

  // --- Auto-update input with speech ---
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

// Female voice setup
 const [femaleVoice, setFemaleVoice] = useState(null);
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const f = voices.find(v =>
        /female|woman|google us english|samantha|victoria|zoe|aria/i.test(v.name)
      );
      setFemaleVoice(f || voices[0]);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text, id) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";     // language
    utter.voice = femaleVoice;  // 💡 female voice if available
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = () => setSpeakingId(null);
    setSpeakingId(id);     //read aloud par chale ga speech
    window.speechSynthesis.speak(utter);
  };
  const stopSpeaking = () => { window.speechSynthesis.cancel(); setSpeakingId(null); };   //stop speaking


  // --- Handle send message ---
  const handleSend = async () => {
  
    if (!input.trim()) return;
  const now = new Date(); // capture time once
    const userMessage = { id: Date.now(), sender: "user", text: input,timestamp: now };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    resetTranscript();
    setBotTyping(true);

    // Get token based on role
    try {
      const tokenString = localStorage.getItem(userData.role);
      if (!tokenString) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "bot", text: "❌ Please login to continue",timestamp: new Date() }
        ]);
        setBotTyping(false);
        return;
      }

      const studentData = JSON.parse(tokenString);
      const token = studentData.token;

      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`    //body se ata hai
        },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      // Update stats based on role
      if (data.studentStats) setStudentStats(data.studentStats);
       if (data.classStats) {setClassStats(data.classStats);  };

      const botMessage = { id: Date.now() + 1, sender: "bot", text: data.reply, timestamp: new Date() };
      setMessages((prev) => [...prev, botMessage]);
      

      // Fire confetti for positive messages
      // Fire confetti for positive messages (Only for students)
if (
  userData.role === "student" && 
  /congratulation|well done|great job|excellent|improved|promotion|pass/i.test(data.reply)
) {
  fireConfetti();
}

      // speak(data.reply); // <-- speak bot reply
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text:
            // err.message === "Access denied. Students only."
            //   ? "❌ Only students can access this feature."
            //   : "❌ Something went wrong. Please try again.",
            err.message === "Access denied" 
            ? "❌ Access denied. Please check your permissions."
            : "❌ Something went wrong. Please try again.",
              timestamp: new Date()
        }
      ]);
    } finally {
      setBotTyping(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({top: scrollRef.current.scrollHeight, behavior: "smooth", });
  }, [messages, botTyping]);
  // --- Quick Actions ---
  const quickActions =
    userData.role === "student"
      ? [
          { icon: <BookOpen className="w-3 h-3" />, text: "Recommend courses", action: "Based on my performance and interests, which courses would you recommend?" },
          { icon: <TrendingUp className="w-3 h-3" />, text: "Career guidance", action: "Give me career guidance based on my performance and skills" },
          { icon: <AlertCircle className="w-3 h-3" />, text: "My performance", action: "Analyze my academic performance and suggest improvements" },
          { icon: <Target className="w-3 h-3" />, text: "Learning path", action: "Create a personalized learning path for me" }
        ]
      : userData.role === "teacher"
    ? [
        { 
          icon: <Users className="w-3 h-3" />, 
          text: "Class Overview", 
          action: "Give me an overview of my class performance and statistics" 
        },
        { 
          icon: <AlertTriangle className="w-3 h-3" />, 
          text: "At-Risk Students", 
          action: "Show me students who are at high risk of dropping out" 
        },
        { 
          icon: <BarChart className="w-3 h-3" />, 
          text: "Performance Analysis", 
          action: "Analyze the overall academic performance of my class" 
        },
        { 
          icon: <UserCheck className="w-3 h-3" />, 
          text: "Top Performers", 
          action: "Who are the top performing students in my class?" 
        }
      ]
      : [];

  // --- Risk color ---
  const getRiskColor = (risk) => {
    switch (risk) {
      case "High": return "text-red-500";
      case "Medium": return "text-yellow-500";
      case "Low": return "text-green-500";
      default: return "text-gray-500";
    }
  };
  // --- confetti: lightweight implementation ---
const fireConfetti = (count = 80) => {
const canvas = confettiCanvasRef.current;
if (!canvas) return;
const ctx = canvas.getContext("2d");
const w = (canvas.width = canvas.clientWidth);
const h = (canvas.height = canvas.clientHeight);
const pieces = [];
for (let i = 0; i < count; i++) {
pieces.push({
x: Math.random() * w,
y: Math.random() * h - h / 2,
r: (Math.random() * 6) + 4,
d: Math.random() * count,
color: `hsl(${Math.random() * 360}, 80%, 60%)`,
tilt: Math.random() * 10 - 10,
});
}
let t = 0;
const render = () => {
ctx.clearRect(0, 0, w, h);
t += 1;
for (let i = 0; i < pieces.length; i++) {
const p = pieces[i];
p.y += Math.cos(t + p.d) + 3 + p.r / 2;
p.x += Math.sin(t) * 0.5;
p.tilt += 0.1;
ctx.save();
ctx.translate(p.x, p.y);
ctx.rotate(p.tilt * 0.1);
ctx.fillStyle = p.color;
ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r);
ctx.restore();
}
if (t < 200) requestAnimationFrame(render); else ctx.clearRect(0, 0, w, h);
};
render();
};

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Your browser does not support voice recognition.</p>;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      <AnimatePresence>
        <motion.button
          onClick={() => setOpen(!open)}
          className="cursor-pointer flex flex-col items-center focus:outline-none"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src="assets/ai_agent.png"
            alt="EduNex AI"
            className="w-20 h-20 object-contain drop-shadow-xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ y: { repeat: Infinity, repeatType: "loop", duration: 2 } }}
          />
          {!open && (
            <motion.div 
              className="mt-1 px-2 py-1 bg-indigo-500 text-white text-xs rounded-xl shadow" 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
            >
              👋 Hi! Need Help?
            </motion.div>
          )}
        </motion.button>
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 30 }} 
            transition={{ duration: 0.3 }} 
            className="mt-3 w-80 sm:w-96 h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Confetti canvas */}
            <canvas 
              ref={confettiCanvasRef} 
              className="pointer-events-none absolute inset-0 w-full h-full" 
            />
            
            {/* Header */}
            <div className={`${userData.role === 'teacher' ? 'bg-gradient-to-r from-indigo-500 to-[#9078e2]' : 'bg-gradient-to-r from-indigo-500 to-[#9078e2]'} text-white px-4 py-4 flex justify-between items-center rounded-t-3xl shadow-md`}>
              <div>
                <h2 className="font-bold text-lg flex items-center gap-2">
                  EduNex AI 
                  <span className="animate-pulse">
                    {userData.role === 'teacher' ? '👨‍🏫' : '🤖'}
                  </span>
                </h2>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="bg-white/20 px-2 rounded-full">
                    {userData.role || "Guest"}
                  </span>
                  
                  {/* Student Stats */}
                  {studentStats && (
                    <>
                       
                      
                    </>
                  )}
                  
                  {/* Teacher Stats */}
                  {classStats && (
                    <>
                    <span className="bg-white/20 px-2 rounded-full">
                        Quiz: {classStats.avgQuizzes}
                      </span>
                     <span className="bg-white/20 px-2 rounded-full">
                        Avg GPA: {classStats.avgGpa}
                      </span>
                      <span className="bg-white/20 px-2 rounded-full">
                        {classStats.totalStudents} Students
                      </span>
                    
                     
                    </>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="text-white text-xl font-bold hover:text-gray-200 transition"
              >
                ✖
              </button>
            </div>

            {/* Quick Actions */}
            {quickActions.length > 0 && messages.length <= 2 && (
              <div className="px-4 py-2 border-b bg-gray-50">
                <p className="text-xs text-gray-600 mb-1">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((qa, i) => (
                    <button 
                      key={i} 
                      onClick={() => { 
                        setInput(qa.action); 
                        handleSend(); 
                      }} 
                      className="flex items-center gap-1 text-xs bg-white border px-3 py-1.5 rounded-full hover:bg-indigo-50 transition"
                    >
                      {qa.icon}
                      {qa.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-gray-100"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className={`w-9 h-9 ${userData.role === 'teacher' ? 'bg-purple-400' : 'bg-[#c4bef0]'} text-white rounded-full flex items-center justify-center text-sm font-bold mr-2 shadow-md`}>
                      {userData.role === 'teacher' ? '👨‍🏫' : '🤖'}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl break-words text-sm leading-relaxed shadow
                      ${msg.sender === "user"
                        ? userData.role === 'teacher' 
                          ? "bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white rounded-br-none"
                          : "bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                  >
                    {msg.text}
                    <div className="text-[10px] text-gray-900 mt-1 text-right">
                      {formatDateTime(msg.timestamp)}
                    </div>

                    {/* Read Aloud button */}
                    {msg.sender === "bot" && (
                      <div className="mt-2 pt-2 border-t border-gray-200 flex justify-end">
                        <button
                          onClick={() =>
                            speakingId === msg.id
                              ? stopSpeaking()
                              : speak(msg.text, msg.id)
                          }
                          className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                        >
                          {speakingId === msg.id ? "⏹ Stop" : "🔊 Read Aloud"}
                        </button>
                      </div>
                    )}
                  </div>

                  {msg.sender === "user" && (
                    <div className={`w-9 h-9 ${userData.role === 'teacher' ? 'bg-purple-500' : 'bg-[#9078e2]'} text-white rounded-full flex items-center justify-center text-sm font-bold ml-2 shadow-md`}>
                      {userData?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.div>
              ))}

              {botTyping && (
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${userData.role === 'teacher' ? 'bg-purple-400' : 'bg-indigo-400'} text-white rounded-full flex items-center justify-center`}>
                    {userData.role === 'teacher' ? '👨‍🏫' : '🤖'}
                  </div>
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: dot * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input + Mic */}
            <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleSend()} 
                placeholder={userData.role === 'teacher' ? "Ask about your students..." : "Type Your Message"} 
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9078e2] bg-gray-50 text-sm" 
              />

              {/* Microphone button */}
              <button 
                onClick={() => SpeechRecognition.startListening({ continuous: false })} 
                className={`p-2 rounded-full ${listening ? "bg-red-500" : userData.role === 'teacher' ? "bg-purple-500" : "bg-indigo-500"} text-white`}
              >
                🎤
              </button>

              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.95 }} 
                onClick={handleSend} 
                className={`${userData.role === 'teacher' ? 'bg-gradient-to-r from-indigo-500 to-[#9078e2]' : 'bg-gradient-to-r from-indigo-500 to-[#9078e2]'} text-white p-3 rounded-full shadow hover:shadow-lg transition`}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
