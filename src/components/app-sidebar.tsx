import { useState, useEffect } from 'react'
import { LayoutDashboard, ListOrdered, UserRound, SquareUserRound, Settings, BriefcaseBusiness, House } from "lucide-react"
import { NavLink, useLocation } from 'react-router-dom'
import { INavLink } from '@/@types/nav-link'
import { isNumeric } from '@/utils'

import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuButton
} from "@/components/ui/sidebar"



export function AppSidebar() {
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
    // {
    //   title: 'Settings',
    //   url: '/admin/settings',
    //   icon: Settings,
    //   isActive: false
    // },
  ])

  const location = useLocation()
  let usePath = ''

  useEffect(() => {
    const currentPath = location.pathname.split('/')

    if(
      isNumeric(currentPath[currentPath.length-1]) || 
      currentPath[currentPath.length-1] === 'create' ||
      currentPath[currentPath.length-1] === 'update'
    ) {
      for(let i=0; i<currentPath.length-1; i++) {
        usePath += currentPath[i]
        if(i !== currentPath.length-2) {
          usePath += '/'
        }
      }
    }
    else {
      for(let i=0; i<currentPath.length; i++) {
        usePath += currentPath[i]
        if(i !== currentPath.length-1) {
          usePath += '/'
        }
      }
    }

    console.log(usePath)

    const updatedLinks = links.map((link) => ({
      ...link,
      isActive: usePath === link.url
    }))
    setLinks(updatedLinks)
  }, [location.pathname])

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold">Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu> 
              {links.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={item.isActive ? "font-bold bg-gray-200": ""}>
                    <NavLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}