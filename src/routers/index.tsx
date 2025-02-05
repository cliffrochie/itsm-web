import React, { Suspense, lazy } from "react";
import { createBrowserRouter, redirect, useLocation } from 'react-router-dom'
import api from '@/services/use-api'
import { AxiosError, isAxiosError } from "axios";

const AdminLayout = lazy(() => import('@/layouts/admin-layout'))
const AdminPage = lazy(() => import('@/pages/admin'))
const AdminITServiceTicketsPage = lazy(() => import('@/pages/admin/it-service-tickets'))
const AdminITServiceTicketForm = lazy(() => import('@/pages/admin/it-service-tickets/it-service-ticket-form'))
const AdminClientsPage = lazy(() => import('@/pages/admin/clients'))
const AdminClientForm = lazy(() => import('@/pages/admin/clients/client-form'))
const AdminUsersPage = lazy(() => import('@/pages/admin/users'))
const AdminUserForm = lazy(() => import('@/pages/admin/users/user-form'))
const AdminDesignationsPage = lazy(() => import('@/pages/admin/designations'))
const AdminDesignationForm = lazy(() => import('@/pages/admin/designations/designation-form'))
const AdminOfficesPage = lazy(() => import('@/pages/admin/offices'))
const AdminOfficeForm = lazy(() => import('@/pages/admin/offices/office-form'))
const HomePage = lazy(() => import('@/pages'))
const ClientPage = lazy(() => import('@/pages/client'))
const AboutPage = lazy(() => import('@/pages/about/index'))
const SignInPage = lazy(() => import('@/pages/auth/sign-in'))
const SignUpPage = lazy(() => import('@/pages/auth/sign-up'))
const Error404Page = lazy(() => import('@/pages/error/404'))
const Error403Page = lazy(() => import('@/pages/error/403'))
const ITServiceTicketView = lazy(() => import('@/pages/admin/it-service-tickets/it-service-ticket-view'))
const StaffLayout = lazy(() => import('@/layouts/staff-layout'))
const ServiceEngineerPage = lazy(() => import('@/pages/service-engineer'))
const ServiceEngineerITServiceTicket = lazy(() => import('@/pages/service-engineer/it-service-ticket'))
const ServiceEngineerRecords = lazy(() => import('@/pages/service-engineer/records'))



async function adminPrivilegeLoader() {
  try {
    const response = await api.get('/api/users/current-user', { withCredentials: true })
    if(response.status === 200 && response.data.role === 'admin') {
      return response.data
    }
    else {
      console.log('admin-privilege: else')
      throw redirect('/unauthorized')
    }
  }
  catch(error) {
    console.log('admin-privilege: catch')
    throw redirect('/unauthorized')
  }
}


async function staffPrivilegeLoader() {
  try {
    const response = await api.get('/api/users/current-user', { withCredentials: true })
    if(response.status === 200 && response.data.role === 'staff') {
      return response.data
    }
    else {
      console.log('staff-privilege: else')
      throw redirect('/unauthorized')
    }
  }
  catch(error) {
    console.log('staff-privilege: catch')
    console.log(error)
    throw redirect('/unauthorized')
  }
}

async function userPrivilegeLoader() {
  try {
    const response = await api.get('/api/users/current-user', { withCredentials: true })
    if(response.data.role === 'user') {
      return response.data
    }
    else {
      throw redirect('/unauthorized')
    }
  }
  catch(error) {
    throw redirect('/unauthorized')
  }
}

async function authenticatedLoader() {
  try {
    const response = await api.get('/api/users/current-user', { withCredentials: true })
    if(response.status === 200) {
      throw redirect('/unauthorized')
    }
    else {
      return
    }
  }
  catch(error) {
    console.log(isAxiosError(error))
  }
}


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/about',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
        <AboutPage />
      </Suspense>
    ),
  },
  {
    path: '/client',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
        <ClientPage />
      </Suspense>
    ),
  },
  { 
    path: '/sign-in',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
        <SignInPage />
      </Suspense>
    ),
    loader: authenticatedLoader,
  },
  { 
    path: '/sign-up',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
        <SignUpPage />
      </Suspense>
    ),
    loader: authenticatedLoader,
  },
  {
    path: '/service-engineer',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
        <StaffLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <ServiceEngineerPage />
          </Suspense>
        ),
        loader: staffPrivilegeLoader,
      },
      {
        path: '/service-engineer/it-service-tickets',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <ServiceEngineerITServiceTicket />
          </Suspense>
        ),
        loader: staffPrivilegeLoader,
      },
      {
        path: '/service-engineer/records',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <ServiceEngineerRecords />
          </Suspense>
        ),
        loader: staffPrivilegeLoader,
      },
    ]
  },
  { 
    path: '/admin',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
        <AdminLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminPage />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/it-service-tickets',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminITServiceTicketsPage />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/it-service-tickets/create',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminITServiceTicketForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/it-service-tickets/:serviceTicketId/update',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminITServiceTicketForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/it-service-tickets/:serviceTicketId/view',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <ITServiceTicketView />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/clients',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminClientsPage />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/clients/create',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminClientForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/clients/:clientId/update',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminClientForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/users',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminUsersPage />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/users/create',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminUserForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/users/:userId',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminUserForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/users/:userId/update',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminUserForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/designations',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminDesignationsPage />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/designations/create',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminDesignationForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/designations/:designationId/update',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminDesignationForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/offices',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminOfficesPage />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/offices/create',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminOfficeForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
      {
        path: '/admin/offices/:officeId/update',
        element: (
          <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
            <AdminOfficeForm />
          </Suspense>
        ),
        loader: adminPrivilegeLoader,
      },
    ]
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
        <Error404Page />
      </Suspense>
    ),
  },

  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<div className="flex justify-center items-center h-screen max-h-screen w-full"><span>Loading...</span></div>}>
        <Error403Page />
      </Suspense>
    ),
  }
])

export default router







