const mongoose = require("mongoose");
const TeacherSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    courses: {
      type: Array,
      required: true,
      default: ["C102", "C104"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("teacher", TeacherSchema);
