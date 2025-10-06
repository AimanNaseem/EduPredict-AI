    import React, { useEffect, useState } from "react";
    import {
    MessageSquareIcon,
    Send,
    Eye,
    Trash2,
    ChevronUp,
    ChevronDown,
    HandIcon,
    } from "lucide-react";
    import axios from "axios";
    import Feedbackform from "./Feedbackform";
    function FeedbackTeac() {
        const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackItems, setFeedbackItems] = useState([]);
    const [roleFilter, setRoleFilter] = useState("All");

    useEffect(() => {
        const adminData = localStorage.getItem("admin");
        const teacherData = localStorage.getItem("teacher");
        const studentData = localStorage.getItem("student");

        const getToken = (data) => {
        try {
            const parsed = JSON.parse(data);
            return parsed.token;
        } catch (err) {
            return data;
        }
        };

        const token = getToken(adminData || teacherData || studentData);

        const fetchFeedbacks = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/feedback", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            const fetched = (res.data.feedbacks || [])
            .filter((fb) => fb.role !== "admin")
            .map((fb, index) => ({
                ...fb,
                id: fb._id,
                viewed: false,
                expanded: false,
            }));

            setFeedbackItems(fetched);
        } catch (err) {
            console.error("Failed to fetch feedbacks", err);
        }
        };

        fetchFeedbacks();
    }, []);

    const handleDelete = (id) => {
        setFeedbackItems((prev) => prev.filter((item) => item.id !== id));
        // You can also call API here to delete feedback
    };

    const handleView = (id) => {
        setFeedbackItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, viewed: true } : item))
        );
    };

    const toggleExpand = (id) => {
        setFeedbackItems((prev) =>
        prev.map((item) =>
            item.id === id ? { ...item, expanded: !item.expanded } : item
        )
        );
    };

    const filteredItems = feedbackItems.filter((item) => {
        return roleFilter === "All" || item.role === roleFilter;
        
    });
    return (
        <div className="flex w-full min-h-screen justify-center items-center p-4">
        <div className="w-full max-w-7xl bg-white rounded-3xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
            <div className="flex items-start gap-3">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                <MessageSquareIcon className="text-[#9078e2] w-6 h-6" />
                </div>
                <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Feedback Inbox
                </h1>
                <p className="text-gray-500">
                    Review and manage feedback submitted by users.
                </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="appearance-none bg-white text-gray-700 py-2 px-4 pr-8 rounded-lg border border-gray-200 focus:outline-none"
                >
                    <option>All</option>
                    <option>teacher</option>
                    <option>student</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
                </div>
                <button
                className="bg-[#9078e2] hover:bg-[#9078e2] text-white py-2 px-5 rounded-xl flex items-center gap-2"
                onClick={() => setIsModalOpen(true)}
                >
                <Send className="w-4 h-4" />
                <span>Send Feedback</span>
                </button>
                {isModalOpen && <Feedbackform onClose={() => setIsModalOpen(false)} />}
            </div>
            </div>

            <div className="space-y-4">
            {filteredItems.map((item) => (
                <div key={item.id} className="bg-gray-50 border-2 rounded-2xl p-5">
                <div className="flex justify-between">
                    <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span
                        className={`${
                            item.role === "teacher"
                            ? "bg-[#d1cae5] text-black"
                            : "bg-green-200 text-black"
                        } text-md px-3 py-1 rounded-full`}
                        >
                        {item.role}
                        </span>
                        <h3 className="text-gray-700 font-bold">{item.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm">From: {item.from}</p>
                    <p className="text-gray-500 text-sm">
                        Received:{" "}
                        {new Date(item.received).toLocaleString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        })}
                    </p>
                    {item.expanded && (
                        <p className="text-gray-700 mt-3">{item.content}</p>
                    )}
                    </div>
                    <div className="flex gap-3">
                  
                    <button
                        className="text-gray-400 hover:text-red-600"
                        onClick={() => handleDelete(item.id)}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => toggleExpand(item.id)}
                    >
                        {item.expanded ? (
                        <ChevronUp className="w-5 h-5" />
                        ) : (
                        <ChevronDown className="w-5 h-5" />
                        )}
                    </button>
                    </div>
                </div>
                </div>
            ))}
            {filteredItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                No feedback items available
                </div>
            )}
            </div>
        </div>
        </div>
    )
    }

    export default FeedbackTeac