import React, { useEffect, useState } from 'react';
import { PencilIcon, Send, X } from 'lucide-react';
import axios from 'axios';

function AnnounceForm({ onClose }) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Utility to safely get the token from localStorage
  const getTokenFromStorage = () => {
    const admin = localStorage.getItem('admin');
    const teacher = localStorage.getItem('teacher');
    const student = localStorage.getItem('student');

    const raw = admin || teacher || student;
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      return parsed.token;
    } catch (err) {
      return raw; // in case it's already a raw token
    }
  };

  // Extract email from token payload
  useEffect(() => {
    const token = getTokenFromStorage();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload?.email) {
        setEmail(payload.email);
      }
    } catch (err) {
      console.error('Error extracting email from token:', err);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getTokenFromStorage();
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }

    try {
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

      console.log('Announcement submitted:', res.data);
      onClose(); // Close the modal
    } catch (err) {
      console.error('Error submitting Announcement:', err);
      alert('Failed to submit Announcement. Please try again.');
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
            <PencilIcon className="text-[#9078e2] mr-2" size={20} />
            <h2 className="text-2xl font-serif text-gray-800">
              Make an Announcement
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
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
                className="w-full p-3 border border-[#9078e2] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#9078e2]"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-600 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please provide details here..."
                rows={6}
                className="w-full p-3 border border-[#9078e2] rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-[#9078e2] resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#9078e2] hover:bg-[#9078e2] text-white py-3 px-4 rounded-full flex items-center justify-center transition-colors"
            >
              <Send size={18} className="mr-2" />
              Make Announcement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AnnounceForm;
