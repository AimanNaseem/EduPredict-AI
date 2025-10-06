import { motion } from "framer-motion";
import { useState } from "react";

export default function Otpverify({ onVerify }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // Handle individual input change
  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, ""); // only digits
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // auto-focus next
    if (val && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    setLoading(true);
    // simulate API call
    setTimeout(() => {
      setLoading(false);
      onVerify(otpCode); // call parent verify function
    }, 1000);
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50 items-center justify-center p-6">
      <motion.div
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Verification Code
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email/phone
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9078e2] focus:border-[#9078e2] text-lg font-medium"
                required
              />
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#9078e2] hover:bg-[#9078e2] text-white rounded-lg font-medium shadow-sm disabled:opacity-70"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </motion.button>

          <p className="text-center text-gray-500 text-sm mt-2">
            Didn't receive code?{" "}
            <button
              type="button"
              className="text-[#9078e2] font-medium hover:underline"
              onClick={() => alert("Resend OTP logic here")}
            >
              Resend
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
