const express = require("express");
const Router = express.Router();
const Admin = require("./model/admin");
const Teacher = require("./model/teacher");
const Student = require("./model/student");
const Joi = require("joi");

// Generate dummy credentials
Router.get("/dummyroles", async (req, res, next) => {
  const password = "12345";
  let admin;
  let student;
  let teacher;
  let count = 0;
  try {
    admin = await Admin.findOne({ email: "admin123@gmail.com" });
    if (!admin) {
      admin = new Admin({
        email: "admin123@gmail.com",
        password,
      });
      await admin.save();
      count++;
    }

    student = await Student.findOne({ email: "student1@gmail.com" });
    if (!student) {
      student = new Student({
        email: "student1@gmail.com",
        password,
        student_id: "S002",
      });
      await student.save();
      count++;
    }
    teacher = await Teacher.findOne({ email: "teacher456@gmail.com" });
    if (!teacher) {
      teacher = new Teacher({
        email: "teacher456@gmail.com",
        password: "12345",
        courses: ["C102", "C103", "C105"],
      });
      await teacher.save();
      count++;
    }
  } catch (error) {
    next(error);
  }
  return res.status(200).json({ msg: "Roles Created", count });
});

// Admin Auth
Router.post("/signup/admin", async (req, res, next) => {
  const genSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = genSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  const { email, password } = req.body;
  let user;
  try {
    user = new Admin({
      email,
      password,
    });

    await user.save();
  } catch (error) {
    next(error);
  }
  return res.status(201).json({ msg: "Admin Created" });
});
Router.post("/login/admin", async (req, res, next) => {
  const genSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = genSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  const { email, password } = req.body;
  let user;
  try {
    user = await Admin.findOne({ email, password });
    if (!user) {
      const error = {
        status: 401,
        message: "Invalid credentials",
      };
      return next(error);
    }
  } catch (error) {
    next(error);
  }
  return res.status(200).json({ msg: "Login Success", auth: true });
});

// Student Auth

Router.post("/signup/student", async (req, res, next) => {
  const genSchema = Joi.object({
    student_id: Joi.string().required(),

    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = genSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  const { student_id, email, password } = req.body;
  let user;
  try {
    user = new Student({
      student_id,
      email,
      password,
    });

    await user.save();
  } catch (error) {
    next(error);
  }
  return res.status(201).json({ msg: "Student Created" });
});
Router.post("/login/student", async (req, res, next) => {
  const genSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = genSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  const { email, password } = req.body;
  let user;
  try {
    user = await Student.findOne({ email, password });
    if (!user) {
      const error = {
        status: 401,
        message: "Invalid credentials",
      };
      return next(error);
    }
  } catch (error) {
    next(error);
  }
  return res
    .status(200)
    .json({ msg: "Login Success", student: user.student_id });
});

// Teacher Login
Router.post("/signup/teacher", async (req, res, next) => {
  const genSchema = Joi.object({
    courses: Joi.array().required(),

    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = genSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  const { courses, email, password } = req.body;
  let user;
  try {
    user = new Teacher({
      courses,
      email,
      password,
    });

    await user.save();
  } catch (error) {
    next(error);
  }
  return res.status(201).json({ msg: "Teacher Created" });
});
Router.post("/login/teacher", async (req, res, next) => {
  const genSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = genSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  const { email, password } = req.body;
  let user;
  try {
    user = await Teacher.findOne({ email, password });
    if (!user) {
      const error = {
        status: 401,
        message: "Invalid credentials",
      };
      return next(error);
    }
  } catch (error) {
    next(error);
  }
  return res.status(200).json({ msg: "Login Success", courses: user.courses });
});

module.exports = Router;
