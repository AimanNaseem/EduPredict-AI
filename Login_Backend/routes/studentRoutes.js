const express = require("express");
const { studentanalysis, list } = require("../controllers/studentController");
const StudentAnalysis = require("../model/Studentanalysis");
const studentroute = express.Router();

studentroute.get('', list);
studentroute.get('/:id', async (req, res) => {
    try {
      const student = await StudentAnalysis.findOne({ student_id: req.params.id });
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.status(200).json({ data: student });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
studentroute.post("/studentanalysis", studentanalysis);

module.exports = studentroute;

