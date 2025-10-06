// models/StudentPrediction.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentanalysisSchema = new Schema({
  student_id: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
 
  gpa: {
    type: Number,
    required: true,
  },
  
  hours_studied_per_week: {
    type: Number,
    required: true,
  },
  previous_failures: {
    type: Number,
    required: true,
  },
  attendance_percentage: {
    type: Number,
    required: true,
  },
  quizzes_completed: {
    type: Number,
    required: true,
  },
  assignments_completed: {
    type: Number,
    required: true,
  },
  lms_engagement_score: {
    type: Number,
    required: true,
  },
  dropout_risk: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  predicted_performance: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  }
});

const StudentAnalysis = mongoose.model("StudentAnalysis", StudentanalysisSchema);
module.exports = StudentAnalysis;