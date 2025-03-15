import { useState, useEffect } from "react";// Make sure axios is installed
import "../../assets/css/ManageExams.css";
import axios from "axios";

const ManageExams = () => {
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(""); // State for selected exam

  // Fetch exams from backend API and filter by status
  const fetchExams = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/admin/exams`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      // Access the exams property from the response data
      if (Array.isArray(response.data.exams)) {
        setExams(response.data.exams); // Set exams to the array from the response
      } else {
        console.error('Unexpected response format:', response.data);
        setExams([]); // Reset to an empty array if the format is unexpected
      }
    } catch (error) {
      console.error('Error fetching exams:', error.response?.data?.message || error.message);
      setExams([]); // Reset to an empty array on error
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchExams();

    // Set up interval to fetch every minute (60000 milliseconds)
    const intervalId = setInterval(() => {
      fetchExams();
    }, 60000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

  // Create a new exam


  // Start an exam
  const handleStartExam = async (examId) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/v1/admin/exams/${examId}`, {
        Status: "Pending", // Update status to Pending
      }, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      // Update the exams list with the updated exam
      setExams((prevExams) => prevExams.map(exam => (exam._id === examId ? response.data : exam)));
    } catch (error) {
      console.error('Error starting exam:', error.response?.data?.message || error.message);
    }
  };

  // Delete an exam
  const handleDeleteExam = async (examId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/v1/admin/exams/${examId}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      // Remove the deleted exam from the state
      setExams((prevExams) => prevExams.filter((exam) => exam._id !== examId));
    } catch (error) {
      console.error('Error deleting exam:', error.response?.data?.message || error.message);
    }
  };

  // Filter exams by status
  const notStartedExams = exams.filter(exam => exam.Status === "Not Started");
  const pendingExams = exams.filter(exam => exam.Status === "Pending");
  const completedExams = exams.filter(exam => exam.Status === "Completed");

  return (
    <div className="manageexams">

      <h4>Not Started Exams</h4>
      <ul className="exam-list">
        {notStartedExams.length > 0 ? (
          notStartedExams.map((exam) => (
            <li key={exam._id} className="exam-item">
              {exam.title} : {new Date(exam.date).toLocaleDateString()} {exam.startTime}
              <div className="exam-actions">
              
                <button onClick={() => handleDeleteExam(exam._id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p>No Not Started exams found</p>
        )}
      </ul>

      <h4>Pending Exams</h4>
      <ul className="exam-list">
        {pendingExams.length > 0 ? (
          pendingExams.map((exam) => (
            <li key={exam._id} className="exam-item">
              {exam.title} - {new Date(exam.date).toLocaleDateString()}
              <div className="exam-actions">
                <button onClick={() => handleDeleteExam(exam._id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p>No Pending exams found</p>
        )}
      </ul>

      <h4>Completed Exams</h4>
      <ul className="exam-list">
        {completedExams.length > 0 ? (
          completedExams.map((exam) => (
            <li key={exam._id} className="exam-item">
              {exam.title} - {new Date(exam.date).toLocaleDateString()}
              <div className="exam-actions">
                <button onClick={() => handleDeleteExam(exam._id)}>Delete</button>
              </div>
            </li>
          ))
        ) : (
          <p>No Completed exams found</p>
        )}
      </ul>

  
    </div>
  );
};

export default ManageExams;
