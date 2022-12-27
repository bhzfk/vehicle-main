import axios from "axios";

export interface IBrand {
  id: number;
  title: string;
  createDate: string;
}

export default async function getBrands() {
  const brandsData: IBrand[] = await axios
    .get(`${process.env.API_URL}/api/brands/`)
    .then((res) => res.data);

  return brandsData;
}
