import axios from "axios";

export interface ICondition {
  id: number;
  title: string;
  createDate: string;
  color: string;
  description: string;
}

export default async function getConditions() {
  const conditionsData: ICondition[] = await axios
    .get(`${process.env.API_URL}/api/conditions`)
    .then((res) => res.data);

  return conditionsData;
}
