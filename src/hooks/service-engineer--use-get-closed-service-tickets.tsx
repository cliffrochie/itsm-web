import api from "@/hooks/use-api";
import { useState, useEffect } from "react";
import { IServiceTicket } from "@/@types/service-ticket";
import { handleAxiosError } from "@/utils/error-handler";
import { useAuthStore } from "@/stores/authStore";

interface ThisResponse {
  closedTickets?: IServiceTicket[];
  loading: boolean;
  error?: object | string | undefined;
}

export default function useGetClosedServiceTickets(): ThisResponse {
  const user = useAuthStore((state) => state.user);
  const [closedTickets, setClosedTickets] = useState<IServiceTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<object | string | undefined>(undefined);

  useEffect(() => {
    async function get() {
      try {
        setLoading(true);
        const params: Record<string, unknown> = {
          limit: 100,
          serviceStatus: "closed",
        };
        if (user?.id) {
          params.serviceEngineerId = user.id;
        }
        const response = await api.get("/service-tickets", { params });
        if (response.status === 200) {
          const list: IServiceTicket[] =
            response.data?.data || response.data || [];
          setClosedTickets(list);
        }
      } catch (err) {
        setError(handleAxiosError(err));
      } finally {
        setLoading(false);
      }
    }

    get();
  }, [user?.id]);

  return { closedTickets, loading, error };
}
