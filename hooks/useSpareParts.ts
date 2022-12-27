import { fetchSpareParts } from "services/spares.service";
import axios from "axios";
import { useQuery } from "react-query";

export const useSpareParts = () => {
  return useQuery("spareparts", () => fetchSpareParts());
};

export function useSparePartForVehicle(id: number) {
  const { isLoading, data, refetch } = useQuery(["vehiclespareparts", id], () =>
    axios
      .get(`${process.env.API_URL}/api/spareparts/${id}`)
      .then((res) => res.data)
  );

  return { sparesLoading: isLoading, spareData: data, refetch };
}
