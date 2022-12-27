import { useQuery } from "react-query";
import { fetchZones } from "services/zone.service";

export const useZones = () => {
  const { isLoading, data, refetch } = useQuery("zones", () => fetchZones());

  return {
    areZonesLoading: isLoading,
    zonesQuery: data,
    refetchZones: refetch,
  };
};
