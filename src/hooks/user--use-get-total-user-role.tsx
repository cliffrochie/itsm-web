import api from "@/hooks/use-api";
import { useState, useEffect } from "react";
import { handleAxiosError } from "@/utils/error-handler";

interface TotalUserRoles {
  total: number;
  totalAdmin: number;
  totalStaff: number;
  totalUser: number;
}

interface ThisResponse {
  totalUserRoles?: TotalUserRoles;
  loading: boolean;
  error?: object | string | undefined;
}


export default function useGetTotalUserRole(): ThisResponse {
  const [totalUserRoles, setTotalUserRoles] = useState<
    TotalUserRoles | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<object | string | undefined>(undefined);

  useEffect(() => {
    async function getTotalUserRoles() {
      try {
        setLoading(true);

        const [totalRes, adminRes, staffRes, userRes] = await Promise.allSettled([
          api.get("/users?limit=1"),
          api.get("/users?role=admin&limit=1"),
          api.get("/users?role=staff&limit=1"),
          api.get("/users?role=user&limit=1"),
        ]);

        const total =
          totalRes.status === "fulfilled"
            ? totalRes.value.data?.meta?.total ?? totalRes.value.data?.total ?? 0
            : 0;
        const totalAdmin =
          adminRes.status === "fulfilled"
            ? adminRes.value.data?.meta?.total ?? adminRes.value.data?.total ?? 0
            : 0;
        const totalStaff =
          staffRes.status === "fulfilled"
            ? staffRes.value.data?.meta?.total ?? staffRes.value.data?.total ?? 0
            : 0;
        const totalUser =
          userRes.status === "fulfilled"
            ? userRes.value.data?.meta?.total ?? userRes.value.data?.total ?? 0
            : 0;

        setTotalUserRoles({
          total,
          totalAdmin,
          totalStaff,
          totalUser,
        });
      } catch (error) {
        setError(handleAxiosError(error));
      } finally {
        setLoading(false);
      }
    }

    getTotalUserRoles();
  }, []);

  return { totalUserRoles, loading, error };
}
