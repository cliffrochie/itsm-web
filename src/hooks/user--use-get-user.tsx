import api from "@/hooks/use-api";
import { IUser } from "@/@types/user";
import { useState, useEffect } from "react";
import axios from "axios";

interface ThisResponse {
  user: IUser | null;
  loading: boolean;
  error?: string;
}

export default function useGetUser(url: string): ThisResponse {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const response = await api.get(url);
        setUser(response.data);
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

    getUser();
  }, [url]);

  return { user, loading, error };
}
