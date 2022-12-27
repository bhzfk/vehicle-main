import axios from "axios";
import { ICheckpoint } from "services/checkpoints.service";
export interface IZone {
  id: number;
  title: string;
  areaId: number;
  areaTitle: string;
  createDate: string;
  checkpoints?: ICheckpoint[];
}

export const fetchZones = async (): Promise<IZone[]> => {
  const response = await axios.get(process.env.API_URL + "/api/zones/");
  return response.data;
};
