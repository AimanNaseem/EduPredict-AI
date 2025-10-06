const express = require('express');
const userController = require('../controllers/userController');
const Users = require('../model/User');
const Userroute = express.Router();


// ✅ This matches /api/user/getAllUsers
Userroute.get('', userController.list);

module.exports = Userroute;
