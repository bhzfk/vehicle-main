import axios from "axios";
import {IImage} from "./vehicles.service";

export interface ISparePart {
    vehicleId: number;
    chk: number;
    spid: number;
    id: number;
    brandId: number;
    modelId: number;
    categoryId: number;
    isNew: number;
    purchaseDate: string;
    firstRegisteration: string;
    startDate: string;
    customerName: string;
    contractor: string;
    status: string;
    purchasePrice: string;
    identificationNumber: string;
    vehicleNumber: string;
    conditionId: number;
    salePrice: string;
    saleDate: string;
    inevtoryCost: number;
    processingCost: number;
    sparePartsTotalCost: number;
    workshopCost: number;
    standCosts: number;
    preparationCost: number;
    creatorId: number;
    InventoryRate: number;
    ProcessingRate: number;
    PreparationRate: number;
    StandRate: number;
    WorkShopRate: number;
    checkpointId: number;
    title: string;
    description: string;
    price: string;
    createDate: string;
    RequestDate: string | null;
    OrderDate: string | null;
    ArriveDate: string;
    InstalledDate: string | null;
    brandTitle: string;
    modelTitle: string;
    categoryTitle: string;
    jsn: string;
}

export interface ISparePartTable {
    vehicleId: number;
    id: number;
    brand: string;
    vehicleNumber: string;
    category: string;
    firstRegisteration: number;
    createDate: string;
    RequestDate: string;
    OrderDate: string;
    ArriveDate: string;
    InstalledDate: string;
    sparePart: string;
    description: string;
    images: IImage[];
    status: string;
    statusName: string;
    purchasePrice: string;
    price: string;
}

export const fetchSpareParts = async (): Promise<ISparePart[]> => {
    const response = await axios.get(`${process.env.API_URL}/api/spareparts/`);
    return response.data;
};

interface IEditSparePartData {
    id: number;
    price: string;
    status: string;
    token: string;
    vehicleId: string;
}

export const updateSpareParts = async ({
                                           id,
                                           price,
                                           status,
                                           token,
                                           vehicleId,
                                       }: IEditSparePartData): Promise<{ result: boolean }> => {
    const response = await axios.put(`${process.env.API_URL}/api/spareparts/`, {
        id,
        price,
        status,
        token,
        vehicleId,
    });
    return response.data;
};

export const mapSparePartDataToTable = (
    data: ISparePart[],
    mapped: ISparePartTable[]
) => {
    data.map((sparePart) => {
        let newDate = sparePart.firstRegisteration.split("/");
        const frDate = new Date(+newDate[2], +newDate[1] - 1, +newDate[0]);

        mapped.push({
            vehicleId: sparePart.vehicleId,
            id: sparePart.id,
            brand: sparePart.brandTitle,
            vehicleNumber: sparePart.vehicleNumber,
            category: sparePart.categoryTitle,
            firstRegisteration: frDate.getTime(),
            createDate: sparePart.createDate,
            RequestDate: sparePart.RequestDate,
            OrderDate: sparePart.OrderDate,
            ArriveDate: sparePart.ArriveDate,
            InstalledDate: sparePart.InstalledDate,
            sparePart: sparePart.title,
            description: sparePart.description,
            images: JSON.parse(sparePart.jsn),
            status: sparePart.status,
            statusName: getSpareStatusName(sparePart.status),
            purchasePrice: sparePart.purchasePrice,
            price: sparePart.price
        });
    });

    return mapped;
};

export const getSpareStatusName = status => {
    let _status = {
        'OPEN': 'Öffen',
        'ARRIVED': 'Angekommen',
        'ORDERED': 'Bestellt',
        'INSTALLED': 'Verbaut',
    }

    return _status[status]
}


export interface ISparePartSubmit {
    file: any;
    vehicleId: string;
    checkpointId: string;
    title: string;
    description: string;
    suppliers: string;
    token: string;
}

export const submitSparePart = async (
    data: ISparePartSubmit
): Promise<boolean> => {
    const formData = new FormData();

    formData.append("file", data.file);
    formData.append("vehicleId", data.vehicleId);
    formData.append("checkpointId", data.checkpointId);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("suppliers", data.suppliers);
    formData.append("token", data.token);

    const response = await axios.post(
        `${process.env.API_URL}/api/spareparts/`,
        formData
    );
    return response.data.state;
};

export const deleteSparePart = async (spareId): Promise<any> => {
    const resp = await axios.delete(
        `${process.env.API_URL}/api/deleteSparePart?id=${spareId}`
    );
    return resp.data;
};
