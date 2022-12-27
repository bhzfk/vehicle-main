import axios from "axios";

export default async function submitVehicle(formData: FormData) {
  const resp = await axios.post(process.env.API_URL + "/api/vehicle", formData);
  const { vehicleId } = resp.data;
  return { vehicleId, status: resp.status };
}
