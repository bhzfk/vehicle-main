import { useQuery } from "react-query";
import {
  fetchCheckpoints,
  fetchTotalPoints,
} from "services/checkpoints.service";

export const useCheckpoints = () => {
  const { data, isLoading, refetch } = useQuery("checkpoints", () =>
    fetchCheckpoints()
  );
  return { data, isLoading, refetch };
};

export const useTotalPoints = (
  vehicleId: string,
  areaId: number,
  areaType: number
) => {
  const { isLoading, data, refetch } = useQuery("totalPoints", () =>
    fetchTotalPoints(vehicleId, areaId, areaType)
  );

  return {
    totalPointsLoading: isLoading,
    totalPointsQuery: data,
    refetchTotalPoints: refetch,
  };
};
