import axios from "axios";

export interface ICategory {
  id: number;
  title: string;
  createDate: string;
}

export default async function getCategories(modelId: string) {
  const categoriesData: ICategory[] = await axios
    .post(`${process.env.API_URL}/api/getcategories/`, {
      w: modelId,
    })
    .then((res) => res.data);

  return categoriesData;
}
