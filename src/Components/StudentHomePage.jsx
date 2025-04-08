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
  const [user, setUser] = useState();

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
      const timeDifferenceMinutes = Math.round(timeDifference / (1000 * 60));

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
      <header>
        <h1>Student Exam Portal</h1>
      </header>

      {/* User Info Section */}
      {user && (
        <div className="user-info">
          <h2>Welcome, {user.firstName}!</h2>
          <p>Batch: <span>{user.batch}</span></p>
          <p>School: <span>{user.schoolId}</span></p>
          <p>Roll Number: <span>{user.rollNo}</span></p>
        </div>
      )}

      {/* Main Content */}
      <main>
        <h2>Available Exams</h2>
        {loading ? (
          <p>Loading exams...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="exam-grid">
            {allExams.length > 0 ? (
              allExams.map((exam) => (
                <div
                  key={exam._id}
                  className="exam-card"
                >
                  <h3>{exam.title}</h3>
                  <p>Date: {new Date(exam.date).toLocaleDateString()}</p>
                  <p>Start Time: {exam.startTime}</p>
                  <button
                    onClick={() => fetchQuestionSetAndStartExam(exam)}
                  >
                    Start Exam
                  </button>
                </div>
              ))
            ) : (
              <p>No exams available at the moment.</p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer>
        <p>© {new Date().getFullYear()} Student Portal. All rights reserved.</p>
      </footer>
    </div>
  );
}
