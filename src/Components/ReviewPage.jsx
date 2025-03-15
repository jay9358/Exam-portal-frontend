import React, { useState } from 'react';
import { FaBars, FaTimes, FaHome, FaEdit, FaUserPlus, FaFileAlt, FaCog, FaSignOutAlt, FaPen } from 'react-icons/fa';

const ReviewPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed rounded-r-xl lg:static w-64 h-full bg-blue-600 text-white p-5 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <h2 className="text-2xl font-bold mb-10">Dashboard</h2>
        <nav>
          <ul>
            <li className="mb-4 flex items-center">
              <FaHome className="mr-2" /> Dashboard
            </li>
            <li className="mb-4 flex items-center">
              <FaEdit className="mr-2" /> Exams
            </li>
            <li className="mb-4 flex items-center">
              <FaUserPlus className="mr-2" /> Register
            </li>
            <li className="mb-4 flex items-center">
              <FaFileAlt className="mr-2" /> Reports
            </li>
            <li className="mb-4 flex items-center">
              <FaCog className="mr-2" /> Settings
            </li>
            <li className="mb-4 flex items-center">
              <FaSignOutAlt className="mr-2" /> Sign out
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[1rem] p-5">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:ml-[25rem] font-semibold">Review - Maths</h1>
          <button className="lg:hidden p-2" onClick={toggleSidebar}>
            {isSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </header>

        {/* Sort Dropdown */}
        <div className="mb-4 flex justify-between items-center">
          <label htmlFor="sort" className="mr-2 text-lg font-medium">Sort:</label>
          <select id="sort" className="border p-2 rounded">
            <option>Last Week</option>
            <option>Last Month</option>
            <option>All Time</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow-lg overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="py-3 border-b font-semibold text-gray-700">Question Number</th>
                <th className="py-3 border-b font-semibold text-gray-700">Points</th>
                <th className="py-3 border-b font-semibold text-gray-700">Maximum Points</th>
                <th className="py-3 border-b font-semibold text-gray-700">Review</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <tr key={num}>
                  <td className="py-3 border-b text-gray-800">Q{num}</td>
                  <td className="py-3 border-b text-gray-800">1.0</td>
                  <td className="py-3 border-b text-gray-800">1.0</td>
                  <td className="py-3 border-b text-blue-500 text-center">
                    <FaPen className="inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;