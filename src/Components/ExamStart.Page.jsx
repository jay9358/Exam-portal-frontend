import React, { useState } from 'react';

const ExamLogin = () => {
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login functionality here
    alert('Logging in with password: ' + password);
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      <div className="text-center p-6  max-w-sm w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome,</h1>
        <p className="text-xl text-gray-700 mb-4">Are you ready to take your exam</p>
        <p className="text-lg font-bold text-gray-600 mb-6">
          We have sent the password code to your email address. Check your email and enter the code below to continue your exam.
        </p>
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
        />
        
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4  border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-200 m-5"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default ExamLogin;
