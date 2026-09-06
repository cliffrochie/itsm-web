import api from "@/hooks/use-api";
import { IOffice } from "@/@types/office";
import { useState, useEffect } from "react";
import axios from "axios";

interface ThisResponse {
  data: IOffice | null;
  loading: boolean;
  error?: string;
}

export default function useGetOffice(url: string): ThisResponse {
  const [data, setData] = useState<IOffice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function getOffice() {
      try {
        setLoading(true);
        const response = await api.get(url);
        setData(response.data);
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

    getOffice();
  }, [url]);

  return { data, loading, error };
}
