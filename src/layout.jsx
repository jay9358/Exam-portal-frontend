import { useSelector } from 'react-redux';
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AdminSidebar from "./Components/AdminSidebar";
import StudentSidebar from './Components/StudentSidebar';

export default function Layout() {
  const location = useLocation();

  // Safely access state and destructure flag with a fallback value (e.g., null)
  const flag = localStorage.getItem("flag");

  // Define paths where the sidebar should be hidden
  const hideSidebarPaths = ["/", "/stulogin", "/adminlogin", "/reset"];

  // Check if the current path matches any of the paths where the sidebar should be hidden
  const isSidebarHidden = hideSidebarPaths.includes(location.pathname);

  return (
    <div style={layoutStyles.container}>
      {!isSidebarHidden && (
        <div style={layoutStyles.sidebar}>
          {flag === "Admin" ? <AdminSidebar /> : <StudentSidebar />} 
        </div>
      )}
      <div
        style={{
          ...layoutStyles.mainContent,
          marginLeft: isSidebarHidden ? 0 : "250px",
        }}
      >
        <Navbar />
        <div style={layoutStyles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const layoutStyles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    width: "250px",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#f4f4f4",
    overflowY: "auto",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    padding: "20px",
    flex: 1,
    overflowY: "auto",
  },
};
