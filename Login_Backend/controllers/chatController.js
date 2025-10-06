
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require("jsonwebtoken");
const StudentAnalysis = require("../model/Studentanalysis"); // Your existing model
const dotenv = require("dotenv");
const fs = require("fs");
const csv = require("csv-parser");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware to verify student role
const verifyStudentRole = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    return decoded.role === 'student' ? decoded : null;
  } catch (error) {
    return null;
  }
};

// Get student data from database using student_id
const getStudentData = async (student_id) => {
  try {
    // Find student by student_id field from StudentAnalysis collection
    const student = await StudentAnalysis.findOne({ student_id: student_id });
    return student;
  } catch (error) {
    console.error("Error fetching student data:", error);
    return null;
  }
};

// Create personalized prompt for Gemini
// const createPersonalizedPrompt = (studentData, userMessage) => {
//   const courses = ["App Development", "Digital Marketing", "Generative AI", 
//                    "Cyber Security", "Graphic Designing", "Web Development", 
//                    "Data Science", "ML/DL", "MERN Stack", "DevOps", "Business Analytics"];
  
//   // Performance level based on GPA
//   const getPerformanceLevel = (gpa) => {
//     if (gpa >= 3.5) return "Excellent";
//     if (gpa >= 3.0) return "Good";
//     if (gpa >= 2.5) return "Average";
//     return "Needs Improvement";
//   };

//   // Engagement level based on LMS score
//   const getEngagementLevel = (score) => {
//     if (score >= 80) return "Highly Engaged";
//     if (score >= 60) return "Moderately Engaged";
//     if (score >= 40) return "Low Engagement";
//     return "Very Low Engagement";
//   };

//   return `You are an educational AI assistant for EduNex learning platform. You are helping a specific student.
  
//   Student Profile:
//   - Name: ${studentData.name}
//   - GPA: ${studentData.gpa}/4.0 (${getPerformanceLevel(studentData.gpa)} performance)
//   - Study Hours per Week: ${studentData.hours_studied_per_week} hours
//   - Attendance: ${studentData.attendance_percentage}%
//   - Previous Failures: ${studentData.previous_failures}
//   - Quizzes Completed: ${studentData.quizzes_completed}
//   - Assignments Completed: ${studentData.assignments_completed}
//   - LMS Engagement: ${studentData.lms_engagement_score}/100 (${getEngagementLevel(studentData.lms_engagement_score)})
//   - Dropout Risk: ${studentData.dropout_risk}
//   - Predicted Performance: ${studentData.predicted_performance}
  
//   Available Courses on Platform: ${courses.join(', ')}
  
//   Your responsibilities:
//   1. Provide personalized career counseling based on the student's current performance
//   2. ${studentData.dropout_risk !== 'Low' ? 'IMPORTANT: This student has ' + studentData.dropout_risk + ' dropout risk. Provide supportive guidance and concrete strategies to help them stay on track.' : ''}
//   3. Recommend suitable courses from the available list based on their interests and performance
//   4. ${studentData.attendance_percentage < 75 ? 'Address the low attendance issue and suggest ways to improve it.' : ''}
//   5. ${studentData.lms_engagement_score < 60 ? 'Encourage more engagement with the learning platform.' : ''}
//   6. Help with study techniques to improve their weak areas
//   7. Motivate and encourage the student
//   8. Answer course-related queries
//   9. ${studentData.previous_failures > 0 ? 'Be extra supportive as the student has faced failures before.' : ''}
  
//   Important guidelines:
//   - Be supportive and encouraging, especially if performance is low
//   - Never share this student's personal data or mention other students
//   - Focus on practical advice and actionable steps
//   - Tailor your response based on their current performance metrics
//   - If the student asks about courses, recommend based on their strengths and interests
//   - For high dropout risk students, prioritize retention strategies
  
//   Student's Question: ${userMessage}
  
//   Provide a helpful, personalized, and encouraging response. Use the student's name occasionally to make it more personal.`;
// };





const createPersonalizedPrompt = (studentData, userMessage) => {
  const courses = ["App Development", "Digital Marketing", "Generative AI", 
                   "Cyber Security", "Graphic Designing", "Web Development", 
                   "Data Science", "ML/DL", "MERN Stack", "DevOps", "Business Analytics"];
  
  // Performance level based on GPA
  const getPerformanceLevel = (gpa) => {
    if (gpa >= 3.5) return "Excellent";
    if (gpa >= 3.0) return "Good";
    if (gpa >= 2.5) return "Average";
    return "Needs Improvement";
  };

  // Engagement level based on LMS score
  const getEngagementLevel = (score) => {
    if (score >= 80) return "Highly Engaged";
    if (score >= 60) return "Moderately Engaged";
    if (score >= 40) return "Low Engagement";
    return "Very Low Engagement";
  };

  return `You are an educational AI assistant for EduNex AI, an educational analytics platform. You ONLY provide educational guidance, career counseling, and platform navigation help.

STUDENT PROFILE:
- Name: ${studentData.name}
- GPA: ${studentData.gpa}/4.0 (${getPerformanceLevel(studentData.gpa)} performance)
- Study Hours: ${studentData.hours_studied_per_week} hours/week
- Attendance: ${studentData.attendance_percentage}%
- Previous Failures: ${studentData.previous_failures}
- Quizzes Completed: ${studentData.quizzes_completed}
- Assignments Completed: ${studentData.assignments_completed}
- LMS Engagement: ${studentData.lms_engagement_score}/100 (${getEngagementLevel(studentData.lms_engagement_score)})
- Dropout Risk: ${studentData.dropout_risk}
- Predicted Performance: ${studentData.predicted_performance}

AVAILABLE COURSES: ${courses.join(', ')}

PLATFORM NAVIGATION GUIDE:
- Dashboard: View performance and institute progress charts after login
- Analysis Page: http://localhost:5173/analysis (for new students to get predictions)
- Settings: http://localhost:5173/settings (to change password)
- Send Feedback: Available in sidebar to contact admin/teachers
- Notifications: Check sidebar for admin announcements
- Login/Register: http://localhost:5173/login or http://localhost:5173/register

PLATFORM WORKFLOW:
1. Create Account → Set up profile
2. Input Data → Add academic records
3. Get Predictions → AI analyzes performance and dropout risk
4. Take Action → Use recommendations to improve

RESPONSE GUIDELINES:
1. LENGTH: Keep responses concise for simple queries (2-3 sentences). Provide detailed explanations only when necessary (max 1-2 paragraphs).

2. PERSONALIZATION: Use the student's name sparingly - only in important moments, not in every response.

3. SCOPE: You ONLY discuss:
   - Educational guidance and career counseling
   - Course recommendations and study tips
   - Platform navigation and features
   - Academic performance analysis
   - Learning strategies and resources

4. RESTRICTIONS: If asked about non-educational topics (sports, politics, cooking, entertainment, etc.), politely respond:
   "I'm specifically designed for educational guidance and career counseling. I can help you with course selection, study strategies, performance improvement, and navigating the EduNex AI platform. What educational topic can I assist you with?"

5. PRIORITY RESPONSES:
   ${studentData.dropout_risk !== 'Low' ? `- URGENT: Address ${studentData.dropout_risk} dropout risk with specific action steps` : ''}
   ${studentData.attendance_percentage < 75 ? '- Address low attendance with practical solutions' : ''}
   ${studentData.lms_engagement_score < 60 ? '- Suggest ways to increase platform engagement' : ''}
   ${studentData.previous_failures > 0 ? '- Provide extra emotional support and recovery strategies' : ''}

6. TEACHING CAPABILITY: When students ask to learn specific subjects, provide:
   - Brief, clear explanations
   - Key concepts and fundamentals
   - Practice problems or examples
   - Recommended resources from available courses

7. CONVERSATION STYLE:
   - Be warm but professional
   - Avoid repetitive greetings
   - Focus on actionable advice
   - Use encouraging tone without being overly cheerful

Student's Question: ${userMessage}

Respond appropriately based on the guidelines above. Keep the response focused, helpful, and within your educational scope.`;
};



// ===================== ENHANCED TEACHER FUNCTIONS WITH CONTEXT =====================

// Store conversation context
let conversationContext = {
  lastStudent: null,
  lastMonth: null,
  lastTopic: null
};

// Get teacher's students data from CSV with monthly filtering
const getTeacherStudentsData = (teacherName, batchId, course, monthFilter = null) => {
  return new Promise((resolve, reject) => {
    const allStudents = [];
    const monthsSet = new Set();
    const studentsByMonth = {};
    
    // Define risk thresholds - SAME AS teacherRoutes
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
    
    fs.createReadStream("data/all_batches.csv")
      .pipe(csv())
      .on("data", (row) => {
        if (
          row.teacher_name === teacherName &&
          row.batch_id === batchId &&
          row.course === course
        ) {
          const month = row.month || "Unknown";
          monthsSet.add(month);
          
          if (!studentsByMonth[month]) {
            studentsByMonth[month] = [];
          }
          
          // Parse values
          const gpa = parseFloat(row.gpa) || 0;
          const attendance = parseFloat(row.attendance_percentage) || 0;
          const lms = parseFloat(row.lms_engagement_score) || 0;
          const assignments = parseInt(row.assignments_completed) || 0;
          const quizzes = parseInt(row.quizzes_completed) || 0;
          const failures = parseInt(row.previous_failures) || 0;
          
          // Calculate risk - EXACT SAME LOGIC AS teacherRoutes
          let predicted_risk = "Low";
          if (gpa < thresholds.Medium.gpa || attendance < thresholds.Medium.attendance_percentage) {
            predicted_risk = "Medium";
          }
          if (gpa < thresholds.Low.gpa / 2 || attendance < thresholds.Medium.attendance_percentage / 2) {
            predicted_risk = "High";
          }
          
          // Calculate risk reasons - EXACT SAME AS teacherRoutes
          const reasons = [];
          if (attendance < 50) reasons.push("Low attendance");
          if (gpa < 2) reasons.push("Low GPA");
          if (lms < 60) reasons.push("Low LMS activity");
          if (assignments < 10) reasons.push("Incomplete assignments");
          if (quizzes < 5) reasons.push("Low quiz participation");
          if (failures > 0) reasons.push(`Previous Failures: ${failures}`);
          
          const studentData = {
            student_id: row.student_id,
            name: row.Name,
            gpa: gpa,
            attendance: attendance,
            attendance_rate: parseFloat(row.attendance_rate) || 0,
            assignments: assignments,
            quizzes: quizzes,
            lms_score: lms,
            dropout_risk: predicted_risk, // Use calculated risk
            risk_reason: reasons.length > 0 ? reasons.join(", ") : "No major issues",
            performance: row.predicted_performance || "Unknown",
            previous_failures: failures,
            hours_studied: parseFloat(row.hours_studied_per_week) || 0,
            course: row.course,
            batch: row.batch_id,
            teacher: row.teacher_name,
            month: month,
            study_hours_category: row.study_hours_category || "Unknown",
            attendance_category: row.attendance_category || "Unknown",
            engagement_category: row.engagement_category || "Unknown"
          };
          
          studentsByMonth[month].push(studentData);
          
          if (!monthFilter || month === monthFilter) {
            allStudents.push(studentData);
          }
        }
      })
      .on("end", () => {
        resolve({
          students: allStudents,
          studentsByMonth: studentsByMonth,
          months: Array.from(monthsSet).sort((a, b) => {
            const monthOrder = ["January","February","March","April","May","June",
                              "July","August","September","October","November","December"];
            return monthOrder.indexOf(a) - monthOrder.indexOf(b);
          }),
          totalStudents: allStudents.length,
          currentMonth: monthFilter
        });
      })
      .on("error", reject);
  });
};

// Calculate comprehensive statistics
const calculateDetailedStats = (students) => {
  if (!students || students.length === 0) {
    return null;
  }
  
  const total = students.length;
  
  const avgGpa = (students.reduce((sum, s) => sum + s.gpa, 0) / total).toFixed(2);
  const avgAttendance = (students.reduce((sum, s) => sum + s.attendance, 0) / total).toFixed(1);
  const avgAssignments = (students.reduce((sum, s) => sum + s.assignments, 0) / total).toFixed(1);
  const avgQuizzes = (students.reduce((sum, s) => sum + s.quizzes, 0) / total).toFixed(1);
  const avgLmsScore = (students.reduce((sum, s) => sum + s.lms_score, 0) / total).toFixed(1);
  const avgStudyHours = (students.reduce((sum, s) => sum + s.hours_studied, 0) / total).toFixed(1);
  
  // Risk distribution based on calculated risk
  const riskDistribution = {
    high: students.filter(s => s.dropout_risk === "High").length,
    medium: students.filter(s => s.dropout_risk === "Medium").length,
    low: students.filter(s => s.dropout_risk === "Low").length
  };
  
  const performanceDistribution = {
    excellent: students.filter(s => s.performance === "Excellent").length,
    aboveAverage: students.filter(s => s.performance === "Above Average").length,
    average: students.filter(s => s.performance === "Average").length,
    belowAverage: students.filter(s => s.performance === "Below Average").length
  };
  
  const performanceWithPercentage = {
    excellent: {
      count: performanceDistribution.excellent,
      percentage: ((performanceDistribution.excellent / total) * 100).toFixed(1)
    },
    aboveAverage: {
      count: performanceDistribution.aboveAverage,
      percentage: ((performanceDistribution.aboveAverage / total) * 100).toFixed(1)
    },
    average: {
      count: performanceDistribution.average,
      percentage: ((performanceDistribution.average / total) * 100).toFixed(1)
    },
    belowAverage: {
      count: performanceDistribution.belowAverage,
      percentage: ((performanceDistribution.belowAverage / total) * 100).toFixed(1)
    }
  };
  
  const studentsWithFailures = students.filter(s => s.previous_failures > 0);
  const totalFailures = students.reduce((sum, s) => sum + s.previous_failures, 0);
  
  const attendanceCategories = {
    excellent: students.filter(s => s.attendance >= 90).length,
    good: students.filter(s => s.attendance >= 75 && s.attendance < 90).length,
    average: students.filter(s => s.attendance >= 60 && s.attendance < 75).length,
    poor: students.filter(s => s.attendance < 60).length
  };
  
  const assignmentCompletion = {
    complete: students.filter(s => s.assignments >= 15).length,
    partial: students.filter(s => s.assignments >= 10 && s.assignments < 15).length,
    low: students.filter(s => s.assignments < 10).length
  };
  
  return {
    totalStudents: total,
    averages: {
      gpa: avgGpa,
      attendance: avgAttendance,
      assignments: avgAssignments,
      quizzes: avgQuizzes,
      lmsScore: avgLmsScore,
      studyHours: avgStudyHours
    },
    riskDistribution,
    performanceDistribution,
    performanceWithPercentage,
    attendanceCategories,
    assignmentCompletion,
    studentsWithFailures: studentsWithFailures.length,
    totalFailures,
    failureRate: ((studentsWithFailures.length / total) * 100).toFixed(1)
  };
};

// Enhanced teacher prompt
const createEnhancedTeacherPrompt = (teacherData, studentsData, userMessage) => {
  const { students, studentsByMonth, months, totalStudents, currentMonth } = studentsData;
  
  if (totalStudents === 0 && !currentMonth) {
    return `You are an AI teaching assistant. No students found for Batch ${teacherData.batch_id} in ${teacherData.courses} course.`;
  }

  const overallStats = calculateDetailedStats(students);
  
  // Pattern matching for student queries
  const studentPatterns = [
    /(?:tell me about|information about|details of|performance of|show me|check|analyze|report on|status of|data of|record of)\s+([\w\s]+?)(?:\s+in\s+(?:january|february|march|april|may|june|july|august|september|october|november|december))?\s*(?:\?|$|\.|\s+performance|\s+details|\s+risk|\s+status|\s+history|\s+record)/i,
    /(?:student\s+)?(?:history|record|data|information)\s+(?:of\s+)?([\w\s]+?)(?:\s+in\s+(?:january|february|march|april|may|june|july|august|september|october|november|december))?/i,
    /([\w\s]+?)\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+(?:history|record|performance|data)/i,
    /how is ([\w\s]+) (?:doing|performing)/i,
    /student ([\w\s]+)/i,
    /([\w\s]+) (?:performance|details|status|progress|report)/i,
    /what about ([\w\s]+)/i,
    /([\w\s]+)'s (?:performance|grades|attendance|status|lms|assignments|quizzes)/i,
    /^([\w\s]+)$/i
  ];

  // Check if asking for dropout/risk students
  const askingDropoutRisk = /(?:dropout|at risk|high risk|risk students|struggling|top\s*\d*\s*dropout|failing)/i.test(userMessage);
  const askingTopDropout = /(?:top\s*(\d+)?\s*(?:dropout|risk|struggling)|(\d+)?\s*(?:highest risk|most at risk))/i.test(userMessage);
  
  // Handle dropout risk queries
  let dropoutRiskResponse = "";
  if (askingDropoutRisk || askingTopDropout) {
    const highRiskStudents = students
      .filter(s => s.dropout_risk === "High")
      .sort((a, b) => {
        if (a.gpa !== b.gpa) return a.gpa - b.gpa;
        return a.attendance - b.attendance;
      });
    
    const match = userMessage.match(/top\s*(\d+)|(\d+)\s*(?:highest|most)/i);
    const topCount = match ? (parseInt(match[1] || match[2]) || 5) : 5;
    const topHighRisk = highRiskStudents.slice(0, topCount);
    
    if (topHighRisk.length > 0) {
      dropoutRiskResponse = `Here are the top ${topHighRisk.length} students at high dropout risk:\n\n`;
      topHighRisk.forEach((student, index) => {
        dropoutRiskResponse += `${index + 1}. ${student.name} (Student ID: ${student.student_id})\n`;
        dropoutRiskResponse += `   Month: ${student.month}\n`;
        dropoutRiskResponse += `   Risk Level: ${student.dropout_risk}\n`;
        dropoutRiskResponse += `   GPA: ${student.gpa.toFixed(2)}, Attendance: ${student.attendance}%, LMS Score: ${student.lms_score}\n`;
        dropoutRiskResponse += `   Assignments: ${student.assignments}, Quizzes: ${student.quizzes}\n`;
        dropoutRiskResponse += `   Previous Failures: ${student.previous_failures}\n`;
        dropoutRiskResponse += `   Risk Reasons: ${student.risk_reason}\n`;
        dropoutRiskResponse += `   Recommended Action: ${
          student.attendance < 50 ? 'Immediate attendance intervention required' :
          student.gpa < 2.0 ? 'Academic support and tutoring needed' :
          student.previous_failures > 0 ? 'Remedial support for failed subjects' :
          'Close monitoring and regular check-ins'
        }\n\n`;
      });
      
      // Add medium risk students if needed
      if (askingTopDropout && topHighRisk.length < topCount) {
        const mediumRiskStudents = students
          .filter(s => s.dropout_risk === "Medium")
          .sort((a, b) => a.gpa - b.gpa)
          .slice(0, topCount - topHighRisk.length);
        
        if (mediumRiskStudents.length > 0) {
          dropoutRiskResponse += `\nAdditional Medium Risk Students:\n`;
          mediumRiskStudents.forEach((student, index) => {
            dropoutRiskResponse += `${topHighRisk.length + index + 1}. ${student.name} - Risk: ${student.dropout_risk}, GPA: ${student.gpa.toFixed(2)}, Reasons: ${student.risk_reason}\n`;
          });
        }
      }
    } else {
      dropoutRiskResponse = "Good news! No students are currently at high dropout risk. However, continue monitoring medium-risk students.";
    }
  }

  // Check for follow-up questions
  let isFollowUp = false;
  let contextStudent = null;
  let requestedMonth = null;
  
  const monthNames = ["january","february","march","april","may","june","july","august","september","october","november","december"];
  const lowerMessage = userMessage.toLowerCase();
  
  for (const month of monthNames) {
    if (lowerMessage.includes(month)) {
      requestedMonth = month.charAt(0).toUpperCase() + month.slice(1);
      break;
    }
  }

  if (conversationContext.lastStudent && 
      /(?:and\s+)?(?:his|her|their)?\s*(?:lms|attendance|assignments|quizzes|gpa|risk|failures|study hours)/i.test(userMessage)) {
    isFollowUp = true;
    contextStudent = conversationContext.lastStudent;
  }

  // Check for specific student
  let specificStudentInfo = "";
  
  if (!isFollowUp && !askingDropoutRisk) {
    for (const pattern of studentPatterns) {
      const match = userMessage.match(pattern);
      if (match) {
        const searchName = match[1].trim().toLowerCase();
        
        let searchPool = students;
        if (requestedMonth) {
          searchPool = studentsByMonth[requestedMonth] || students;
        } else if (currentMonth && studentsByMonth[currentMonth]) {
          searchPool = studentsByMonth[currentMonth];
        }
        
        const student = searchPool.find(s => 
          s.name.toLowerCase().includes(searchName) ||
          searchName.includes(s.name.toLowerCase()) ||
          s.student_id.toLowerCase() === searchName
        );
        
        if (student) {
          conversationContext.lastStudent = student;
          conversationContext.lastMonth = student.month;
          contextStudent = student;
          break;
        }
      }
    }
  }

  // Generate response for specific student
  if (contextStudent) {
    const askingLMS = /lms|engagement/i.test(userMessage);
    const askingAttendance = /attendance/i.test(userMessage);
    const askingAssignments = /assignment/i.test(userMessage);
    const askingQuizzes = /quiz/i.test(userMessage);
    const askingRisk = /risk|dropout/i.test(userMessage);
    const askingFailures = /failure/i.test(userMessage);
    const askingGPA = /gpa|grade/i.test(userMessage);
    
    if (isFollowUp && (askingLMS || askingAttendance || askingAssignments || askingQuizzes || askingRisk || askingFailures || askingGPA)) {
      let response = "";
      
      if (askingLMS) {
        response = `${contextStudent.name}'s LMS engagement score is ${contextStudent.lms_score}/100, which indicates ${
          contextStudent.lms_score >= 80 ? 'highly engaged participation' : 
          contextStudent.lms_score >= 60 ? 'moderate engagement' : 
          'low engagement that needs improvement'
        }. ${contextStudent.lms_score < 60 ? 'I recommend encouraging more platform interaction through daily check-ins.' : ''}`;
      } else if (askingRisk) {
        response = `${contextStudent.name}'s dropout risk is ${contextStudent.dropout_risk}. Risk factors: ${contextStudent.risk_reason}. ${
          contextStudent.dropout_risk === 'High' ? 'Immediate intervention required - schedule a one-on-one meeting.' :
          contextStudent.dropout_risk === 'Medium' ? 'Monitor closely and provide additional support.' :
          'Currently stable but maintain regular check-ins.'
        }`;
      }
      
      specificStudentInfo = response;
    } else {
      let monthlyProgression = "";
      if (months.length > 1) {
        const studentAllMonths = [];
        months.forEach(month => {
          const monthStudent = studentsByMonth[month]?.find(s => s.student_id === contextStudent.student_id);
          if (monthStudent) {
            studentAllMonths.push(`${month}: Performance is ${monthStudent.performance}, GPA is ${monthStudent.gpa.toFixed(2)}, Attendance is ${monthStudent.attendance}%, Risk: ${monthStudent.dropout_risk}`);
          }
        });
        if (studentAllMonths.length > 1) {
          monthlyProgression = `\n\nProgression across months:\n${studentAllMonths.join('\n')}`;
        }
      }
      
      specificStudentInfo = `Here's ${contextStudent.name}'s complete academic profile for ${contextStudent.month}:

Performance Category: ${contextStudent.performance}
GPA: ${contextStudent.gpa.toFixed(2)}/4.0
Attendance Rate: ${contextStudent.attendance}%
Assignments Completed: ${contextStudent.assignments}
Quizzes Completed: ${contextStudent.quizzes}
LMS Engagement Score: ${contextStudent.lms_score}/100
Dropout Risk Level: ${contextStudent.dropout_risk}
Risk Reasons: ${contextStudent.risk_reason}
Study Hours per Week: ${contextStudent.hours_studied} hours
Previous Failures: ${contextStudent.previous_failures}

${contextStudent.dropout_risk === "High" || contextStudent.performance === "Below Average" ? 
`\nImmediate Actions Needed:
${contextStudent.dropout_risk === "High" ? '- Schedule one-on-one counseling session\n' : ''}${contextStudent.attendance < 60 ? '- Implement attendance improvement plan\n' : ''}${contextStudent.gpa < 2.5 ? '- Provide additional tutoring support\n' : ''}${contextStudent.assignments < 10 ? '- Follow up on assignment submissions\n' : ''}${contextStudent.lms_score < 50 ? '- Encourage more platform engagement\n' : ''}` : 
contextStudent.performance === "Excellent" ? '\nThis student is performing excellently. Continue current support.' :
'\nStudent is performing satisfactorily. Monitor progress regularly.'}${monthlyProgression}`;
    }
  }

  // Performance distribution query
  let performanceQueryResponse = "";
  if (/performance distribution|distribution|how many excellent|how many above average|how many below average/i.test(userMessage)) {
    performanceQueryResponse = `The performance distribution for ${currentMonth || 'all months'} shows: Excellent students are ${overallStats.performanceWithPercentage.excellent.count} (${overallStats.performanceWithPercentage.excellent.percentage}%), Above Average students are ${overallStats.performanceWithPercentage.aboveAverage.count} (${overallStats.performanceWithPercentage.aboveAverage.percentage}%), Average students are ${overallStats.performanceWithPercentage.average.count} (${overallStats.performanceWithPercentage.average.percentage}%), and Below Average students are ${overallStats.performanceWithPercentage.belowAverage.count} (${overallStats.performanceWithPercentage.belowAverage.percentage}%).`;
  }

  // Get high-risk and top performing students
  const actualHighRiskStudents = students
    .filter(s => s.dropout_risk === "High")
    .sort((a, b) => a.gpa - b.gpa)
    .slice(0, 5)
    .map(s => `${s.name} (GPA: ${s.gpa.toFixed(2)}, Attendance: ${s.attendance}%, Risk: ${s.dropout_risk}, Reasons: ${s.risk_reason})`);
    
  const topPerformers = students
    .filter(s => s.performance === "Excellent" || s.performance === "Above Average")
    .sort((a, b) => b.gpa - a.gpa)
    .slice(0, 5)
    .map(s => `${s.name} (GPA: ${s.gpa.toFixed(2)}, Performance: ${s.performance}, Attendance: ${s.attendance}%)`);

  // Generate main prompt
  return `You are a helpful AI teaching assistant for Professor ${teacherData.name}. You have access to detailed student data for Batch ${teacherData.batch_id} in ${teacherData.courses}.

IMPORTANT CONTEXT:
${conversationContext.lastStudent ? `Previous conversation was about: ${conversationContext.lastStudent.name} (${conversationContext.lastStudent.month})` : ''}
Current query: ${userMessage}

CLASS OVERVIEW:
Total Students: ${totalStudents}
Average GPA: ${overallStats.averages.gpa}
Average Attendance: ${overallStats.averages.attendance}%
High Risk Students: ${overallStats.riskDistribution.high}
Medium Risk Students: ${overallStats.riskDistribution.medium}
Low Risk Students: ${overallStats.riskDistribution.low}
Available Months: ${months.join(', ')}

${dropoutRiskResponse || specificStudentInfo || performanceQueryResponse}

${!dropoutRiskResponse && !specificStudentInfo && !performanceQueryResponse ? `
HIGH RISK STUDENTS (with reasons):
${actualHighRiskStudents.length > 0 ? actualHighRiskStudents.join('\n') : 'No high-risk students identified'}

TOP PERFORMERS:
${topPerformers.length > 0 ? topPerformers.join('\n') : 'No top performers identified'}
` : ''}

CONVERSATION GUIDELINES:
1. Use natural language without any markdown formatting or asterisks
2. No bullet points with asterisks - use simple dashes (-) or numbers
3. Remember context from previous questions
4. Always show dropout risk with reasons
5. Be conversational and helpful
6. Provide specific data when available
7. Keep responses warm and professional

${!specificStudentInfo && !performanceQueryResponse && !dropoutRiskResponse ? `
To help you better, you can ask me:
- About specific students: "Tell me about [student name]"
- Dropout risk: "Show me top 5 dropout risk students" or "Who are at high risk?"
- Performance: "What is the performance distribution?"
- Follow-up questions: "and their LMS score?" or "what about attendance?"
` : ''}`;
};



// ===================== MAIN CHAT HANDLER =====================

exports.chatWithGemini = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // User data from your protect middleware (req.user)
    const userRole = req.user.role;
    const userId = req.user.id;
    
    console.log("Chat Request:", {
      role: userRole,
      userId: userId,
      message: message.substring(0, 50) + "..."
    });

    let personalizedPrompt;
    let responseData = { 
      role: userRole,
      timestamp: new Date()
    };

    // ========== HANDLE STUDENT ROLE ==========
    if (userRole === 'student') {
      const student_id = req.user.student_id;
      
      if (!student_id) {
        return res.status(400).json({ error: "Student ID not found in token" });
      }

      // Get student data from MongoDB
      const studentData = await getStudentData(student_id);
      if (!studentData) {
        return res.status(404).json({ error: "Student data not found in database" });
      }

      console.log("Student Data Found:", {
        name: studentData.name,
        student_id: studentData.student_id,
        dropout_risk: studentData.dropout_risk,
        gpa: studentData.gpa
      });

      // Create student prompt
      personalizedPrompt = createPersonalizedPrompt(studentData, message);

      // Add student info to response
      responseData.studentName = studentData.name;
      responseData.studentStats = {
        dropoutRisk: studentData.dropout_risk,
        performance: studentData.predicted_performance,
        attendance: studentData.attendance_percentage,
        gpa: studentData.gpa
      };
    } 


    // ========== UPDATED MAIN CHAT HANDLER - Teacher Section Only ==========
// In the teacher section of exports.chatWithGemini, replace the teacher handling part:

else if (userRole === 'teacher') {
  const teacherName = req.user.name;
  const batchId = req.user.batch_id;
  const course = req.user.courses;

  if (!teacherName || !batchId || !course) {
    return res.status(400).json({ 
      error: "Teacher information incomplete. Please ensure batch_id and courses are set.",
      providedData: {
        name: teacherName,
        batch_id: batchId,
        courses: course
      }
    });
  }

  console.log("Teacher Request:", {
    name: teacherName,
    batch: batchId,
    course: course
  });

  // Check if teacher is asking for specific month
  let requestedMonth = null;
  const monthNames = ["January","February","March","April","May","June",
                     "July","August","September","October","November","December"];
  
  // Check message for month references
  const lowerMessage = message.toLowerCase();
  for (const month of monthNames) {
    if (lowerMessage.includes(month.toLowerCase())) {
      requestedMonth = month;
      break;
    }
  }

  // Get students data from CSV with optional month filter
  const studentsData = await getTeacherStudentsData(teacherName, batchId, course, requestedMonth);
  
  if (studentsData.students.length === 0 && !requestedMonth) {
    return res.json({
      role: userRole,
      reply: `No students found for Batch ${batchId} in ${course} course. Please check if the batch and course information is correct.`,
      teacherName: teacherName,
      classStats: {
        totalStudents: 0,
        avgGpa: "0",
        avgAttendance: "0",
        highRiskCount: 0,
        mediumRiskCount: 0,
        lowRiskCount: 0
      }
    });
  }

  console.log(`Found ${studentsData.totalStudents} students for teacher ${teacherName}${requestedMonth ? ` in ${requestedMonth}` : ''}`);

  // Create enhanced teacher prompt
  personalizedPrompt = createEnhancedTeacherPrompt(req.user, studentsData, message);

  // Calculate comprehensive statistics
  const stats = calculateDetailedStats(studentsData.students);
  
  responseData.teacherName = teacherName;
  responseData.currentMonth = requestedMonth;
  responseData.availableMonths = studentsData.months;
  responseData.classStats = {
    totalStudents: studentsData.totalStudents,
    avgGpa: stats?.averages.gpa || "0",
    avgAttendance: stats?.averages.attendance || "0",
    avgAssignments: stats?.averages.assignments || "0",
    avgQuizzes: stats?.averages.quizzes || "0",
    avgLmsScore: stats?.averages.lmsScore || "0",
    highRiskCount: stats?.riskDistribution.high || 0,
    mediumRiskCount: stats?.riskDistribution.medium || 0,
    lowRiskCount: stats?.riskDistribution.low || 0,
    performanceDistribution: stats?.performanceDistribution || {},
    attendanceBreakdown: stats?.attendanceCategories || {},
    failureRate: stats?.failureRate || "0"
  };
} 

    // ========== HANDLE OTHER ROLES ==========
    else {
      return res.status(403).json({ 
        error: "Access denied. Only students and teachers can use the AI chat assistant.",
        role: userRole
      });
    }

    // Generate AI response using Gemini
    console.log("Generating AI response...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(personalizedPrompt);
    const reply = result.response.text();

    // Send successful response
    responseData.reply = reply;
    responseData.success = true;
    
    console.log("Response sent successfully");
    res.json(responseData);

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ 
      error: "Failed to process your request. Please try again.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Optional: Save chat history for analytics
const saveChatHistory = async (user_id, role, message, response) => {
  try {
    // Uncomment and implement if you have a ChatHistory model
    // const ChatHistory = require("../models/ChatHistory");
    // await ChatHistory.create({
    //   user_id,
    //   role,
    //   message,
    //   response,
    //   timestamp: new Date()
    // });
    console.log("Chat history saved");
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
};











// // controllers/chatController.js
// exports.chatWithGemini = async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     // Student data middleware se aya (req.user)
//     const student_id = req.user.student_id;
//     if (!student_id) {
//       return res.status(400).json({ error: "Student ID not found in token" });
//     }

//     // Get student data
//     const studentData = await getStudentData(student_id);
//     if (!studentData) {
//       return res.status(404).json({ error: "Student data not found" });
//     }

//     console.log("Student Data Found:", {
//       name: studentData.name,
//       student_id: studentData.student_id,
//       dropout_risk: studentData.dropout_risk,
//     });

//     // Personalized prompt
//     const personalizedPrompt = createPersonalizedPrompt(studentData, message);

//     // Gemini response
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
//     const result = await model.generateContent(personalizedPrompt);
//     const reply = result.response.text();

//     res.json({
//       reply,
//       studentName: studentData.name,
//       role: req.user.role,
//       studentStats: {
//         dropoutRisk: studentData.dropout_risk,
//         performance: studentData.predicted_performance,
//         attendance: studentData.attendance_percentage,
//       },
//     });
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     res.status(500).json({ error: "Failed to process your request" });
//   }
// };


// // Optional: Save chat history for future analysis
// const saveChatHistory = async (student_id, message, response) => {
//   // Implement if you want to save chat history
//   // const ChatHistory = require("../models/ChatHistory");
//   // await ChatHistory.create({
//   //   student_id,
//   //   message,
//   //   response,
//   //   timestamp: new Date()
//   // });
// };






















// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const dotenv =require("dotenv");

// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// exports.chatWithGemini = async (req, res) => {
//   const { message } = req.body;

//   if (!message) return res.status(400).json({ error: "Message is required" });

//   try {
//     // Model select karna hoga
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     // Response generate karo
//     const result = await model.generateContent(message);

//     const reply = result.response.text();
//     res.json({ reply });
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     res.status(500).json({ error: "Gemini API failed" });
//   }
// };
