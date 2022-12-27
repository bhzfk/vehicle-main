import { fixDateFormat } from "utils/format";
import axios from "axios";
import moment from "moment";

export interface IUpdateVehiclePriceRates {
  purchasePrice: string;
  inevtoryCost: number;
  processingCost: number;
  sparePartsTotalCost: number;
  workshop_i_cost: number;
  workshop_e_cost: number;
  standCosts: number;
  preparationCost: number;
  vehicleId: string;
  financed: number;
  identificationNumber: string;
  customerName: string;
}

export default async function updateVehicle(data: IUpdateVehiclePriceRates) {
  console.log(data);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(data);

  var requestOptions: RequestInit = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(process.env.API_URL + "/api/updateVehiclePriceRates", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      return result;
    })
    .catch((error) => console.log("error", error));
}

export const updatePriceAndSetForSale = async (
  saleDate: string,
  salePrice: number,
  vehicleId: string,
  token: string
): Promise<boolean> => {
  const newDate = fixDateFormat(saleDate);
  await axios.post(process.env.API_URL + "/api/submitSold", {
    saleDate: newDate,
    salePrice,
    vehicleId,
    token,
  });
  const updatePriceResp = await axios.get(
    process.env.API_URL + "/api/updateStandCosts/" + vehicleId
  );
  return updatePriceResp.data.result;
};

export const updateVehicleImage = async (vehicleId, formData) => {
  const resp = await axios.post(
    process.env.API_URL + "/api/update_vehicle_image/" + vehicleId,
    formData
  );
  return resp;
};
