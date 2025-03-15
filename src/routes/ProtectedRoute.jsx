// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ element, requiredFlag }) => {
  const { isAuthenticated, flag } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  if (flag !== requiredFlag) {
    return <Navigate to="/404" />; // Redirect to a 404 page if flag does not match
  }

  return element; // Render the protected element if authenticated and flag matches
};

export default ProtectedRoute;
