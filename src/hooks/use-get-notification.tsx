import api from "@/hooks/use-api";
import { INotification } from "@/@types/notification";
import { useState, useEffect } from "react";
import axios from "axios";

interface ThisResponse {
  notifications: INotification | null;
  loading: boolean;
  error?: string;
}

export default function useGetNotifications(userId: string): ThisResponse {
  const [notifications, setNotifications] = useState<INotification | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function get() {
      try {
        setLoading(true);
        const response = await api.get(
          `/api/notifications?userId=${userId}&noPage=true`
        );
        setNotifications(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      get();
    }
  }, [userId]);

  return { notifications, loading, error };
}
