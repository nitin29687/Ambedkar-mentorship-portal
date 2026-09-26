import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace state={{ role: allowedRole }} />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/login" replace state={{ role: allowedRole }} />;
  }

  return children;
}

export default ProtectedRoute;
