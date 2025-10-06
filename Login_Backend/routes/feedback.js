const express = require("express");
const router = express.Router();
const Feedback = require("../model/feedback");
const { protect } = require("../middleware/authMiddleware");


// POST /api/feedback
router.post("/", protect(), async (req, res) => {
  try {
    const { title, content, from } = req.body;

    if (!title || !content || !from) {
      return res.status(400).json({ message: "Title, content, and from are required." });
    }

    const feedback = new Feedback({
      role: req.user.role, // 🟡 Role from token
      title,
      content,
      from
    });

    await feedback.save();
    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/", protect(), async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
