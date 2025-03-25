import {
  ClipboardListIcon,
  PencilAltIcon,
  ChartBarIcon,
  CogIcon,
  LogoutIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { ClipboardCheck, ListIcon, FilePlus, FileMinus } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "UserPanel/resetState" });
    navigate("/");
  };

  return (
    <SidebarContainer>
      <Nav>
        <ul>
          <NavItem>
            <ClipboardListIcon className="icon" />
            <Link to="/admindashboard">
              <span>Dashboard</span>
            </Link>
          </NavItem>

          {/* Exams Section */}
          <NavHeader>Exams</NavHeader>
          <NavItem>
            <FilePlus className="icon" />
            <Link to="/createexam">
              <span>Create Exam</span>
            </Link>
          </NavItem>

          <NavItem>
            <ListIcon className="icon" />
            <Link to="/examlist">
              <span>Manage Exams</span>
            </Link>
          </NavItem>
          <NavItem>
            <ListIcon className="icon" />
            <Link to="/manageexam">
              <span>Exam Status</span>
            </Link>
          </NavItem>

          {/* Question Management */}
          <NavHeader>Exam Sets</NavHeader>

          <NavItem>
            <ListIcon className="icon" />
            <Link to="/reviewquestionset">
              <span>Review Exam Sets</span>
            </Link>
          </NavItem>


          {/* Reports */}
          <NavHeader>Reports</NavHeader>
          <NavItem>
            <PencilAltIcon className="icon" />
            <Link to="/managequestionsets">
              <span>Upload Question Bank</span>
            </Link>
          </NavItem>
          <NavItem>
            <ChartBarIcon className="icon" />
            <Link to="/uploadcsv">
              <span>Register Students</span>
            </Link>
          </NavItem>
          <NavItem>
            <ChartBarIcon className="icon" />
            <Link to="/uploadcsvSchools">
              <span>Register Schools</span>
            </Link>
          </NavItem>

          <NavItem>
            <ChartBarIcon className="icon" />
            <Link to="/performancereports">
              <span>Reports</span>
            </Link>
          </NavItem>

          {/* User Management */}
          <NavHeader>User Management</NavHeader>
          <NavItem>
            <UserIcon className="icon" />
            <Link to="/manageuser">
              <span>Manage Users</span>
            </Link>
          </NavItem>
        </ul>
      </Nav>

      <Settings>
        <ul>
          <NavItem onClick={handleLogout}>
            <LogoutIcon className="icon" />
            <span>Sign Out</span>
          </NavItem>
        </ul>
      </Settings>
    </SidebarContainer>
  );
}

// Styled components
const SidebarContainer = styled.div`
  background-color: #007bff;
  width: 256px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 20px;
  z-index: 10;
`;

const Nav = styled.nav`
  ul {
    list-style: none;
    padding-left: 0;
  }

  svg {
    height: 26px;
    width: 26px;
    color: white;
  }
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 0;
  &:hover {
    background-color: #3b429d;
    cursor: pointer;
    border-radius: 8px;
  }

  a {
    text-decoration: none;
    display: flex;
    align-items: center;
  }

  span {
    font-size: 16px;
    margin-left: 10px;
    color: white;
  }
`;

const NavHeader = styled.h3`
  font-size: 14px;
  color: #e1e1e1;
  text-transform: uppercase;
  margin: 20px 0 10px 0;
`;

const Settings = styled.div`
  ul {
    list-style: none;
    padding-left: 0;
    margin-top: 5rem;
  }

  svg {
    height: 26px;
    width: 26px;
    color: white;
  }
`;
