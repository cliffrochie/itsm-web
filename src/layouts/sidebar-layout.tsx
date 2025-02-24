import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Outlet } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import { AppSidebar } from "@/components/app-sidebar";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator"
import DropdownUser  from "@/components/app-dropdown-user";
import { INavLink } from "@/@types/nav-link";

export default function SidebarLayout({
  links,
  setLinks
}: {
  links: INavLink[],
  setLinks: Dispatch<SetStateAction<INavLink[]>>
}) {

  return (
    <SidebarProvider>
      <AppSidebar links={links} setLinks={setLinks} />
      <SidebarInset>
        <header className="flex z-50 h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 p-4 space-y-4 bg-white">
          <SidebarTrigger className="pt-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex justify-between w-full items-center">
            <AppBreadcrumb />
            <DropdownUser />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
        <main>
          <Outlet /> {/* Render child routes */}
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Slide}
          />
        </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

