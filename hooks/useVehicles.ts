import { fetchVehicleCheckpoints } from "./../services/vehicles.service";
import axios from "axios";
import { useQuery } from "react-query";
import { fetchVehicles, IVehicle } from "services/vehicles.service";

export default function useVehicles(token: string) {
  const { isLoading, data, refetch, isError } = useQuery("vehicles", () =>
    fetchVehicles(token)
  );

  return {
    vehiclesLoading: isLoading,
    vehiclesQuery: data,
    refetchVehicles: refetch,
    isError,
  };
}

export function useVehicleCheckpoints(vehicleId: string) {
  const query = useQuery(["vehicleCheckpoints", vehicleId], () =>
    fetchVehicleCheckpoints(vehicleId)
  );

  return query;
}

export function useVehiclesArchive(token: string) {
  return useQuery("workshop", () =>
    axios
      .post(`${process.env.API_URL}/api/vehicleList/workShopArchive`, {
        token,
      })
      .then((res) => res.data.data)
  );
}

export function useVehiclesDelivered(token: string) {
  return useQuery("delivered", () =>
    axios
      .post(`${process.env.API_URL}/api/vehicleList/delivered`, {
        token,
      })
      .then((res) => res.data.data)
  );
}

export function useVehicle(token: string, id: number) {
  const { isLoading, data, refetch } = useQuery(["vehicle", id], () =>
    axios
      .post(`${process.env.API_URL}/api/vehicleList/?id=${id}`, {
        token,
      })
      .then((res) => res.data.data)
  );
  const vehicleInfo: IVehicle[] = data;
  return { isLoading, vehicleInfo, refetch };
}

export function useBusinessEvaluation(token: string) {
  return useQuery("business", () =>
    axios
      .post(`${process.env.API_URL}/api/vehicleList/all`, {
        token,
      })
      .then((res) => res.data.data)
  );
}

//   const [vehicles, setVehicles] = useState<IVehicle[]>([]);
//   const [error, setError] = useState(null);
//   const [status, setStatus] = useState("loading");

//   const refetch = async () => {
//     try {
//       setStatus("loading");
//       const vehicles = await axios
//         .post(`${process.env.API_URL}/api/vehicleList/`, {
//           token,
//         })
//         .then((res) => res.data.data);
//       setVehicles(vehicles);
//       setError(null);
//       setStatus("success");
//     } catch (err) {
//       setError(err);
//       setStatus("error");
//     }
//   };

//   useEffect(() => {
//     refetch();
//   }, []);

//   return {
//     vehicles,
//     status,
//     error,
//     refetch,
//   };
