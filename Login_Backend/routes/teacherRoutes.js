const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const jwt = require("jsonwebtoken");

const teacherRoutes = express.Router();

// ===== Middleware for protecting routes =====
const protect = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, "your_jwt_secret"); // Use same secret as login
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

// ===== Teacher Data API =====
teacherRoutes.get("/data", protect(["teacher"]), (req, res) => {
  const teacherName = req.user.name;
  const batchId = req.user.batch_id;
  const course = req.user.courses;
  const monthFilter = req.query.month;

  const results = [];
  const monthsSet = new Set();

  fs.createReadStream("data/all_batches.csv")
    .pipe(csv())
    .on("data", (row) => {
      if (
        row.teacher_name === teacherName &&
        row.batch_id === batchId &&
        row.course === course
      ) {
        if (row.month) monthsSet.add(row.month);

        if (!monthFilter || row.month === monthFilter) {
          results.push(row);
        }
      }
    })
    .on("end", () => {
      if (results.length === 0) {
        return res.json({ message: "No records found" });
      }

      let totalAttendance = 0,
        totalAssignments = 0,
        totalQuizzes = 0;

      results.forEach((r) => {
        totalAttendance += parseFloat(r.attendance_rate);
        totalAssignments += parseFloat(r.assignments_completed);
        totalQuizzes += parseFloat(r.quizzes_completed);
      });

      res.json({
        batch_id: batchId,
        course: course,
        months: Array.from(monthsSet), // For frontend dropdown
        selectedMonth: monthFilter || Array.from(monthsSet)[0], // default first month
        totalRecords: results.length,
        AverageAttendance: ((totalAttendance / results.length) * 100).toFixed(2) + "%",
        AverageAssignments: (totalAssignments / results.length).toFixed(),
        AverageQuizzes: (totalQuizzes / results.length).toFixed(),
        stddata: results,
      });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
});


teacherRoutes.get("/dropout_risk", protect(["teacher"]), (req, res) => {
  const teacherName = req.user.name;
  const batchId = req.user.batch_id;
  const course = req.user.courses;
  const monthFilter = req.query.month;

  const results = [];
  const monthsSet = new Set();

  fs.createReadStream("data/all_batches.csv")
    .pipe(csv())
    .on("data", (row) => {
      if (
        row.teacher_name === teacherName &&
        row.batch_id === batchId &&
        row.course === course
      ) {
        if (row.month) monthsSet.add(row.month);

        if (!monthFilter || row.month === monthFilter) {
          results.push(row);
        }
      }
    })
    .on("end", () => {
      if (results.length === 0) {
        return res.json({ message: "No records found" });
      }

      // ✅ Risk thresholds
      const thresholds = {
        Low: {
          gpa: 2.5,
          attendance_percentage: 60,
          lms_engagement_score: 70,
          assignments_completed: 10,
          quizzes_completed: 5,
        },
        Medium: {
          gpa: 1.8,
          attendance_percentage: 50,
          lms_engagement_score: 50,
          assignments_completed: 7,
          quizzes_completed: 3,
        },
        High: {
          gpa: 0,
          attendance_percentage: 0,
          lms_engagement_score: 0,
          assignments_completed: 0,
          quizzes_completed: 0,
        },
      };

      const student_risks = results.map((row) => {
        const gpa = parseFloat(row.gpa);
        const attendance = parseFloat(row.attendance_percentage);
        const lms = parseFloat(row.lms_engagement_score);
        const assignments = parseInt(row.assignments_completed);
        const quizzes = parseInt(row.quizzes_completed);
        const failures = parseInt(row.previous_failures);

        // Default risk
        let predicted_risk = "Low";
        if (gpa < thresholds.Medium.gpa || attendance < thresholds.Medium.attendance_percentage) {
          predicted_risk = "Medium";
        }
        if (gpa < thresholds.Low.gpa / 2 || attendance < thresholds.Medium.attendance_percentage / 2) {
          predicted_risk = "High";
        }

        // Reasons
        const reasons = [];
        if (attendance < 50) reasons.push("Low attendance");
        if (gpa < 2) reasons.push("Low GPA");
        if (lms < 60) reasons.push("Low LMS activity");
        if (assignments < 10) reasons.push("Incomplete assignments");
        if (quizzes < 5) reasons.push("Low quiz participation");
        if (failures > 0) reasons.push(`Previous Failures: ${failures}`);

        return {
          student_id: row.student_id,
          Month: row.month,
          name: row.Name,
          Course: row.course,
          teacher_name: row.teacher_name,
          attendance: `${attendance.toFixed(2)}%`,
          gpa: gpa.toFixed(2),
          assignments_completed: assignments,
          quizzes_completed: quizzes,
          lms_engagement_score: lms.toFixed(1),
          previous_failures: failures,
          risk_level: predicted_risk,
          risk_reason: reasons.length > 0 ? reasons.join(", ") : "No major issues",
        };
      });

      // ✅ Final response
      res.json({
        batch_id: batchId,
        course: course,
        months: Array.from(monthsSet).sort(
          (a, b) =>
            [
              "January","February","March","April","May","June",
              "July","August","September","October","November","December",
            ].indexOf(a) -
            [
              "January","February","March","April","May","June",
              "July","August","September","October","November","December",
            ].indexOf(b)
        ),
        students: student_risks,
      });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
});


//performance distrebution
teacherRoutes.get("/academic_performance", protect(["teacher"]), (req, res) => {
  const teacherName = req.user.name;
  const batchId = req.user.batch_id;
  const course = req.user.courses;
  const monthFilter = req.query.month;

  const results = [];
  const monthsSet = new Set();


  fs.createReadStream("data/all_batches.csv")
    .pipe(csv())
    .on("data", (row) => {
      if (
        row.teacher_name === teacherName &&
        row.batch_id === batchId &&
        row.course === course
      ) {
        if (row.month) monthsSet.add(row.month);

        if (!monthFilter || row.month === monthFilter) {
          results.push(row);
        }
      }
    })
    .on("end", () => {
      if (results.length === 0) {
        return res.json({ message: "No records found" });
      }


      // 1️⃣ Average GPA
      const gpas = results.map((r) => parseFloat(r.gpa)).filter((g) => !isNaN(g));
      const avgGpa =
        gpas.length > 0
          ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2)
          : null;

      // 2️⃣ Performance Distribution
      const distribution = {};
      results.forEach((r) => {
        const perf = r.predicted_performance || "Unknown";
        distribution[perf] = (distribution[perf] || 0) + 1;
      });

      const performanceChartData = Object.keys(distribution).map((key) => ({
        label: key,
        value: distribution[key],
      }));

      // 3️⃣ Top 10 Students (Excellent)
      const topStudents = results
        .filter((r) => r.predicted_performance === "Excellent")
        .map((r) => ({
          student_id: r.student_id,
          name: r.Name,
          gpa: parseFloat(r.gpa).toFixed(2),
          performance: r.predicted_performance,
        }))
        .sort((a, b) => parseFloat(b.gpa) - parseFloat(a.gpa))
        .slice(0, 10);

      // ✅ Final Response
      res.json({
        batch_id: batchId,
        course: course,
        months: Array.from(monthsSet),
        average_gpa: avgGpa,
        performance_distribution: performanceChartData,
        top_students: topStudents,
      });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    });
});








module.exports = teacherRoutes;