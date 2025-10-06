import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

const Setting = () => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    username: '',
    role: ''
  });

  useEffect(() => {
    const adminToken = localStorage.getItem('admin');
    const teacherToken = localStorage.getItem('teacher');
    const studentToken = localStorage.getItem('student');
  
    const token = adminToken || teacherToken || studentToken;
  
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUserData({
          name: decoded.name || '',
          email: decoded.email || '',
          username: decoded.username || '',
          role: decoded.role || ''
        });
      }
    }
  }, []);
  

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChangePassword = async () => {
    const { current, new: newPassword, confirm } = passwords;

    if (!current || !newPassword || !confirm) {
      toast.error('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirm) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
      toast.warning('Password must be at least 8 characters and include numbers and symbols.');
      return;
    }

    const adminToken = localStorage.getItem('admin');
    const teacherToken = localStorage.getItem('teacher');
    const studentToken = localStorage.getItem('student');
  
    const token = adminToken || teacherToken || studentToken;
    if (!token) {
      toast.error('You are not logged in.');
      return;
    }

    try {
      const adminToken = localStorage.getItem('admin');
      const teacherToken = localStorage.getItem('teacher');
      const studentToken = localStorage.getItem('student');
      const tokenString = adminToken || teacherToken || studentToken;

  if (!tokenString) return console.error("No token found!");

  const adminData = JSON.parse(tokenString); 
  const token = adminData.token;
      const response = await axios.put(
        'http://localhost:8000/api/auth/changepassword',
        {
          currentPassword: current,
          newPassword: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Password updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update password';
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all hover:shadow-md">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>
          </div>
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled
                  id="name"
                  value={userData.name}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  disabled
                  value={userData.email}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  disabled
                  id="role"
                  value={userData.role}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  readOnly
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all hover:shadow-md">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>
          </div>
          <form className="space-y-5">
            {['current', 'new', 'confirm'].map((field) => (
              <div key={field}>
                <label htmlFor={`${field}Password`} className="block text-sm font-medium text-gray-700 mb-1">
                  {field === 'current' ? 'Current Password' : field === 'new' ? 'New Password' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword[field] ? 'text' : 'password'}
                    id={`${field}Password`}
                    placeholder={`Enter your ${field === 'confirm' ? 'confirmation' : field} password`}
                    value={passwords[field]}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        [field]: e.target.value
                      }))
                    }
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(field)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword[field] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
                {field === 'new' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long with numbers and symbols.
                  </p>
                )}
              </div>
            ))}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleChangePassword}
                className="px-6 py-2.5 bg-[#9078e2] hover:bg-[#9078e2] text-white font-medium rounded-lg"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Setting;