import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { LayoutDashboard, ListOrdered, UserRound, SquareUserRound, Settings, BriefcaseBusiness, House } from "lucide-react"
import { NavLink, useLocation } from 'react-router-dom'
import { INavLink } from '@/@types/nav-link'
import { isNumeric } from '@/utils'
import ReactImg from '@/assets/react.svg'

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



export function AppSidebar({
  links,
  setLinks
}: {
  links: INavLink[],
  setLinks: Dispatch<SetStateAction<INavLink[]>>
}) {
  const location = useLocation()
  let usePath = ''

  useEffect(() => {
    const currentPath = location.pathname.split('/')

    if(currentPath[currentPath.length-1] === 'create') {
      for(let i=0; i<currentPath.length-1; i++) {
        usePath += currentPath[i]
        if(i !== currentPath.length-2) {
          usePath += '/'
        }
      }
    }
    else if(currentPath[currentPath.length-1] === 'update' || currentPath[currentPath.length-1] === 'view') {
      for(let i=0; i<currentPath.length-2; i++) {
        usePath += currentPath[i]
        if(i < currentPath.length-1) {
          usePath += '/'
        }
      }

      usePath = usePath.substring(0, usePath.length-1)
    }
    else if(currentPath[currentPath.length-1] === 'admin') {
      usePath = '/admin'
    }
    else if(currentPath[currentPath.length-1] === 'service-engineer') {
      usePath = '/service-engineer'
    }
    else {
      for(let i=0; i<currentPath.length; i++) {
        usePath += currentPath[i]
        if(i !== currentPath.length-1) {
          usePath += '/'
        }
      }
    }

    // console.log(currentPath)
    // console.log(usePath)

    if(usePath.slice(-1) === '/') {
      usePath = usePath.slice(0, -1)
    }

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
          <div className="flex justify-center py-4">
            <img src={ReactImg} width="70" />
          </div>
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


