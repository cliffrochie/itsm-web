import { Outlet } from 'react-router-dom';
import SidebarLayout from "@/layouts/sidebar-layout"
import { ToastContainer, Slide } from 'react-toastify';
import { useState } from 'react';
import { INavLink } from '@/@types/nav-link';
import { LayoutDashboard, ListOrdered, UserRound, SquareUserRound, BriefcaseBusiness, House } from "lucide-react"



export default function AdminLayout() {
  const [links, setLinks] = useState<INavLink[]>([
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
      isActive: true
    },
    {
      title: 'IT Service Tickets',
      url: '/admin/it-service-tickets',
      icon: ListOrdered,
      isActive: false
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: UserRound,
      isActive: false
    },
    {
      title: 'Clients',
      url: '/admin/clients',
      icon: SquareUserRound,
      isActive: false
    },
    {
      title: 'Designations',
      url: '/admin/designations',
      icon: BriefcaseBusiness,
      isActive: false
    },
    {
      title: 'Offices',
      url: '/admin/offices',
      icon: House,
      isActive: false
    },
  ])

  return (
    <>
      <SidebarLayout links={links} setLinks={setLinks} />
    </>
  )
}
