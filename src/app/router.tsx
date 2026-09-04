/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/lib/auth-guard';

const DashboardLayout = lazy(() => import('@/components/layouts/dashboard-layout'));

// Pages
const HomePage = lazy(() => import('@/pages'));
const AboutPage = lazy(() => import('@/pages/about/index'));
const LoginPage = lazy(() => import('@/app/routes/auth/login'));
const RegisterPage = lazy(() => import('@/app/routes/auth/register'));
const UnauthorizedPage = lazy(() => import('@/app/routes/unauthorized'));
const NotFoundPage = lazy(() => import('@/app/routes/not-found'));
const UserProfile = lazy(() => import('@/pages/user-profile'));

// Admin Pages
const AdminPage = lazy(() => import('@/pages/admin'));
const AdminITServiceTicketsPage = lazy(() => import('@/pages/admin/it-service-tickets'));
const AdminITServiceTicketForm = lazy(() => import('@/pages/admin/it-service-tickets/it-service-ticket-form'));
const ITServiceTicketView = lazy(() => import('@/pages/admin/it-service-tickets/it-service-ticket-view'));
const AdminClientsPage = lazy(() => import('@/pages/admin/clients'));
const AdminClientForm = lazy(() => import('@/pages/admin/clients/client-form'));
const AdminUsersPage = lazy(() => import('@/pages/admin/users'));
const AdminUserForm = lazy(() => import('@/pages/admin/users/user-form'));
const AdminDesignationsPage = lazy(() => import('@/pages/admin/designations'));
const AdminDesignationForm = lazy(() => import('@/pages/admin/designations/designation-form'));
const AdminOfficesPage = lazy(() => import('@/pages/admin/offices'));
const AdminOfficeForm = lazy(() => import('@/pages/admin/offices/office-form'));

// Staff / Service Engineer Pages
const ServiceEngineerPage = lazy(() => import('@/pages/service-engineer'));
const ServiceEngineerITServiceTicket = lazy(() => import('@/pages/service-engineer/it-service-ticket'));

// Client Pages
const ClientPage = lazy(() => import('@/pages/client'));
const ClientTicketForm = lazy(() => import('@/pages/client/client-ticket-form'));
const ClientTicketView = lazy(() => import('@/pages/client/client-ticket-view'));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AboutPage />
      </Suspense>
    ),
  },
  {
    path: '/auth/login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/auth/register',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  // Backward compatibility redirects
  {
    path: '/sign-in',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: '/sign-up',
    element: <Navigate to="/auth/register" replace />,
  },

  // Authenticated Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminPage />
          </Suspense>
        ),
      },
      {
        path: 'user-profile',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <UserProfile />
          </Suspense>
        ),
      },
      {
        path: 'it-service-tickets',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminITServiceTicketsPage />
          </Suspense>
        ),
      },
      {
        path: 'it-service-tickets/create',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminITServiceTicketForm />
          </Suspense>
        ),
      },
      {
        path: 'it-service-tickets/:serviceTicketId/update',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminITServiceTicketForm />
          </Suspense>
        ),
      },
      {
        path: 'it-service-tickets/:serviceTicketId/view',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ITServiceTicketView />
          </Suspense>
        ),
      },
      {
        path: 'clients',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminClientsPage />
          </Suspense>
        ),
      },
      {
        path: 'clients/create',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminClientForm />
          </Suspense>
        ),
      },
      {
        path: 'clients/:clientId/update',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminClientForm />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminUsersPage />
          </Suspense>
        ),
      },
      {
        path: 'users/create',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminUserForm />
          </Suspense>
        ),
      },
      {
        path: 'users/:userId/update',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminUserForm />
          </Suspense>
        ),
      },
      {
        path: 'designations',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDesignationsPage />
          </Suspense>
        ),
      },
      {
        path: 'designations/create',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDesignationForm />
          </Suspense>
        ),
      },
      {
        path: 'designations/:designationId/update',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminDesignationForm />
          </Suspense>
        ),
      },
      {
        path: 'offices',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminOfficesPage />
          </Suspense>
        ),
      },
      {
        path: 'offices/create',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminOfficeForm />
          </Suspense>
        ),
      },
      {
        path: 'offices/:officeId/update',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AdminOfficeForm />
          </Suspense>
        ),
      },
    ],
  },

  // Authenticated Staff / Service Engineer routes
  {
    path: '/service-engineer',
    element: (
      <ProtectedRoute allowedRoles={['staff', 'admin']}>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ServiceEngineerPage />
          </Suspense>
        ),
      },
      {
        path: ':ticketNo',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ServiceEngineerITServiceTicket />
          </Suspense>
        ),
      },
      {
        path: 'user-profile',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <UserProfile />
          </Suspense>
        ),
      },
    ],
  },

  // Authenticated Client routes
  {
    path: '/client',
    element: (
      <ProtectedRoute allowedRoles={['user', 'admin']}>
        <Suspense fallback={<LoadingFallback />}>
          <DashboardLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ClientPage />
          </Suspense>
        ),
      },
      {
        path: 'ticket-form',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ClientTicketForm />
          </Suspense>
        ),
      },
      {
        path: ':ticketNo',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ClientTicketView />
          </Suspense>
        ),
      },
      {
        path: 'user-profile',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <UserProfile />
          </Suspense>
        ),
      },
    ],
  },

  // Error and Fallback routes
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <UnauthorizedPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default router;
