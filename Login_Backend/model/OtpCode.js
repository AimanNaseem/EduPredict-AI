// models/OtpCode.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const otpSchema = new Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expires_at: { type: Date, required: true }
});

const OtpCode = mongoose.model("otp_codes", otpSchema);
module.exports = OtpCode;
