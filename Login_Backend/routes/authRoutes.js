const express = require("express");
const { register, login } = require("../controllers/authController");
const { logout, protect } = require("../middleware/authMiddleware");
const { changePassword } = require("../controllers/userController");
const authroutes = express.Router();


authroutes.post("/register", register);
authroutes.post("/login", login);
authroutes.post("/logout", logout);
authroutes.put("/changepassword",protect(), changePassword);

module.exports = authroutes;


//http://localhost:8000/api/auth/login
//http://localhost:8000/api/auth/logout
//http://localhost:8000/api/auth/register

// {
//     "email":"student12@gmail.com",
//     "password":"12345",
//     "student_id":"S001",
//     "role":"student"
//   }

// {
//     "name":"Ali",
//    "email": "ali44@gmail.com",
//     "password": "12345",
//     "courses": ["101"],
//     "role": "teacher"
//   }