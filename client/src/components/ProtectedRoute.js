import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { admin, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!admin) return <Navigate to="/admin/login" replace />;
  if (requiredRole && admin.role !== requiredRole) return <Navigate to="/admin/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
