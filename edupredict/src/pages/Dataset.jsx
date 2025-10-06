import React, { useEffect, useMemo, useState } from 'react'
import {
  ChevronDownIcon,
  SearchIcon,
  BarChart2Icon,
  XIcon,
  DownloadIcon,
  TrashIcon,
} from 'lucide-react'

import {
  
  uploadDataset,
  getDatasets,
  deleteDatasetApi,
  downloadDatasetApi,
  triggerBlobDownload,
} from '../Api/dataset'
import { predictStudentDropout } from '../Api/internal'

// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts';

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Dataset() {
  const [showPredictionPopup, setShowPredictionPopup] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sizeFilter, setSizeFilter] = useState('All Sizes')
  const [predictionResult, setPredictionResult] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedModel, setSelectedModel] = useState('XGBoost')
  const [datasets, setDatasets] = useState([])
  const [loadingList, setLoadingList] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [predicting, setPredicting] = useState(false)

  // Map UI filter -> backend query param
  const sizeParamMap = useMemo(() => ({
    'All Sizes': undefined,
    'Small (<1MB)': 'small',
    'Medium (1-3MB)': 'medium',
    'Large (>3MB)': 'large',
  }), [])

  // Initial + whenever sizeFilter changes, fetch from backend
  useEffect(() => {
    const run = async () => {
      setLoadingList(true)
      try {
        const sizeParam = sizeParamMap[sizeFilter]
        const data = await getDatasets(sizeParam) // server-side filtering
        setDatasets(data)
      } catch (e) {
        console.error('Error fetching datasets:', e)
      } finally {
        setLoadingList(false)
      }
    }
    run()
  }, [sizeFilter, sizeParamMap])

  // File change handler
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Predict button click
  const handlePredict = async () => {
    if (!selectedFile) {
      alert('Please upload a CSV file.')
      return
    }
    setPredicting(true)
    try {
      const result = await predictStudentDropout(selectedFile, selectedModel)
      setPredictionResult(result)
      setShowPredictionPopup(true)
    } catch (error) {
      console.error(error)
      alert('Error while predicting dropout risk.')
    } finally {
      setPredicting(false)
    }
  }

  // Confirm & Upload => Save file to MongoDB and refresh list
  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      alert('Please select a CSV file first.')
      return
    }
    setUploading(true)
    try {
      await uploadDataset(selectedFile)
      // Refresh list after upload (respect current size filter)
      const sizeParam = sizeParamMap[sizeFilter]
      const refreshed = await getDatasets(sizeParam)
      setDatasets(refreshed)
      setShowPredictionPopup(false)
      setPredictionResult(null)
      setSelectedFile(null)
    } catch (err) {
      console.error(err)
      alert('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  // Delete dataset
  const handleDelete = async (id) => {
    try {
      await deleteDatasetApi(id)
      const sizeParam = sizeParamMap[sizeFilter]
      const refreshed = await getDatasets(sizeParam)
      setDatasets(refreshed)
    } catch (e) {
      console.error(e)
      alert('Delete failed.')
    }
  }

  // Download dataset
  const handleDownload = async (dataset) => {
    try {
      const res = await downloadDatasetApi(dataset._id)
      triggerBlobDownload(res.data, dataset.name || `dataset_${dataset._id}.csv`, res.headers)
    } catch (e) {
      console.error(e)
      alert('Download failed.')
    }
  }

  // Client-side search filter
  const filteredDatasets = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return datasets
    return datasets.filter((d) => (d.name || '').toLowerCase().includes(term))
  }, [datasets, searchTerm])

  return (
    <div className="w-full min-h-screen bg-[#ffffff] p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Upload New Dataset Section */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            Upload New Dataset
          </h2>
          <p className="text-gray-600 mb-6">
            Add new data sources and run predictions using your selected model.
          </p>

          <div className="space-y-6">
            {/* File upload */}
            <div>
              <label className="block text-gray-700 mb-2">Upload File</label>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="border border-gray-300 rounded-md py-2 px-4 w-full cursor-pointer appearance-none hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
              />
            </div>

            {/* Model selection */}
            <div>
              <label className="block text-gray-700 mb-2">Choose Model</label>
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-white border border-gray-300 rounded-md py-2 px-4 w-full appearance-none focus:ring-2 focus:outline-none focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
                >
                  <option>XGBoost</option>
                  <option>Gradient Boosting</option>
                  <option>Random Forest</option>
                  <option>Linear Regression</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDownIcon size={18} className="text-gray-500" />
                </div>
              </div>
            </div>

            {/* Predict button */}
            <div>
              <button
                className="bg-[#9078e2] text-white py-2 px-6 rounded-md flex items-center disabled:opacity-60"
                onClick={handlePredict}
                disabled={predicting}
              >
                <BarChart2Icon size={18} className="mr-2" />
                {predicting ? 'Predicting…' : 'Predict'}
              </button>
            </div>
          </div>
        </div>

        {/* Manage Datasets Section */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            Manage Datasets
          </h2>
          <p className="text-gray-600 mb-6">
            View, download, or delete existing datasets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search datasets..."
                className="bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 w-full focus:ring-2 focus:outline-none focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative min-w-[210px]">
              <select
                className="bg-white border border-gray-300 rounded-md py-2 px-4 w-full appearance-none focus:ring-2 focus:outline-none focus:ring-[#9078e2] focus:border-[#9078e2] transition-all"
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
              >
                <option>All Sizes</option>
                <option>Small (&lt;1MB)</option>
                <option>Medium (1-3MB)</option>
                <option>Large (&gt;3MB)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDownIcon size={18} className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Datasets Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Dataset Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Size</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date Added</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingList ? (
                  <tr>
                    <td colSpan={4} className="py-6 px-4 text-center text-gray-500">Loading…</td>
                  </tr>
                ) : filteredDatasets.length > 0 ? (
                  filteredDatasets.map((dataset) => (
                    <tr key={dataset._id}>
                      <td className="py-3 px-4 text-sm text-gray-800">{dataset.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {dataset.sizeLabel}
                        {dataset.sizeBucket ? ` — ${dataset.sizeBucket}` : ''}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {dataset.createdAt
                          ? new Date(dataset.createdAt).toLocaleDateString()
                          : new Date(dataset.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDownload(dataset)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Download"
                          >
                            <DownloadIcon size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(dataset._id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                      No datasets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Prediction Results Popup */}
      {/* {showPredictionPopup && predictionResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium text-gray-900">
                Prediction Results
              </h3>
              <button
                onClick={() => setShowPredictionPopup(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="p-6">
              <table className="w-full">
                <tbody>
                  {Object.entries(predictionResult).map(([key, value], index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : ''}
                    >
                      <td className="py-2 px-3 text-sm font-medium text-gray-700">
                        {key}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-900 text-right">
                        {typeof value === 'number' ? value.toFixed(2) : value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-end gap-x-2">
                <button
                  onClick={() => setShowPredictionPopup(false)}
                  className="bg-[#c8c8ff] text-white py-2 px-6 rounded-md"
                >
                  Close
                </button>
                <button
                  onClick={handleConfirmUpload}
                  className="bg-[#9078e2] text-white py-2 px-4 rounded-md disabled:opacity-60"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading…' : 'Confirm & Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
{showPredictionPopup && predictionResult && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
      {/* Header */}
      <div className="flex justify-between bg-[#9078e2] items-center border-b p-4">
        <h3 className="text-lg font-medium text-white">
          Prediction Results
        </h3>
        <button
          onClick={() => setShowPredictionPopup(false)}
          className="text-white hover:text-[#9078e2]"
        >
          <XIcon size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Table */}
        <table className="w-full">
          <tbody>
            {Object.entries(predictionResult).map(([key, value], index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-[#f1eff9]" : ""}
              >
                <td className="py-2 px-3 text-sm font-medium text-gray-700">
                  {key}
                </td>
                <td className="py-2 px-3 text-sm text-gray-900 text-right">
                  {typeof value === "number" ? value.toFixed(2) : value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Gauges Row */}
        <div className="flex flex-row items-center justify-center gap-8">
          {/* Accuracy Gauge */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24">
              {(() => {
                const rawAcc =
                  predictionResult["Model Test Accuracy"] ??
                  predictionResult["Overall Dataset Accuracy"];
                const accuracy =
                  typeof rawAcc === "number" ? rawAcc : parseFloat(rawAcc) || 0;
                return (
                  <CircularProgressbar
                    value={accuracy}
                    maxValue={100}
                    text={`${accuracy.toFixed(1)}%`}
                    styles={buildStyles({
                      textSize: "12px",
                      pathColor: "#9078e2",
                      textColor: "#333",
                      trailColor: "#eee",
                    })}
                  />
                );
              })()}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">Accuracy</p>
          </div>

          {/* Confidence Gauge */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24">
              {(() => {
                const rawConf = predictionResult["Confidence Score"];
                const confidence =
                  typeof rawConf === "number" ? rawConf : parseFloat(rawConf) || 0;
                return (
                  <CircularProgressbar
                    value={confidence}
                    maxValue={100}
                    text={`${confidence.toFixed(1)}%`}
                    styles={buildStyles({
                      textSize: "12px",
                      pathColor: "#34d399",
                      textColor: "#333",
                      trailColor: "#eee",
                    })}
                  />
                );
              })()}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">Confidence</p>
          </div>
        </div>

       {/* Actions (NEECHE inside .p-6) */}
<div className="flex justify-end gap-x-2 mt-6 pt-4 ">
  <button
    onClick={() => setShowPredictionPopup(false)}
    className="bg-[#c8c8ff] text-white py-2 px-6 rounded-md"
  >
    Close
  </button>
  <button
    onClick={handleConfirmUpload}
    className="bg-[#9078e2] text-white py-2 px-4 rounded-md disabled:opacity-60"
    disabled={uploading}
  >
    {uploading ? "Uploading…" : "Confirm & Upload"}
  </button>
</div>
      </div>
    </div>
  </div>
)}
    </div>
  )
}

export default Dataset


//  bar cahart popup code 

// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
// } from 'recharts';


// {showPredictionPopup && predictionResult && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//     <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
//       {/* Header */}
//       <div className="flex justify-between items-center border-b p-4">
//         <h3 className="text-lg font-medium text-gray-900">
//           Prediction Results
//         </h3>
//         <button
//           onClick={() => setShowPredictionPopup(false)}
//           className="text-gray-400 hover:text-gray-500"
//         >
//           <XIcon size={20} />
//         </button>
//       </div>

//       {/* Body */}
//       <div className="p-6 space-y-6">
//         {/* Table */}
//         <table className="w-full rounded-md overflow-hidden border">
//           <tbody>
//             {Object.entries(predictionResult).map(([key, value], index) => (
//               <tr
//                 key={index}
//                 className={index % 2 === 0 ? 'bg-gray-50' : ''}
//               >
//                 <td className="py-2 px-3 text-sm font-medium text-gray-700">
//                   {key}
//                 </td>
//                 <td className="py-2 px-3 text-sm text-gray-900 text-right">
//                   {typeof value === 'number' ? value.toFixed(2) : value}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Chart */}
//         <div className="h-64 w-full">
//           <ResponsiveContainer>
//             <BarChart
//               data={[
//                 { name: 'Mean', value: predictionResult['Mean Dropout Risk'] },
//                 { name: 'Std Dev', value: predictionResult['Std Deviation'] },
//                 { name: 'Min', value: predictionResult['Min Dropout Risk'] },
//                 { name: 'Max', value: predictionResult['Max Dropout Risk'] },
//                 { name: 'Confidence', value: predictionResult['Confidence Score'] },
//                 { name: 'Accuracy', value: predictionResult['Model Test Accuracy'] || predictionResult['Overall Dataset Accuracy'] },
//               ]}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#9078e2" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-x-2">
//           <button
//             onClick={() => setShowPredictionPopup(false)}
//             className="bg-[#c8c8ff] text-white py-2 px-6 rounded-md"
//           >
//             Close
//           </button>
//           <button
//             onClick={handleConfirmUpload}
//             className="bg-[#9078e2] text-white py-2 px-4 rounded-md disabled:opacity-60"
//             disabled={uploading}
//           >
//             {uploading ? 'Uploading…' : 'Confirm & Upload'}
//           </button>
//         </div>
//       </div>
//     </div>
//     </div>
// )}