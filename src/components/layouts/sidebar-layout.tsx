import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import DropdownUser from "@/components/app-dropdown-user";
import type { INavLink } from "@/@types/nav-link";
import { Button } from "@/components/ui/button";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import NotificationIcon from "@/components/app-notification-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetAuthUser from "@/hooks/user--use-auth-user";
import type { INotification } from "@/@types/notification";
import api from "@/lib/api-client";
import { Info, Trash } from "lucide-react";
import { connectSocket } from "@/lib/socket";
import { toast } from "sonner";

export default function SidebarLayout({
  links,
  setLinks,
}: {
  links: INavLink[];
  setLinks: Dispatch<SetStateAction<INavLink[]>>;
}) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const { authUser } = useGetAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const queryKey = ["notifications", authUser?.id];

  useEffect(() => {
    const userId = authUser?.id;
    if (userId) {
      const socket = connectSocket(userId);
      const handleNewNotification = (notification: { message?: string }) => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast.info(notification.message || "New notification received");
      };
      socket.on("notification:new", handleNewNotification);
      return () => {
        socket.off("notification:new", handleNewNotification);
      };
    }
  }, [authUser, queryClient]);

  const dq = useQuery({
    queryKey,
    queryFn: async () => {
      if (!authUser) return [];
      const response = await api.get("/notifications", {
        params: { limit: 50 },
      });
      const list: INotification[] =
        response.data?.data || response.data || [];
      return list.filter((n) => !n.isRead);
    },
    placeholderData: keepPreviousData,
  });

  const updateNotificationMutation = useMutation({
    mutationKey: ["updateNotificationMutation"],
    mutationFn: async (data: string | number) => {
      await api.patch(`/notifications/${data}/read`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const clearNotificationMutation = useMutation({
    mutationKey: ["clearNotificationMutation"],
    mutationFn: async () => {
      await api.patch(`/notifications/read-all`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  function redirectToTicket(
    notificationId?: string | number,
    ticketId?: string | number | null,
    ticketNo?: string
  ) {
    if (ticketId && authUser?.role === "admin") {
      navigate("/admin/it-service-tickets/" + ticketId + "/view", {
        replace: true,
      });
    } else if (ticketNo) {
      if (
        authUser?.role === "service_engineer" ||
        authUser?.role === "staff"
      ) {
        navigate("/service-engineer/" + ticketNo, { replace: true });
      } else {
        navigate("/client/" + ticketNo, { replace: true });
      }
    } else if (ticketId) {
      navigate("/admin/it-service-tickets/" + ticketId + "/view", {
        replace: true,
      });
    }

    if (notificationId) {
      updateNotificationMutation.mutate(notificationId);
    }
  }

  function clearAllNotifications() {
    clearNotificationMutation.mutate();
  }

  useEffect(() => {
    if (dq.data) {
      setNotifications(dq.data);
    }
  }, [dq.data]);

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
                  <Button variant="ghost" className="">
                    <NotificationIcon count={notifications.length} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[min(90vw,400px)]"
                >
                  <DropdownMenuLabel className="text-md">
                    Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications && notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id ?? notification.message}
                        className="py-4 text-sm cursor-pointer"
                        onClick={() =>
                          redirectToTicket(
                            notification.id,
                            notification.ticketId,
                            notification.ticketNo
                          )
                        }
                      >
                        <Info />
                        <span className="">{notification.message}</span>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem className="py-4 text-sm cursor-pointer">
                      No notifications as of now.
                    </DropdownMenuItem>
                  )}
                  {notifications && notifications.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="py-4 text-sm cursor-pointer bg-gray-100"
                        onClick={() => clearAllNotifications()}
                      >
                        <Trash />
                        <span className="font-medium">
                          Clear all notifications.
                        </span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownUser />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <main>
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
