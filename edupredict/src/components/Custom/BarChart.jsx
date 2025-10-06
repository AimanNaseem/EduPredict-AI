import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

// Custom Bar Chart Component
const BarCharts = ({ data, type = "course" }) => {
  return (
    <div className="flex items-end h-80 w-100 space-x-2 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="course_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          {type == "course" && (
            <>
              <Bar dataKey="avg_quizzes" name="AVG Quiz" fill={COLORS[2]} />
              <Bar
                dataKey="avg_pages_viewed"
                name="AVG Page View"
                fill={COLORS[3]}
              />
            </>
          )}
          {type == "session" && (
            <>
              <Bar
                dataKey="avg_session_duration"
                name="AVG Duration (min)"
                fill={COLORS[1]}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;
