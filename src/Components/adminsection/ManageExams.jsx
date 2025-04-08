import { useState, useEffect, useMemo } from "react";// Make sure axios is installed
import "../../assets/css/ManageExams.css";
import axios from "axios";

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [results, setResults] = useState([]);
  // Fetch exams from backend API
  const fetchExams = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/admin/exams`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      
      if (Array.isArray(response.data.exams)) {
        console.log(response.data.exams);
        // Filter to only show approved exams
        const approvedExams = response.data.exams.filter(exam => exam.ApprovalStatus === 'Approved');
        setExams(approvedExams);
      } else {
        console.error('Unexpected response format:', response.data);
        setExams([]);
      }
    } catch (error) {
      console.error('Error fetching exams:', error.response?.data?.message || error.message);
      setExams([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchExams(), fetchUsers(), fetchSessions(), fetchResults()]);
    };
    fetchData();

    const intervalId = setInterval(() => {
      fetchExams();
      fetchSessions();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/admin/users/role/Student`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data?.message || error.message);
    }
  };

  const fetchResults = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/admin/results`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    });
    console.log(response.data);
    if (Array.isArray(response.data.results)) {
      setResults(response.data.results);
    } else {
      console.error('Unexpected response format:', response.data);
      setResults([]);
    }
  }

  const fetchSessions = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/v1/exams/getAllSessions`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    });
    console.log(response.data);
    if (Array.isArray(response.data.sessions)) {
      setSessions(response.data.sessions);
    } else {
      console.error('Unexpected response format:', response.data);
      setSessions([]);
    }
  }
  

  // Determine exam status based on current time
  const currentTime = new Date();
  const notStartedExams = useMemo(() => exams.filter(exam => {
    const examStartTime = new Date(exam.date);
    const [hours, minutes] = exam.startTime.split(':').map(Number);
    examStartTime.setHours(hours, minutes, 0, 0);
    return examStartTime > currentTime;
  }), [exams, currentTime]);
  const pendingExams = useMemo(() => exams.filter(exam => {
    const examStartTime = new Date(exam.date);
    const [hours, minutes] = exam.startTime.split(':').map(Number);
    examStartTime.setHours(hours, minutes, 0, 0);
    const examEndTime = new Date(examStartTime.getTime() + exam.timeLimit * 60000);
    return examStartTime <= currentTime && examEndTime > currentTime;
  }), [exams, currentTime]);
  const completedExams = useMemo(() => exams.filter(exam => {
    const examStartTime = new Date(exam.date);
    const [hours, minutes] = exam.startTime.split(':').map(Number);
    examStartTime.setHours(hours, minutes, 0, 0);
    const examEndTime = new Date(examStartTime.getTime() + exam.timeLimit * 60000);
    return examEndTime <= currentTime;
  }), [exams, currentTime]);

  // Function to get registered, attempting, and completed students count
  const getStudentCounts = (exam) => {
    const registeredStudents = users.filter(user =>user.batch==exam.batch).length;
    const attemptingStudents = sessions.filter(session => session.examId === exam._id).length;
    console.log(results);
    const completedStudents = results.filter(result => result.exam === exam._id).length;
    return { registeredStudents, attemptingStudents, completedStudents };
  };

  return (
    <div className="manageexams">
      <h4>Not Started Exams</h4>
      <ul className="exam-list">
        {notStartedExams.length > 0 ? (
          notStartedExams.map((exam) => {
            const { registeredStudents, attemptingStudents, completedStudents } = getStudentCounts(exam);
            return (
              <li key={exam._id} className="exam-item">
                {exam.title} : {new Date(exam.date).toLocaleDateString()} {exam.startTime}
                <div>Registered Students: {registeredStudents}</div>
                <div>Attempting Students: {attemptingStudents}</div>
                <div>Completed Students: {completedStudents}</div>

              </li>
            );
          })
        ) : (
          <p>No Not Started exams found</p>
        )}
      </ul>

      <h4>Pending Exams</h4>
      <ul className="exam-list">
        {pendingExams.length > 0 ? (
          pendingExams.map((exam) => {
            const { registeredStudents, attemptingStudents, completedStudents } = getStudentCounts(exam);
            return (
              <li key={exam._id} className="exam-item">
                {exam.title} - {new Date(exam.date).toLocaleDateString()}
                <div>Registered Students: {registeredStudents}</div>
                <div>Attempting Students: {attemptingStudents}</div>
                <div>Completed Students: {completedStudents}</div>
    
              </li>
            );
          })
        ) : (
          <p>No Pending exams found</p>
        )}
      </ul>

      <h4>Completed Exams</h4>
      <ul className="exam-list">
        {completedExams.length > 0 ? (
          completedExams.map((exam) => {
            const { registeredStudents, attemptingStudents, completedStudents } = getStudentCounts(exam);
            return (
              <li key={exam._id} className="exam-item">
                {exam.title} - {new Date(exam.date).toLocaleDateString()}
                <div>Registered Students: {registeredStudents}</div>
                <div>Attempting Students: {attemptingStudents}</div>
                <div>Completed Students: {completedStudents}</div>

              </li>
            );
          })
        ) : (
          <p>No Completed exams found</p>
        )}
      </ul>
    </div>
  );
};

export default ManageExams;
