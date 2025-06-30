import api from "@/hooks/use-api";
import { useState, useEffect } from "react";
import { IServiceTicket } from "@/@types/service-ticket";
import { handleAxiosError } from "@/utils/error-handler";

interface ThisResponse {
  requestedTickets?: IServiceTicket[];
  loading: boolean;
  error?: object | string | undefined;
}

export default function useGetRequestedServiceTicket(): ThisResponse {
  const [requestedTickets, setAssignedTickets] = useState<
    IServiceTicket[] | []
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<object | string | undefined>(undefined);

  let url = "/api/service-tickets/requested";

  useEffect(() => {
    async function get() {
      try {
        setLoading(true);
        const response = await api.get(url);
        if (response.status === 200) {
          setAssignedTickets(response.data);
        }
      } catch (error) {
        setError(handleAxiosError(error));
      } finally {
        setLoading(false);
      }
    }

    get();
  }, []);

  return { requestedTickets, loading, error };
}
