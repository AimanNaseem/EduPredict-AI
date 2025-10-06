const connectDB = require("../config/dbconnect");
const Feedback = require("../model/feedback");

const seedFeedback = async () => {
  await connectDB();

  const dummyFeedbacks = [
    {
        role: "admin",
        title: "System Maintenance",
        from: "Admin (admin@system.com)",
        received: new Date("2023-07-01T10:00:00Z"),
        content: "We will have system maintenance this weekend. Please save your work.",
      
      },
      {
        role: "teacher",
        title: "Need Improvement",
        from: "Bilal Asif (bilalasif@edu.pk)",
        received: new Date("2023-06-30T04:22:11Z"),
        content: "We need to improve the user interface for better accessibility.",
        
      },
      {
        role: "student",
        title: "Great Platform!",
        from: "Fatima Khan (fatima@student.edu.pk)",
        received: new Date("2023-06-29T16:45:00Z"),
        content: "I really enjoy using this platform. Everything is very intuitive.",
      }
    ];
  

  try {
    await Feedback.deleteMany();
    await Feedback.insertMany(dummyFeedbacks);
    console.log("✅ Dummy feedback seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding feedback:", err.message);
  }
};

module.exports = seedFeedback; // ✅ named export
