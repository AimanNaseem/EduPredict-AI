const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  student_id: {
    type: String,
  },
  courses: {
    type: String,
  },
  batch_id: {
    type: String,
  },

  // ✅ NEW FIELDS
  isActive: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
  },
});

const Users = mongoose.model("users", UserSchema);
module.exports = Users;
