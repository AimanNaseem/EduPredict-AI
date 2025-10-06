const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const {
  registerSchema,
  loginSchema,
} = require("../validations/authValidation");
const Users = require("../model/User");

exports.register = async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email, password, role, student_id, courses, batch_id } = req.body;

  try {
    const exist = await Users.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // ✅ Create new user directly using the model
    const newUser = await Users.insertMany({
      name,
      email,
      password: hashed,
      role,
      student_id: role === "student" ? student_id : undefined,
      courses: role === "teacher" ? courses : undefined,
      batch_id: role === "teacher" ? batch_id : undefined,
    });

    res.status(201).json({ message: "Registered", data: newUser });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password, role } = req.body;

  try {
    const user = await Users.findOne({ email, role });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Update active status and last login time
    user.isActive = true;
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        student_id: user.student_id,
        id: user._id,
        email: user.email,
        name: user.name,
        batch_id: user.batch_id,
        courses: user.courses,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        
      },
    });
  } catch (err) {
    next(err);
  }
};
