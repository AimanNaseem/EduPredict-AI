import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { StudentForm } from '../components/StudentForm';
import { PredictionResult}  from '../components/predictionResult';
const StudentAnalysis = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  return (
    <div className="w-full">
      {/* <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
      </div> */}
      <h1 className="text-2xl font-bold mb-6">Student Performance Analysis</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md">
          <StudentForm
            setPrediction={setPrediction}
            setLoading={setLoading}
            setError={setError}
          />
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <PredictionResult
            prediction={prediction}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
export default StudentAnalysis;