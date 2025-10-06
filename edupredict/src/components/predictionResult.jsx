import React from 'react'
import {
  AlertTriangleIcon,
  BarChart2Icon,
  TrendingUpIcon,
  LoaderIcon,
} from 'lucide-react'
export const PredictionResult = ({ prediction, loading, error }) => {
  const getDropoutRiskColor = (risk) => {
    switch (risk) {
      case 'High':
        return 'text-red-500 bg-red-50'
      case 'Medium':
        return 'text-yellow-500 bg-yellow-50'
      case 'Low':
        return 'text-green-500 bg-green-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }
  const getCourseDemandColor = (demand) => {
    switch (demand) {
      case 'High':
        return 'text-blue-500 bg-blue-50'
      case 'Medium':
        return 'text-purple-500 bg-purple-50'
      case 'Low':
        return 'text-orange-500 bg-orange-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }
  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent':
        return 'text-emerald-500 bg-emerald-50'
      case 'Good':
        return 'text-green-500 bg-green-50'
      case 'Average':
        return 'text-blue-500 bg-blue-50'
      case 'Below Average':
        return 'text-orange-500 bg-orange-50'
      case 'Poor':
        return 'text-red-500 bg-red-50'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }
  return (
    <div>
      <div className="flex items-center mb-6">
        <BarChart2Icon className="mr-2 text-[#9078e2]" />
        <h2 className="text-xl font-semibold">Prediction Results</h2>
      </div>
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <LoaderIcon className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600">Analyzing student data...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}
      {!loading && !error && !prediction && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center">
          <TrendingUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Prediction Yet
          </h3>
          <p className="text-gray-500">
            Fill out the student information form and click "Predict
            Performance" to see results.
          </p>
        </div>
      )}
      {!loading && !error && prediction && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Prediction Summary
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                  <dt className="text-sm font-medium text-gray-500">
                    Dropout Risk
                  </dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDropoutRiskColor(prediction.dropout_risk)}`}
                    >
                      {prediction.dropout_risk}
                    </span>
                  </dd>
                </div>
                {/* <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                  <dt className="text-sm font-medium text-gray-500">
                    Course Demand
                  </dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCourseDemandColor(prediction.course_demand)}`}
                    >
                      {prediction.course_demand}
                    </span>
                  </dd>
                </div> */}
                <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Predicted Performance
                  </dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPerformanceColor(prediction.predicted_performance)}`}
                    >
                      {prediction.predicted_performance}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="bg-[#f0ecfd] border border-[#9078e2] rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <TrendingUpIcon className="h-5 w-5 text-[#9078e2]" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-black">
                  Recommendation
                </h3>
                <div className="mt-2 text-sm text-black">
                  <p>
                    {prediction.dropout_risk === 'High'
                      ? 'This student has a high risk of dropping out. Consider immediate intervention and support.'
                      : prediction.dropout_risk === 'Medium'
                        ? 'This student has a moderate risk of dropping out. Monitor progress and provide additional support.'
                        : 'This student has a low risk of dropping out. Continue regular monitoring.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}