
import axios from "axios";

// Create Axios instance
const studentinput = axios.create({
  baseURL: "http://localhost:8000/api/student", // Updated base URL here
  headers: {
    "Content-Type": "application/json",
  },
});

// MongoDB me save + prediction ke lia
export const saveStudentAnalysis = async (studentData) => {
  try {
    const response = await studentinput.post(`/studentanalysis`, studentData);
    return response.data;
  } catch (error) {
    console.error("Error saving student analysis:", error);
    throw error;
  }
};