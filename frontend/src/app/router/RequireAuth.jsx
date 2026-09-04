import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Wrap any <Route element={...}> with this to require login (and,
// optionally, one of a set of roles). While the session is still being
// rehydrated from a stored token (see AuthContext) we render nothing
// rather than redirecting, so a refresh on /dashboard doesn't briefly
// bounce a logged-in user to /login.
export default function RequireAuth({ children, roles }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0) {
    const userRoles = user.roles || [];
    const isAllowed = roles.some((r) => userRoles.includes(r));
    if (!isAllowed) return <Navigate to="/" replace />;
  }

  return children;
}
