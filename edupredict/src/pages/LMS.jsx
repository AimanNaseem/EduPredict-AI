import React from 'react';
const LMS = () => {
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Learning Management System
        </h1>
        <p className="text-gray-600">
          Manage courses, materials, and track student progress
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Active Courses
            </h2>
            <button className="text-xs px-2 py-1 bg-indigo-600 text-white rounded">
              Add New
            </button>
          </div>
          <div className="space-y-3">
            {['Mathematics', 'Science', 'English', 'History', 'Computer Science'].map((course, i) => <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-800">{course}</div>
                    <div className="text-xs text-gray-500">
                      {5 + i} units • {20 + i * 5} students
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                      View
                    </button>
                    <button className="p-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100">
                      Edit
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Activities
            </h2>
            <button className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {['New material added to Mathematics', 'Quiz published for Science', 'Assignment deadline extended', 'New student enrolled in English', 'Feedback provided for History project'].map((activity, i) => <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-sm text-gray-800">{activity}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {i + 1} hour{i !== 0 ? 's' : ''} ago
                </div>
              </div>)}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Course Completion
            </h2>
            <select className="text-xs px-2 py-1 border rounded">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">Mathematics</div>
                <div className="text-xs font-medium">78%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{
                width: '78%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">Science</div>
                <div className="text-xs font-medium">65%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{
                width: '65%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">English</div>
                <div className="text-xs font-medium">92%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{
                width: '92%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">History</div>
                <div className="text-xs font-medium">45%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{
                width: '45%'
              }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">Computer Science</div>
                <div className="text-xs font-medium">83%</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{
                width: '83%'
              }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Learning Materials
          </h2>
          <div className="flex space-x-2">
            <button className="text-xs px-3 py-1 bg-indigo-600 text-white rounded">
              Upload
            </button>
            <button className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded">
              Filter
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[{
              title: 'Introduction to Algebra',
              course: 'Mathematics',
              type: 'PDF'
            }, {
              title: 'Cell Structure',
              course: 'Science',
              type: 'Video'
            }, {
              title: 'Grammar Rules',
              course: 'English',
              type: 'Document'
            }, {
              title: 'World War II',
              course: 'History',
              type: 'Presentation'
            }, {
              title: 'Programming Basics',
              course: 'Computer Science',
              type: 'Interactive'
            }].map((material, i) => <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {material.title}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {material.course}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${material.type === 'PDF' ? 'bg-red-100 text-red-800' : material.type === 'Video' ? 'bg-blue-100 text-blue-800' : material.type === 'Document' ? 'bg-green-100 text-green-800' : material.type === 'Presentation' ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
                      {material.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(2023, 8, 15 - i).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};
export default LMS;