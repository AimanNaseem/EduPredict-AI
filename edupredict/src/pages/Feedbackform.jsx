import React, { useEffect, useState } from 'react';
import { PencilIcon, Send, X } from 'lucide-react';
import axios from 'axios';

function Feedbackform({ onClose }) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Parse token to get email
  useEffect(() => {
    const admin = localStorage.getItem('admin');
    const teacher = localStorage.getItem('teacher');
    const student = localStorage.getItem('student');

    const userData = admin || teacher || student;

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const token = parsed.token;

        // Decode JWT to extract email (payload is base64)
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.email) setEmail(payload.email); // auto-set email
      } catch (err) {
        console.error('Failed to parse token:', err);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const admin = localStorage.getItem('admin');
      const teacher = localStorage.getItem('teacher');
      const student = localStorage.getItem('student');
      const userData = admin || teacher || student;

      const parsed = JSON.parse(userData);
      const token = parsed.token;

      const res = await axios.post(
        'http://localhost:8000/api/feedback',
        {
          from: email,
          title: subject,
          content: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Feedback submitted:', res.data);
      onClose();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-[#f8f6e9] w-full max-w-md rounded-lg shadow-xl relative animate-fade-in">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="flex items-center mb-6">
            <PencilIcon className="text-purple-500 mr-2" size={20} />
            <h2 className="text-2xl font-serif text-gray-800">
              Submit Your Feedback
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Hidden Email Field */}
            <input type="hidden" value={email} readOnly />

            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-600 mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="A brief summary of your feedback"
                className="w-full p-3 border border-purple-300 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-400"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-600 mb-1">
                Your Feedback / Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide details here..."
                rows={6}
                className="w-full p-3 border border-purple-300 rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#9078e2] hover:bg-[#9078e2] text-white py-3 px-4 rounded-full flex items-center justify-center transition-colors"
            >
              <Send size={18} className="mr-2" />
              Send Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Feedbackform;
