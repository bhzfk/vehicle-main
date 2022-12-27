import axios from "axios";

export interface IArea {
  id: number;
  title: string;
  createDate: string;
  type: number;
  totalPoints?: number;
  solvedPoints?: number;
}

export const fetchAreas = async (): Promise<IArea[]> => {
  const response = await axios.get(process.env.API_URL + "/api/areas");
  return response.data;
};
