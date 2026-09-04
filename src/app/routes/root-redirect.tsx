import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function RootRedirect() {
  const { isAuthenticated, user, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role === 'staff') {
    return <Navigate to="/service-engineer" replace />;
  }

  return <Navigate to="/client" replace />;
}
