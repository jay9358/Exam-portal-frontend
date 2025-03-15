import { useState, useEffect } from "react";
import "../../assets/css/AdminDashboard.css";
import axios from "axios";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalExams: 0,
    totalSchools: 0
  });

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/v1/admin/dashboard`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setDashboardData(response.data.data);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error.response?.data || error.message);
      toast.error("Failed to fetch dashboard data.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Students",
      value: dashboardData.totalStudents,
      icon: "👨‍🎓",
      color: "#4CAF50"
    },
    {
      title: "Total Exams",
      value: dashboardData.totalExams,
      icon: "📝",
      color: "#2196F3"
    },
    {
      title: "Total Schools",
      value: dashboardData.totalSchools,
      icon: "🏫",
      color: "#FF9800"
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the exam portal dashboard!</p>
      </div>

      <div className="dashboard-stats">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="stat-card"
            style={{ borderTop: `4px solid ${card.color}` }}
          >
            <div className="stat-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p className="stat-value">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
