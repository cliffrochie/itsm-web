import api from "@/hooks/use-api";
import { IUser } from "@/@types/user";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

interface ThisResponse {
  authUser: IUser | null;
  loading: boolean;
  error?: object | string | undefined;
}

export default function useAuthUser(): ThisResponse {
  const storeUser = useAuthStore((state) => state.user);
  const [authUser, setAuthUser] = useState<IUser | null>(
    (storeUser as unknown as IUser) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<object | string | undefined>(undefined);

  useEffect(() => {
    if (storeUser) {
      setAuthUser(storeUser as unknown as IUser);
      return;
    }

    async function getUser() {
      try {
        setLoading(true);
        const response = await api.get("/auth/me");
        const userData = response.data?.data || response.data;
        setAuthUser(userData);
      } catch (err: any) {
        setError(err?.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [storeUser]);

  return { authUser, loading, error };
}
