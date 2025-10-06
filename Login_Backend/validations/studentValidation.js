const Joi = require('joi');

exports.studentValidationSchema = Joi.object({
  student_id: Joi.string()
    .min(5)
    .max(5)
    .required()
    .messages({
      'string.base': 'Student ID should be a text',
      'string.empty': 'Student ID cannot be empty',
      'string.min': 'Student ID must be at least 5 characters',
      'string.max': 'Student ID must be at least 5 characters',
      'any.required': 'Student ID is required',
    }),

  name: Joi.string()
    .min(7)
    .max(15)
    .required()
    .messages({
      'string.base': 'Name should be a text',
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 7 characters',
      'string.max': 'Name must be at least 15 characters',
      'any.required': 'Name is required',
    }),

  predicted_performance: Joi.string()
    .min(10)
    .max(10)
    .required()
    .messages({
      'string.base': 'Predicted performance should be a text',
      'string.empty': 'Predicted performance cannot be empty',
      'string.min': 'Predicted performance must be at least 10 characters',
      'string.max': 'Predicted performance must be at least 10 characters',
      'any.required': 'Predicted performance is required',
    }),

  gpa: Joi.number()
    .min(0)
    .max(4)
    .required()
    .messages({
      'number.base': 'GPA must be a number',
      'number.min': 'GPA cannot be less than 0',
      'number.max': 'GPA cannot be greater than 4',
      'any.required': 'GPA is required',
    }),

  hours_studied_per_week: Joi.number()
    .min(0)
    .max(168)
    .required()
    .messages({
      'number.base': 'Hours studied per week must be a number',
      'number.min': 'Hours studied per week cannot be negative',
      'number.max': 'Hours studied per week cannot exceed 168',
      'any.required': 'Hours studied per week is required',
    }),

  previous_failures: Joi.number()
    .min(0)
    .max(4)
    .required()
    .messages({
      'number.base': 'Previous failures must be a number',
      'number.min': 'Previous failures cannot be negative',
      'number.max': 'Previous failures must be at least 4 characters',
      'any.required': 'Previous failures is required',
    }),

  attendance_percentage: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      'number.base': 'Attendance percentage must be a number',
      'number.min': 'Attendance percentage cannot be less than 0',
      'number.max': 'Attendance percentage cannot be greater than 100',
      'any.required': 'Attendance percentage is required',
    }),

  quizzes_completed: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Quizzes completed must be a number',
      'number.min': 'Quizzes completed cannot be negative',
      'any.required': 'Quizzes completed is required',
    }),

  assignments_completed: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Assignments completed must be a number',
      'number.min': 'Assignments completed cannot be negative',
      'any.required': 'Assignments completed is required',
    }),

  lms_engagement_score: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'LMS engagement score must be a number',
      'number.min': 'LMS engagement score cannot be negative',
      'any.required': 'LMS engagement score is required',
    }),

  dropout_risk: Joi.string()
    .valid('Low', 'Medium', 'High')
    .required()
    .messages({
      'any.only': "Dropout risk must be one of 'Low', 'Medium', or 'High'",
      'any.required': 'Dropout risk is required',
    }),
});

