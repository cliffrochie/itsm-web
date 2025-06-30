import api from "@/hooks/use-api";
import { useState, useEffect } from "react";
import { handleAxiosError } from "@/utils/error-handler";

interface Tickets {
  totalTickets: number;
  totalComputer: number;
  totalPrinter: number;
  totalMobileDevice: number;
  totalNetworkRelated: number;
  totalSoftwareApplication: number;
  totalOthers: number;
}

interface ThisResponse {
  totalEquipmentTypes?: Tickets;
  loading: boolean;
  error?: object | string | undefined;
}

const queryParams = [
  "totalComputer",
  "totalPrinter",
  "totalScanner",
  "totalMobileDevice",
  "totalNetworkRelated",
  "totalSoftwareApplication",
  "totalOthers",
];

export default function useGetTotalEquipmentType(): ThisResponse {
  const [totalEquipmentTypes, setTotalEquipmentTypes] = useState<
    Tickets | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<object | string | undefined>(undefined);

  let url = "/api/service-tickets/total-equipment-type/?totalTickets=true";
  queryParams.forEach((a) => (url += `&${a}=true`));

  // console.log(url)

  useEffect(() => {
    async function getTotalEquipmentTypes() {
      try {
        setLoading(true);

        const response = await api.get(url);
        if (response.status === 200) {
          setTotalEquipmentTypes(response.data);
        }
      } catch (error) {
        setError(handleAxiosError(error));
      } finally {
        setLoading(false);
      }
    }

    getTotalEquipmentTypes();
  }, []);

  return { totalEquipmentTypes, loading, error };
}
