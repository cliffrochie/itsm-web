import { Outlet } from 'react-router-dom';
import SidebarLayout from "@/layouts/sidebar-layout"
import { ToastContainer, Slide } from 'react-toastify';
import { useState } from 'react';
import { INavLink } from '@/@types/nav-link';
import { Tickets, TicketCheckIcon, ListOrdered, UserRound, SquareUserRound, Settings, BriefcaseBusiness, Database, BicepsFlexed } from "lucide-react"


export default function StaffLayout() {
  const [links, setLinks] = useState<INavLink[]>([
    {
      title: 'Active Tickets',
      url: '/service-engineer',
      icon: Tickets,
      isActive: true
    },
  ])

  return (
    <>
      <SidebarLayout links={links} setLinks={setLinks} />
    </>
  )
}
