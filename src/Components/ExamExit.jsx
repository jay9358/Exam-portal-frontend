// import React from 'react';

// const SubmitConfirmation = () => {
//   const handleSubmit = () => {
//     // Handle submit functionality here
//     alert('Submitted!');
//   };

//   const handleBack = () => {
//     // Handle back functionality here
//     alert('Going back!');
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="text-center  max-w-lg w-full">
//         <p className="text-lg font-semibold tracking-wider text-gray-700 mb-6">
//           You have XX attempted questions. Are you sure you want to submit?
//         </p>
        
//         <div className="flex justify-center space-x-4">
//           <button
//             onClick={handleSubmit}
//             className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-200"
//           >
//             Submit
//           </button>
//           <button
//             onClick={handleBack}
//             className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-200 m-5"
//           >
//             Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubmitConfirmation;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubmitConfirmation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // For navigation

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'), // Include authorization if required
        },
        body: JSON.stringify({
          userId: '123', // Replace with actual user ID
          attemptedQuestions: 10, // Replace with actual number of attempted questions
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Exam submitted successfully!');
        navigate('/thank-you'); // Navigate to a thank-you or results page
      } else {
        toast.error(result.message || 'Failed to submit the exam.');
      }
    } catch (error) {
      console.error('Error submitting the exam:', error);
      toast.error('An error occurred while submitting the exam.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Navigate back to the exam or previous page
    navigate(-1);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-lg w-full">
        <p className="text-lg font-semibold tracking-wider text-gray-700 mb-6">
          You have 10 attempted questions. Are you sure you want to submit?
        </p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 border rounded-md transition duration-200 ${
              isSubmitting
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button
            onClick={handleBack}
            className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition duration-200"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmation;
