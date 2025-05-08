import { Outlet, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import DropdownUser from '@/components/app-dropdown-user';
import Logo from '@/assets/images/logo.svg'
import { useMediaQuery } from 'react-responsive'
import { useEffect, useState } from 'react';
import { INotification } from '@/@types/notification';
import useGetAuthUser from '@/features/user/hooks/use-auth-user';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/hooks/use-api';
import NotificationIcon from '@/components/app-notification-icon';



export default function UserLayout() {
  const isSmallScreen = useMediaQuery({ maxWidth: 600 })

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

    function navigateToHome() {
      if(authUser?.role === 'staff') {
        navigate('/service-engineer')
      }
      else if(authUser?.role === 'user') {
        navigate('/client')
      }
    }

  return (
    <>
      <nav className="px-8 border-b-[0.5px] border-gray-200 mb-7 sticky top-0 p-1 bg-white z-10">
        <div className="flex align-middle items-center justify-between mt-1 mb-1 ">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img src={Logo} width="45" alt="logo" className="" />
            <div className="text-lg font-semibold cursor-pointer hover:text-gray-400" onClick={() => navigateToHome() }>{isSmallScreen ? 'ITSM' : 'IT Service Management System'}</div>
          </div>
          {/* Dropdown on the right */}
          <div className="flex gap-1 justify-end items-center w-auto">
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
      </nav>
      <section className="grid mx-4 custom-md:grid-cols-1 gap-4 custom-lg:mx-40 custom-md:mx-30 custom-sm:mx-20">
        <Outlet /> {/* Render child routes */}
        <ToastContainer />
      </section>
      </>
  )
}