const Joi = require("joi");

exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(), // ✅ Added name
  role: Joi.string().valid("student", "teacher").required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  student_id: Joi.string().when("role", {
    is: "student",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  batch_id: Joi.string().when("role", {
    is: "teacher",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  courses: Joi.string().when("role", {
    is: "teacher",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "teacher", "student").required(),
  name: Joi.string().min(2).max(50).optional(), // ✅ Optional
});