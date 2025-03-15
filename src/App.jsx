import { useAuth } from './AuthContext';
import {  Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const { isAuthenticated, role, logout } = useAuth();

  return (
    <div>
      <header>
        <div className="logo-container">
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React Authentication Example</h1>
      </header>
      
      <div className="main-content">
        {isAuthenticated ? (
          <>
            <h2>Welcome, {role === 'admin' ? 'Admin' : 'Student'}</h2>
            <p>You are logged in as a {role}.</p>
            <button onClick={logout} className="logout-button">
              Log Out
            </button>
            <Link to={role === 'admin' ? '/admindashboard' : '/studhome'} className="dashboard-link">
              Go to {role === 'admin' ? 'Admin' : 'Student'} Dashboard
            </Link>
          </>
        ) : (
          <>
            <h2>Please Sign In</h2>
            <Link to="/adminlogin" className="login-link">Admin Login</Link>
            <Link to="/stulogin" className="login-link">Student Login</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
