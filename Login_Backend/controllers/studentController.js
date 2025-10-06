const axios = require("axios");
const Studentanalysis = require("../model/Studentanalysis");
const studentService = require("../service/studentService");




exports.list = (req, res) => {
  return studentService.getstudent(req, res);
};

exports.studentanalysis = async (req, res) => {
  try {
    const studentInput = req.body;

    // Call Python API for prediction
    const predictionResponse = await axios.post(
      "http://localhost:3001/predict_user",
      studentInput
    );
    const prediction = predictionResponse.data;

    // Merge input + prediction
    const studentData = {
      student_id: studentInput.student_id,
      name: studentInput.student_name,
      gpa: studentInput.gpa,
      hours_studied_per_week: studentInput.hours_studied_per_week,
      previous_failures: studentInput.previous_failures,
      attendance_percentage: studentInput.attendance_percentage,
      quizzes_completed: studentInput.quizzes_completed,
      assignments_completed: studentInput.assignments_completed,
      lms_engagement_score: studentInput.lms_engagement_score,
      dropout_risk: prediction.dropout_risk,
      predicted_performance: prediction.predicted_performance
    };

    // Update if exists, otherwise create
    const savedStudent = await Studentanalysis.findOneAndUpdate(
      { student_id: studentInput.student_id },
      studentData,
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Student record saved successfully",
      data: savedStudent
    });

  } catch (err) {
    console.error("Error in studentanalysis:", err.message);
    res.status(500).json({
      error: "Failed to save student",
      detail: err.message
    });
  }
};