import { Outlet } from 'react-router-dom';
import SidebarLayout from "@/layouts/sidebar-layout"
import { ToastContainer, Slide } from 'react-toastify';
import { useState } from 'react';
import { INavLink } from '@/@types/nav-link';
import { Home, ListOrdered, UserRound, SquareUserRound, Settings, BriefcaseBusiness, Database, BicepsFlexed } from "lucide-react"


export default function StaffLayout() {
  const [links, setLinks] = useState<INavLink[]>([
    {
      title: 'Home',
      url: '/service-engineer',
      icon: Home,
      isActive: true
    },
    {
      title: 'History',
      url: '/service-engineer/history',
      icon: Database,
      isActive: false
    },
  ])

  return (
    <>
      <SidebarLayout links={links} setLinks={setLinks} />
    </>
  )
}
