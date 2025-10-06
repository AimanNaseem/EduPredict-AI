import axios from "axios";

// Create Axios instance
const auth = axios.create({
  baseURL: "http://localhost:8000/api/auth", // Updated base URL here
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Create Dummy Roles (Seeder)
export const create_credentials = async () => {
  try {
    const response = await auth.get("/dummyroles");
    return response;
  } catch (error) {
    return error.response;
  }
};

// ✅ Unified Login API
export const login = async (data) => {
  // data = { email, password, role }
  try {
    const response = await auth.post("/login", data);
    return response;
  } catch (error) {
    return error.response;
  }
};

// ✅ Unified Register API
export const register = async (data) => {
  // data = { email, password, role, student_id?, courses? }
  try {
    const response = await auth.post("/register", data);
    return response;
  } catch (error) {
    return error.response;
  }
};

// ✅ Logout API using blacklist
export const logout = async (token) => {
  try {
    const response = await auth.post("/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

// ✅ Example: Protected route access (optional utility)
export const getProtectedData = async (token, allowedRole) => {
  try {
    const response = await auth.get("/protected-route", {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-role": allowedRole,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};




