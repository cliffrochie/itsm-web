import api from "@/hooks/use-api";
import { useState, useEffect } from "react";
import { IServiceTicket } from "@/@types/service-ticket";
import { handleAxiosError } from "@/utils/error-handler";
import { useAuthStore } from "@/stores/authStore";

interface ThisResponse {
  assignedTickets?: IServiceTicket[];
  loading: boolean;
  error?: object | string | undefined;
}

export default function useGetAssignedServiceTickets(): ThisResponse {
  const user = useAuthStore((state) => state.user);
  const [assignedTickets, setAssignedTickets] = useState<IServiceTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<object | string | undefined>(undefined);

  useEffect(() => {
    async function get() {
      try {
        setLoading(true);
        const params: Record<string, any> = { limit: 100 };
        if (user?.id) {
          params.serviceEngineerId = user.id;
        }
        const response = await api.get("/service-tickets", { params });
        if (response.status === 200) {
          const list: IServiceTicket[] =
            response.data?.data || response.data || [];
          setAssignedTickets(list.filter((t) => t.serviceStatus !== "closed"));
        }
      } catch (err) {
        setError(handleAxiosError(err));
      } finally {
        setLoading(false);
      }
    }

    get();
  }, [user?.id]);

  return { assignedTickets, loading, error };
}
