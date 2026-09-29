import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Redirects to /login when nobody is signed in. */
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
