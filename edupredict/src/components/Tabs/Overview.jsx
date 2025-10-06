import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { perform_attendance_trend_analysis } from "../../Api/internal";
import GraphDropdown from "../Graph/GraphDropDown";
import Loader from "../Custom/Loader";

const COLORS = ["#9078e2","#ff7e67"];
const CustomLegend = ({
  items
}) => {
  return <div className="flex justify-center space-x-6 mt-4">
      {items.map((item, index) => <div key={index} className="flex items-center space-x-2">
          <div className="w-4 h-4" style={{
        backgroundColor: item.color
      }}></div>
          <span className="text-sm text-gray-700 font-medium">{item.name}</span>
        </div>)}
    </div>;
};
export const Overview = () => {
  
   const legendItems = [
    { name: "Actual", color: "#9078e2" },
    { name: "Predicted", color: "#ff7e67" },
  ];
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(12);
  const fetchdata = async () => {
    setLoading(true);
    const response = await perform_attendance_trend_analysis(days);
    if (response.status == 200) {
      setData(response.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchdata();
  }, [days]);
  if (loading) {
    return <Loader />;
  }
 

  return ( 
    <>
   {data != null && (
  <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className="space-y-6 p-6">
      <div>
        <div className="flex items-center justify-between px-5 mb-2">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Attendance Trend
          </h2>
          {/* <GraphDropdown setOption={setDays} /> */}
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="90%">
            <LineChart width={800} height={400} data={data.labels.map((label, index) => ({
            date: label,
            actual: data.actual[index],
            predicted: data.predicted[index]
          }))} margin={{
            top: 10,
            right: 20,
            left: 10,
            bottom: 50
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
             <Line type="cardinal" dataKey="actual" stroke={COLORS[0]} name="Actual" strokeWidth={2} />
            <Line type="stepBefore" dataKey="predicted" stroke={COLORS[1]} name="Predicted" strokeWidth={2} />


            </LineChart>
          </ResponsiveContainer>
          <CustomLegend items={legendItems} />
        </div>
      </div>
    </motion.div>
   )}
    </>
  );
};