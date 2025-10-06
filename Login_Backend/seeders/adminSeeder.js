const bcrypt = require("bcryptjs");
const connectDB = require("../config/dbconnect");
const Users = require("../model/User");


const seedAdmin = async () => {
  await connectDB();

  const adminEmail = "admin123@gmail.com";

  const exists = await Users.findOne({ email: adminEmail });

  if (!exists) {
    const hash = await bcrypt.hash("12345", 10);

    const admin = new Users({
      name: "Admin", // ✅ Added name
      email: adminEmail,
      password: hash,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully.");
  } else {
    console.log("⚠️ Admin already exists.");
  }
};

module.exports = seedAdmin;
