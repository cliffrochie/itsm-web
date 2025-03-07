import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import { AppSidebar } from "@/components/app-sidebar";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator"
import DropdownUser  from "@/components/app-dropdown-user";
import { INavLink } from "@/@types/nav-link";
import { Button } from "@/components/ui/button";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import NotificationIcon from "@/components/app-notification-icon";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useGetAuthUser from "@/features/user/hooks/use-get-current-user";
import useGetNotifications from "@/hooks/use-get-notification";
import { INotification } from "@/@types/notification";
import api from "@/hooks/use-api";
import { Info } from "lucide-react";



export default function SidebarLayout({
  links,
  setLinks
}: {
  links: INavLink[],
  setLinks: Dispatch<SetStateAction<INavLink[]>>
}) {
  const [notifications, setNotifications] = useState<INotification[] | []>([])
  const { authUser } = useGetAuthUser()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const queryKey = ['notifications', authUser]

  const dq = useQuery({
    queryKey,
    queryFn: async () => {
      let data: INotification[] = []
      let url = ''
      if(authUser) {
        url = `/api/notifications?userId=${authUser._id}&noPage=true&sort=-createdAt&isRead=false`
      }

      await api.get(url).then(response => {
        data = response.data
      })

      return data
    },
    placeholderData: keepPreviousData
  })

  const updateNotificationMutation = useMutation({
    mutationKey: ['updateNotificationMutation'],
    mutationFn: async (data: string) => {
      await api.put(`/api/notifications/${data}/read`).then(response => {
        if(response.status === 200) {
          console.log('read')
        }
      })
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKey })
    }
  })

  useEffect(() => {
    if(dq.data) {
      console.log(dq.data)
      setNotifications(dq.data)
    }
  }, [dq.data])

  function redirectToTicket(notificationId: string, serviceTicketId: string, ticketNo: string) {
    if(authUser?.role === 'admin' || authUser?.role === 'superadmin') {
      navigate('/admin/it-service-tickets/'+ serviceTicketId +'/view')
    }
    else if(authUser?.role === 'staff') {
      navigate('/service-engineer/'+ ticketNo)
    }
    else {
      navigate('/client/'+ ticketNo)
    }

    updateNotificationMutation.mutate(notificationId)
  }


  return (
    <SidebarProvider>
      <AppSidebar links={links} setLinks={setLinks} />
      <SidebarInset>
        <header className="flex z-50 h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 p-4 space-y-4 bg-white">
          <SidebarTrigger className="pt-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex justify-between w-full items-center">
            <AppBreadcrumb />
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className=""><NotificationIcon count={notifications.length} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[min(90vw,400px)]">
                  <DropdownMenuLabel className="text-md">Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  { notifications && notifications.length > 0 ? notifications.map((notification) => (
                    <DropdownMenuItem key={notification.message} className="py-4 text-sm cursor-pointer" onClick={() => redirectToTicket(notification._id, notification.serviceTicket, notification.ticketNo) }>
                      <Info /><span className="">{notification.message}</span>
                    </DropdownMenuItem>
                  )): (
                    <DropdownMenuItem className="py-4 text-sm cursor-pointer">
                      No notifications as of now.
                    </DropdownMenuItem>
                  )}

                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownUser />
            </div>
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

