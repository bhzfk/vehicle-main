export interface IBEvaluation {
  ArriveCount: number;
  InventoryRate: number;
  OpenCount: number;
  OrderCount: number;
  PreparationRate: number;
  ProcessingRate: number;
  StandRate: number;
  WorkShopRate: number;
  brand: string;
  brandId: number;
  category: string;
  categoryId: number;
  conditionColor: string | null;
  conditionId: number | null;
  conditionTitle: string | null;
  contractor: string;
  creatorId: number | null;
  customerName: string;
  firstRegisteration: string;
  id: number;
  identificationNumber: string;
  inevtoryCost: number;
  isNew: number;
  jsn: string;
  model: string;
  modelId: number;
  preparationCost: number;
  processingCost: number;
  purchaseDate: string;
  purchasePrice: number;
  saleDate: string;
  salePrice: number;
  sparePartsTotalCost: number;
  standCosts: number;
  startDate: string;
  status: string;
  vId: number;
  vehicleNumber: string;
  workshopCost: number;
}

export interface IBEvalView {
  vehicleNumber: string;
  make: string;
  model: string;
  category: string;
  firstRegisteration: number;
  saleDate: number;
  purchaseDate: number;
  processingCosts: number;
  sparePartsCosts: number;
  workshopCosts: number;
  otherCosts: number;
  totalCosts: number;
  sellingPrice: number;
  profits: number;
  vId: number;
}

export const mapEvaluationDateForView = (
  data: IBEvaluation[],
  mapped: IBEvalView[]
) => {
  data.map((vehicle) => {
    let newDate;

    let saleDate = null;
    if (vehicle.saleDate) {
      newDate = vehicle.saleDate.split("/");
      saleDate = new Date(+newDate[2], +newDate[1] - 1, +newDate[0]).getTime();
    }

    newDate = vehicle.firstRegisteration.split("/");
    const frDate = new Date(+newDate[2], +newDate[1] - 1, +newDate[0]);
    newDate = vehicle.purchaseDate.split("/");
    const purDate = new Date(+newDate[2], +newDate[1] - 1, +newDate[0]);
    const otherCosts = vehicle.standCosts + vehicle.inevtoryCost;
    const totalCosts = +(
      vehicle.preparationCost +
      vehicle.standCosts +
      vehicle.inevtoryCost +
      vehicle.processingCost +
      vehicle.sparePartsTotalCost +
      vehicle.workshopCost
    ).toFixed(2);

    mapped.push({
      vehicleNumber: vehicle.vehicleNumber,
      make: vehicle.brand,
      model: vehicle.model,
      category: vehicle.category,
      firstRegisteration: frDate.getTime(),
      saleDate,
      purchaseDate: purDate.getTime(),
      processingCosts: vehicle.processingCost,
      sparePartsCosts: vehicle.sparePartsTotalCost,
      workshopCosts: vehicle.workshopCost,
      otherCosts,
      totalCosts,
      sellingPrice: vehicle.salePrice,
      profits: vehicle.salePrice - totalCosts,
      vId: vehicle.vId,
    });
  });

  return mapped;
};
