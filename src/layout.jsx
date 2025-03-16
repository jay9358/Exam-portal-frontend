import { useSelector } from 'react-redux';
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AdminSidebar from "./Components/AdminSidebar";
import StudentSidebar from './Components/StudentSidebar';
import StateManagerSideBar from './Components/stateManager/StateManagerSideBar';
import CityManagerSidebar from './Components/cityManager/CityManagerSidebar';
import './assets/css/Layout.css';

export default function Layout() {
  const location = useLocation();
  const flag = localStorage.getItem("flag");

  // Define paths where the sidebar should be hidden
  const hideSidebarPaths = [
    "/", 
    "/stulogin", 
    "/adminlogin", 
    "/reset",
    "/statemanagerlogin",
    "/citymanagerlogin"  // Added city manager login path
  ];

  // Check if the current path matches any of the paths where the sidebar should be hidden
  const isSidebarHidden = hideSidebarPaths.includes(location.pathname);

  const renderSidebar = () => {
    switch(flag) {
      case "Admin":
        return <AdminSidebar />;
      case "Student":
        return <StudentSidebar />;
      case "StateManager":
        return <StateManagerSideBar />;
      case "CityManager":
        return <CityManagerSidebar />;
      default:
        return null;
    }
  };

  return (
    <div className="layout-container">
      {!isSidebarHidden && (
        <div className="layout-sidebar">
          {renderSidebar()}
        </div>
      )}
      <div
        className="layout-main-content"
        style={{
          marginLeft: isSidebarHidden ? 0 : "250px",
        }}
      >
        <Navbar />
        <div className="layout-content">
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
