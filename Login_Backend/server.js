const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbconnect");
const seedAdmin = require("./seeders/adminSeeder");
const authroutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");
const Userroute = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedback");
const studentroute = require("./routes/studentRoutes");
const datasetRoutes = require("./routes/datasetRoutes");
const chatRoutes = require("./routes/chatRoutes");
const bodyParser = require("body-parser");
const teacherRoutes = require("./routes/teacherRoutes");


require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);



app.use(cors());

app.use(express.json());


app.use("/api/chat", chatRoutes);
app.use('/api/teacher', teacherRoutes)
app.use('/api/student', studentroute)
app.use('/api/user', Userroute);
app.use("/api/auth", authroutes);
app.use("/api/feedback", feedbackRoutes); // ⬅️ Mount route
// Routes
app.use('/api/datasets', datasetRoutes);

app.get("/api/admin", protect(["admin"]), (req, res) => {
  res.json({ msg: "Welcome Admin" });
});
app.get("/api/student", protect(["student"]), (req, res) => {
  res.json({ msg: "Welcome Student" });
});
app.get("/api/teacher", protect(["teacher"]), (req, res) => {
  res.json({ msg: "Welcome Teacher" });
});

connectDB().then(() => {
  app.listen(process.env.PORT, function () {
    console.log(`Server Started Running on PORT ${process.env.PORT}!`)
  });
});

