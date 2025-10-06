import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAttendenceStudentIDandCourse = async (
  student,
  course,
  limit
) => {
  let response;
  try {
    response = await api.get(
      `/attendance/student/${student}/${course}/${limit}`
    );
  } catch (error) {
    return error;
  }
  return response;
};

export const predictStudentPerformance = async (studentData) => {
  try {
    const response = await api.post(`/predict_user`, studentData)
    return response.data
  } catch (error) {
    console.error('Error predicting student performance:', error)
    throw error
  }
}

// Dataset Predict
export const predictStudentDropout = async (file, modelName) => {
  try {
    const formData = new FormData();
    formData.append('file', file); 
    formData.append('model_name', modelName);

    const response = await api.post('/predict_dropout', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    console.error('Error predicting student dropout:', error);
    throw error;
  }
};

// -------------------------------------------
export const fetch_attendance_table = async () => {
  let response;
  try {
    response = await api.get(`/attendance_status`);
  } catch (error) {
    return error;
  }
  return response;
};

export const perform_attendance_trend_analysis = async (limit) => {
  let response;
  try {
    response = await api.get(`/perform_attendance_trend_analysis/${limit}`);
  } catch (error) {
    return error;
  }
  return response;
};

// -------------------------------------------
export const fetch_teacher_analytics = async (token) => {
  let response;
  try {
    response = await api.get(`/teacher/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Token include
      },
    });
  } catch (error) {
    return error;
  }
  return response;
};

export const attendance_course_performance = async () => {
  let response;
  try {
    response = await api.get(`/attendance_course_performance`);
  } catch (error) {
    return error;
  }
  return response;
};
export const attendance_statistics = async () => {
  let response;
  try {
    response = await api.get(`/attendance_statistics`);
  } catch (error) {
    return error;
  }
  return response;
};

export const get_student_probabilities = async () => {
  return await api.get("/get_student_probabilities");
};

export const get_student_performance = async () => {
  let response;
  try {
    response = await api.get(`/student-performance`);
  } catch (error) {
    return error;
  }
  return response;
};
export const get_action_type_distribution = async () => {
  let response;
  try {
    response = await api.get(`/action-distribution`);
  } catch (error) {
    return error;
  }
  return response;
};
export const get_course_engagement_metrics = async () => {
  let response;
  try {
    response = await api.get(`/course-engagement`);
  } catch (error) {
    return error;
  }
  return response;
};

export const demographic_summary = async () => {
  let response;
  try {
    response = await api.get(`/demographic-summary`);
  } catch (error) {
    return error;
  }
  return response;
};
export const educational_insights = async () => {
  let response;
  try {
    response = await api.get(`/educational-insights`);
  } catch (error) {
    return error;
  }
  return response;
};
export const risk_analysis = async () => {
  let response;
  try {
    response = await api.get(`/risk-analysis`);
  } catch (error) {
    return error;
  }
  return response;
};
export const quiz_summary = async () => {
  let response;
  try {
    response = await api.get(`/quiz-summary`);
  } catch (error) {
    return error;
  }
  return response;
};
export const student_stats = async () => {
  let response;
  try {
    response = await api.get(`/students_statistics`);
  } catch (error) {
    return error;
  }
  return response;
};

export const student_data = async (id) => {
  let response;
  try {
    response = await api.get(`/student/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};

export const student_attendance_trend_analysis = async (id, limit) => {
  let response;
  try {
    response = await api.get(`/student_attendance_trends/${id}/${limit}`);
  } catch (error) {
    return error;
  }
  return response;
};

export const student_course_wise_analysis = async (id) => {
  let response;
  try {
    response = await api.get(`/student_course_wise/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};

// services.js ya api.js me add karein
export const fetch_assignment_summary = async () => {
  let response;
  try {
    response = await api.get(`/assignment-summary`);
  } catch (error) {
    return error;
  }
  return response;
};

export const teacher_analysis = async () => {
  let response;
  try {
    response = await api.get(`/teacher`);
  } catch (error) {
    return error;
  }
  return response;
};
export const academic_performance = async () => {
  let response;
  try {
    response = await api.get(`/academic-performance`);
  } catch (error) {
    return error;
  }
  return response;
};
export const dropout_risk_percentage = async () => {
  let response;
  try {
    response = await api.get(`/dropout_risk_percentage`);
  } catch (error) {
    return error;
  }
  return response;
};
export const dropout_risk_by_course = async () => {
  let response;
  try {
    response = await api.get(`/dropout_risk_by_course`);
  } catch (error) {
    return error;
  }
  return response;
};
export const course_demand = async () => {
  let response;
  try {
    response = await api.get(`/course_demand`);
  } catch (error) {
    return error;
  }
  return response;
};
