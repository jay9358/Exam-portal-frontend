import React, { useState } from 'react';
import { Home, Headphones, Bell, LogOut } from 'lucide-react';

const SidebarItem = ({ icon, text, active = false }) => (
  <div
    className={`flex items-center space-x-3 px-4 py-3 cursor-pointer transition-colors ${
      active ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100 text-gray-700'
    }`}
  >
    <span className="w-6">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </div>
);

const QuizPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [questions, setQuestions] = useState(Array(50).fill(0));

  const handleOptionChange = (option) => {
    setSelectedOption((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-64 bg-indigo-600 text-white p-6 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } z-40`}
      >
        <div className="text-2xl font-bold mb-10">Quiz Time</div>
        <SidebarItem icon={<Home />} text="Dashboard" active />
        <SidebarItem icon={<Headphones />} text="Support" />
        <SidebarItem icon={<Bell />} text="Notification" />
        <div className="mt-auto">
          <SidebarItem icon={<LogOut />} text="Log Out" />
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col lg:flex-row">
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold">History Quiz</h1>
            <div className="text-gray-500">Timer: 29:09 Mins</div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Answer the question below <br />
              <strong>Set A</strong> PaperCode - XXXXX
            </p>
          </div>

          {/* Difficulty Selector */}
          <div className="flex space-x-3 mb-6">
            <button className="px-4 py-2 rounded bg-gray-200">Easy</button>
            <button className="px-4 py-2 rounded bg-gray-200">Medium</button>
            <button className="px-4 py-2 rounded bg-gray-200">Hard</button>
          </div>

          {/* Question */}
          <div className="mb-6 ">
            <h2 className="font-bold">Question 9</h2>
            <p className="text-gray-600 mb-4">
              Guy Bailey, Roy Hackett and Paul Stephenson made history in 1963, as
              part of a protest against a bus company that refused to employ black
              and Asian drivers in which UK city?
            </p>

            {/* Options */}
            <div className="space-y-3">
              {['London', 'Edinburgh', 'Liverpool', 'Canary Wharf'].map(
                (option, index) => (
                  <label key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOption.includes(option)}
                      onChange={() => handleOptionChange(option)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                )
              )}
            </div>
            <button
              className="mt-4 text-blue-500 underline"
              onClick={() =>
                setSelectedOption([
                  'London',
                  'Edinburgh',
                  'Liverpool',
                  'Canary Wharf',
                ])
              }
            >
              Select all
            </button>
          </div>

          {/* Submit Button */}
          <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Submit
          </button>
        </div>

        {/* Question Navigation */}
        <div className="lg:ml-6 lg:w-[25rem] mt-6 lg:mt-0">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6">
            {questions.map((_, index) => (
              <button
                key={index}
                className={`p-3 rounded border ${
                  index === 8
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;