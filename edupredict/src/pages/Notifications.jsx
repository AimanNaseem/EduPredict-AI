import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const NotificationPopup = ({ onClose }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  const getTokenFromStorage = () => {
    const admin = localStorage.getItem("admin");
    const teacher = localStorage.getItem("teacher");
    const student = localStorage.getItem("student");

    const raw = admin || teacher || student;
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      return parsed.token;
    } catch (err) {
      return raw; // fallback
    }
  };

  // Fetch all feedbacks and filter only 'admin' role
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = getTokenFromStorage();
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:8000/api/feedback", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const all = res.data.feedbacks || res.data;
        const onlyAdmins = all.filter(fb => fb.role?.toLowerCase() === "admin");
        setFeedbacks(onlyAdmins);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>

          {feedbacks.length === 0 ? (
            <p className="text-gray-500">No new notifications.</p>
          ) : (
            <ul
              className="space-y-4 overflow-y-auto overflow-x-hidden pr-2"
              style={{ wordBreak: "break-word" }}
            >
              {feedbacks.map((fb, index) => (
                <li
                  key={fb._id || index}
                  className="bg-gray-100 rounded-lg p-4 shadow-sm hover:bg-gray-200 transition text-sm"
                  style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <h3 className="text-base font-semibold text-gray-800">
                        {fb.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                        {new Date(fb.createdAt || fb.received).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{fb.content}</p>
                    <p className="text-xs italic text-gray-600 mt-1">
                      From: {fb.from}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
