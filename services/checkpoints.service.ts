import axios from "axios";

export interface ICheckpoint {
  id: number;
  title: string;
  type: string;
  zoneId: number;
  zoneTitle: string;
  createDate: string;
}

export const checkpointStatus: { value: string; message: string }[] = [

  { value: "internal_workshop", message: "Interne Werkstatt"},
  { value: "external_workshop", message: "Externe Werkstatt"},
  { value: "ok", message: "OK" },
  { value: "internal_ok", message: "Erledigt"},
  { value: "external_ok", message: "Erledigt"},
  // { value: "partOk", message: "Spare part ok" },
  // { value: "done", message: "Repair done(completed)" },
  // { value: "pending", message: "Repair pending(not completed)" },
  // { value: "no", message: "Spare part or workshop required(not completed)" },
];

export const fetchCheckpoints = async (): Promise<ICheckpoint[]> => {
  const response = await axios.get(`${process.env.API_URL}/api/checkpoints/`);
  return response.data;
};

export const solveCheckpointsByArea = async (zoneId, vehicleId) => {
  const resp = await axios.post(
    `${process.env.API_URL}/api/checkAllCheckooints`,
    { zoneId, vehicleId }
  );
  return resp.data;
};

export const solveCheckpointsByStep = async (
  type: number,
  vehicleId: number
) => {
  const resp = await axios.post(
    `${process.env.API_URL}/api/megaActionCheckpoint`,
    { type, vehicleId }
  );
  return resp.data;
};

export const fetchTotalPoints = async (
  vehicleId: string,
  areaId: number,
  areaType: number
): Promise<number> => {
  const response = await axios.get(
    process.env.API_URL +
      "/api/gettotalpoints/" +
      vehicleId +
      "/" +
      areaId +
      "?atype=" +
      areaType
  );

  return response.data;
};

/**
 * Returns the solved points for a specific area
 */
export const fetchDonePoints = async (
  vehicleId: number,
  areaId: number,
  areaType: number
): Promise<number> => {
  // const response = await axios.get(
  //   process.env.API_URL +
  //     "/api/gettotaldonepoints/" +
  //     vehicleId +
  //     "/" +
  //     areaId +
  //     "?atype=" +
  //     areaType
  // );

  // return response.data;
  return 0;
};

export const fetchCheckPoints = async (): Promise<ICheckpoint[]> => {
  const response = await axios.get(process.env.API_URL + "/api/checkpoints/");
  return response.data;
};
