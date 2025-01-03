import { createBrowserRouter } from 'react-router-dom'

import AdminLayout from '@/layouts/admin-layout'
import AdminPage from '@/pages/admin/index'
import AdminITServiceTicketsPage from '@/pages/admin/it-service-tickets/index'
import AdminClientsPage from '@/pages/admin/clients/index'
import AdminClientForm from '@/pages/admin/clients/client-form'
import AdminUsersPage from '@/pages/admin/users/index'
import AdminUserForm from '@/pages/admin/users/user-form'
import AdminDesignationsPage from '@/pages/admin/designations/index'
import AdminDesignationForm from '@/pages/admin/designations/designation-form'
import AdminOfficesPage from '@/pages/admin/offices/index'
import AdminOfficeForm from '@/pages/admin/offices/office-form'
import HomePage from '@/pages'
import ClientPage from '@/pages/client/index'
import AboutPage from '@/pages/about/index'
import SignInPage from '@/pages/auth/sign-in'
import SignUpPage from '@/pages/auth/sign-up'
import Error404Page from '@/pages/error/404'


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />
  },
  {
    path: '/client',
    element: <ClientPage />
  },
  { 
    path: '/about',
    element: <AboutPage />
  },
  { 
    path: '/signin',
    element: <SignInPage />
  },
  { 
    path: '/signup',
    element: <SignUpPage />
  },
  {
    element: <AdminLayout />,
    children: [
      {
        path: '/admin',
        element: <AdminPage />
      },
      {
        path: '/admin/tickets',
        element: <AdminITServiceTicketsPage />
      },
      {
        path: '/admin/clients',
        element: <AdminClientsPage />
      },
      {
        path: '/admin/clients/create',
        element: <AdminClientForm />
      },
      {
        path: '/admin/users',
        element: <AdminUsersPage />
      },
      {
        path: '/admin/users/:userId',
        element: <AdminUserForm />
      },
      {
        path: '/admin/users/create',
        element: <AdminUserForm />
      },
      {
        path: '/admin/designations',
        element: <AdminDesignationsPage />
      },
      {
        path: '/admin/designations/create',
        element: <AdminDesignationForm />
      },
      {
        path: '/admin/offices',
        element: <AdminOfficesPage />
      },
      {
        path: '/admin/offices/create',
        element: <AdminOfficeForm />
      },
    ]
  },
  {
    path: '*',
    element: <Error404Page />
  }
])

export default router