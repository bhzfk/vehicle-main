import axios from "axios";

export interface IModel {
  id: number;
  brandId: number;
  title: string;
  createDate: string;
}

export default async function getModels(brandId: string) {
  const modelsData: IModel[] = await axios
    .post(`${process.env.API_URL}/api/getmodels/`, {
      w: brandId,
    })
    .then((res) => res.data);

  return modelsData;
}
