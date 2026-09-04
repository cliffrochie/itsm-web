import { Outlet, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Info, Trash } from "lucide-react";
import DropdownUser from "@/components/app-dropdown-user";
import Logo from "@/assets/images/logo.svg";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import { INotification } from "@/@types/notification";
import useGetAuthUser from "@/hooks/user--use-auth-user";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/hooks/use-api";
import NotificationIcon from "@/components/app-notification-icon";
import { connectSocket } from "@/lib/socket";

export default function UserLayout() {
  const isSmallScreen = useMediaQuery({ maxWidth: 600 });

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const { authUser } = useGetAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const queryKey = ["notifications", authUser?.id ?? authUser?._id];

  useEffect(() => {
    const userId = authUser?.id ?? (authUser as any)?._id;
    if (userId) {
      const socket = connectSocket(userId);
      const handleNewNotification = (notification: any) => {
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
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  const clearNotificationMutation = useMutation({
    mutationKey: ["clearNotificationMutation"],
    mutationFn: async () => {
      await api.patch(`/notifications/read-all`);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    },
  });

  useEffect(() => {
    if (dq.data) {
      setNotifications(dq.data);
    }
  }, [dq.data]);

  function redirectToTicket(
    notificationId?: string | number,
    ticketId?: string | number | null,
    ticketNo?: string
  ) {
    if (ticketId && authUser?.role === "admin") {
      navigate("/admin/it-service-tickets/" + ticketId + "/view");
    } else if (ticketNo) {
      if (
        authUser?.role === "service_engineer" ||
        authUser?.role === "staff"
      ) {
        navigate("/service-engineer/" + ticketNo);
      } else {
        navigate("/client/" + ticketNo);
      }
    } else if (ticketId) {
      navigate("/admin/it-service-tickets/" + ticketId + "/view");
    }

    if (notificationId) {
      updateNotificationMutation.mutate(notificationId);
    }
  }

  function navigateToHome() {
    if (
      authUser?.role === "service_engineer" ||
      authUser?.role === "staff"
    ) {
      navigate("/service-engineer");
    } else if (authUser?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/client");
    }
  }

  function clearAllNotifications() {
    clearNotificationMutation.mutate();
  }

  return (
    <>
      <nav className="px-8 border-b-[0.5px] border-gray-200 mb-7 sticky top-0 p-1 bg-white z-10">
        <div className="flex align-middle items-center justify-between mt-1 mb-1 ">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <img src={Logo} width="45" alt="logo" className="" />
            <div
              className="text-lg font-semibold cursor-pointer hover:text-gray-400"
              onClick={() => navigateToHome()}
            >
              {isSmallScreen ? "ITSM" : "IT Service Management System"}
            </div>
          </div>
          {/* Dropdown on the right */}
          <div className="flex gap-1 justify-end items-center w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="">
                  <NotificationIcon count={notifications.length} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[min(90vw,400px)]">
                <DropdownMenuLabel className="text-md">
                  Notifications
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications && notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id ?? notification._id ?? notification.message}
                      className="py-4 text-sm cursor-pointer"
                      onClick={() =>
                        redirectToTicket(
                          notification.id ?? notification._id,
                          notification.ticketId ?? notification.serviceTicket,
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
      </nav>
      <section className="grid mx-4 custom-md:grid-cols-1 gap-4 custom-lg:mx-40 custom-md:mx-30 custom-sm:mx-20">
        <Outlet /> {/* Render child routes */}
        <ToastContainer />
      </section>
    </>
  );
}
