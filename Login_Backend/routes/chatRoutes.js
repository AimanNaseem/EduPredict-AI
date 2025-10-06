const express = require("express");
const { chatWithGemini } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

const chatRoutes = express.Router();

// Chat endpoint - works for both students and teachers
chatRoutes.post("/",protect(["student", "teacher"]), chatWithGemini);

module.exports = chatRoutes;
