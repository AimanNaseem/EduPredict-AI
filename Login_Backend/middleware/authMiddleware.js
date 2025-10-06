const jwt = require("jsonwebtoken");
const Users = require("../model/User");

const blacklist = []; // 🔴 In-memory token blacklist


exports.protect = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "your_jwt_secret");
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// ✅ Logout handler

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided in Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // Check if token is already blacklisted
    if (blacklist.includes(token)) {
      return res.status(401).json({ message: "Token already logged out" });
    }

    // Verify the token
    const decoded = jwt.verify(token, "your_jwt_secret"); // same secret used when signing

    const userId = decoded.id;

    // Optional: verify the role (if needed)
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Mark user as inactive
    await Users.findByIdAndUpdate(userId, { isActive: false });

    // Add token to blacklist
    blacklist.push(token);

    return res.status(200).json({ message: `${user.role} logged out successfully` });

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};


