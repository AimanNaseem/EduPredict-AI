import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const LineCharts = ({ data }) => {
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={800}
          height={400}
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="course_id" angle={-45} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="avg_quizzes"
            stroke={COLORS[0]}
            name="Quiz (No.of)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineCharts;
