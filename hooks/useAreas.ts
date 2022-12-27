/* eslint-disable react-hooks/exhaustive-deps */
import { fetchDonePoints } from "./../services/checkpoints.service";
import { useQuery } from "react-query";
import { fetchAreas } from "services/area.service";
import { fetchTotalPoints } from "services/checkpoints.service";
import { useMemo } from "react";

export const useAreas = (vehicleId: string, checkCasualTab) => {
  const { isLoading, data, refetch } = useQuery("areas", () => fetchAreas());

  let progressSolved = 0;
  let progressTotal = 0;
  let areasQuery;

  useMemo(() => {
    areasQuery = [...data];
    areasQuery.forEach(async (area) => {
      const totalPoints = await fetchTotalPoints(vehicleId, area.id, area.type);
      const solvedPoints = await fetchDonePoints(
        +vehicleId,
        area.id,
        area.type
      );
      progressSolved += solvedPoints;
      progressTotal += totalPoints;
      area.totalPoints = totalPoints;
      area.solvedPoints = solvedPoints;
    });
  }, [data]);

  return {
    totalProgress: { solved: progressSolved, total: progressTotal },
    areasLoading: isLoading,
    areasQuery,
    refetchAreas: refetch,
  };
};
