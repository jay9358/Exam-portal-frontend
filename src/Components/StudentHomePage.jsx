import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetallExam } from "../Store/Admin/adminreducer";
import "../assets/css/StudentSection.css";
import axios from "axios";
import toast from "react-hot-toast";

export default function StudentSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [allExams, setAllExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [serverTimeDiff, setServerTimeDiff] = useState(0);
  const [user,setUser]=useState();

  // Add function to validate time against server
  const validateTime = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/time`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
	  const serverTime = response.data.data.readableTime;
	  console.log("Server time:", serverTime);
	  
	  // Convert readable time to Date object
	  const [time, period] = serverTime.split(' ');
	  const [hours, minutes, seconds] = time.split(':');
	  const serverDate = new Date();
	  let serverHours = parseInt(hours);
	  
	  // Convert 12-hour format to 24-hour format
	  if (period === 'PM' && serverHours !== 12) {
		serverHours += 12;
	  } else if (period === 'AM' && serverHours === 12) {
		serverHours = 0;
	  }
	  
	  serverDate.setHours(serverHours, parseInt(minutes), parseInt(seconds));
	  const serverTimeMs = serverDate.getTime();
	  const localTime = Date.now();
	  const timeDifference = serverTimeMs - localTime;
	  const timeDifferenceMinutes = Math.round(timeDifference/ (1000 * 60));
	  
	  console.log("Time difference in minutes:", timeDifferenceMinutes);
      // If time difference is more than 2 minutes, consider it manipulation
      if (Math.abs(timeDifference) > 2 * 60 * 1000) {
        toast.error("Please correct your system time to continue");
        return false;
      }

      setServerTimeDiff(timeDifference);
      return true;
    } catch (error) {
      console.error("Error validating time:", error);
      toast.error("Unable to validate time. Please try again.");
      return false;
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      try {
        // Validate time before fetching exams
        const isTimeValid = await validateTime();
        if (!isTimeValid) {
          setLoading(false);
          return;
        }

        const response = await dispatch(GetallExam());
        const exams = response?.payload?.data?.exams || [];
        console.log(response);
        // Fetch user details
        const userId = localStorage.getItem('userId');
        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/v1/admin/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const user = userResponse.data.user;
        setUser(user);
        console.log(user)

        // Filter exams based on user's batch
        const filteredExams = exams.filter(exam => {
            // Check if the exam's batch matches the user's batch and is approved
            return exam.batch === user.batch && exam.ApprovalStatus === 'Approved';
        });
        console.log(filteredExams)
        // Update allExams state with filtered exams
        setAllExams(filteredExams);
        
      } catch (err) {
        setError("Failed to fetch exams. Please try again later.");
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [dispatch]);

  const fetchQuestionSetAndStartExam = async (exam) => {
    try {
      // Validate time before starting exam
      const isTimeValid = await validateTime();
      if (!isTimeValid) return;

      const currentServerTime = new Date(Date.now() + serverTimeDiff);
      const examDate = new Date(exam.date);
      const [hours, minutes] = exam.startTime.split(':');
      
      // Set the exam start time by combining date and time
      examDate.setHours(hours, minutes, 0);

      // Compare with server time instead of local time
      if (currentServerTime < examDate) {
        const formattedDate = examDate.toLocaleDateString();
        const formattedTime = exam.startTime;
        toast.error(`Exam will start on ${formattedDate} at ${formattedTime}`);
        return;
      }

      // Check if exam has already ended
      const examEndTime = new Date(examDate);
      examEndTime.setMinutes(examEndTime.getMinutes() + exam.timeLimit);
      
      if (currentServerTime > examEndTime) {
        toast.error("This exam has already ended");
        return;
      }

      navigate(`/examInstrctions/${exam._id}`);
    } catch (error) {
      console.error("Error starting exam:", error);
      toast.error("Failed to start exam. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="text-white py-6 text-center shadow-md">
        <h1 className="text-3xl font-bold">Student Portal</h1>
        <p className="mt-2 text-lg">Access your exams and get started!</p>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Available Exams
        </h2>
        {loading ? (
          <p className="text-gray-600 text-center">Loading exams...</p>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allExams.length > 0 ? (
              allExams.map((exam) => (
                <div
                  key={exam._id}
                  className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center text-center p-5"
                >
                  <h3 className="text-lg font-bold text-purple-700 mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {new Date(exam.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {exam.startTime}
                  </p>
                  <button
                    onClick={() => fetchQuestionSetAndStartExam(exam)}
                    className="px-4 py-2 text-white rounded-md shadow hover:bg-purple-800"
                  >
                    Start Exam
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center col-span-3">
                No exams available at the moment.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
