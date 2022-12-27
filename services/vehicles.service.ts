import axios from "axios";
import {Option} from "antd/lib/mentions";

export interface IVehicle {
    id: number;
    ArriveCount: number;
    InstalledCount: number;
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
    conditionColor: string;
    conditionId: number;
    conditionTitle: string;
    contractor: string;
    creatorId: string | null;
    customerName: string;
    firstRegisteration: string;
    identificationNumber: string;
    inevtoryCost: number;
    isNew: number;
    jsn: string;
    model: string;
    modelId: number;
    preparationCost: number;
    processingCost: number;
    purchaseDate: string;
    purchasePrice: string;
    saleDate: null | string;
    salePrice: null | number;
    sparePartsTotalCost: number;
    standCosts: number;
    startDate: string;
    status: string;
    statusName: string;
    vId: number;
    vehicleNumber: string;
    workshop_i_cost: number;
    workshop_e_cost: number;
    financed: number;
}

export const statusColors = {
    INCOMING: {color: "purple"},
    ARRIVED: {color: "yellow"},
    PROCESSING: {color: "gold"},
    WORKSHOP: {color: "cyan"},
    SALE: {color: "orange"},
    FINALPREPARATIONSSALE: {color: "blue"},
    SOLD: {color: "green"},
    OPEN: {color: "blue"},
    ORDERED: {color: "green"},
    CHECKED: {color: "yellow"},
    INSTALLED: {color: "pink"},
    MAX: {color: "blue"},
    MAX_FINISHED: {color: "green"},
    DELIVERED: {color: "green"},
};

interface IVehicleCondition {
    id: number;
    title: string;
    color: string;
}

export interface IImage {
    id: number;
    fileName: string;
}

export interface IVehicleOverview {
    id: number;
    vehicleNo: string;
    idNumber: string;
    make: string;
    model: string;
    category: string;
    purchaseDate: number;
    firstRegistration: number;
    customer: string;
    images: IImage[];
    condition: IVehicleCondition;
    status: string;
    statusName: string;
    openOrderArrive: string;
}

export interface IVehicleCheckpoint {
    checkpointId: number;
    description: string;
    firstModireId: number;
    hour: string;
    id: number;
    min: string;
    modifireId: number;
    status: string;
    tiresAge: string;
    tiresSize: string;
    vehicleId: number;
}

export const mapVehiclesDataForOverview = (
    data: IVehicle[],
    mapped: IVehicleOverview[],
    userRole: String = 'owner'
) => {
    data.map((vehicle) => {
        let newDate = vehicle.purchaseDate.split("/");
        const purchaseDate = new Date(+newDate[2], +newDate[1] - 1, +newDate[0]);

        newDate = vehicle.firstRegisteration.split("/");
        const frDate = new Date(+newDate[2], +newDate[1] - 1, +newDate[0]);

        mapped.push({
            id: vehicle.id,
            vehicleNo: vehicle.vehicleNumber,
            idNumber: vehicle.identificationNumber,
            make: vehicle.brand,
            model: vehicle.model,
            category: vehicle.category,
            purchaseDate: purchaseDate.getTime(),
            firstRegistration: frDate.getTime(),
            customer: vehicle.customerName,
            images: vehicle.jsn ? JSON.parse(vehicle.jsn) : null,
            condition: {
                id: vehicle.conditionId,
                title: vehicle.conditionTitle,
                color: vehicle.conditionColor,
            },
            status: (vehicle.status),
            statusName: getStatusName(vehicle.status),
            openOrderArrive: `${vehicle.OpenCount} / ${vehicle.OrderCount} / ${vehicle.ArriveCount} / ${vehicle.InstalledCount}`,
        });
    });

    if (userRole == 'max') {
        mapped = mapped.filter(i => i.status == 'MAX' || i.status == 'MAX_FINISHED')
    }


    return mapped;
};

const getStatusName = status => {
    const _status = {
        "INCOMING": "Auf dem Weg",
        "ARRIVED": "Angekommen",
        "PROCESSING": "In Bearbeitung",
        "WORKSHOP": "Werkstatt",
        "SALE": "Verkauf",
        "FINALPREPARATIONSSALE": "FINALPREPARATIONSSALE",
        "SOLD": "Verkauft",
        "OPEN": "Öffen",
        "ORDERED": "Bestellt",
        "CHECKED": "Kontrolliert",
        "INSTALLED": "Verbaut",
        "MAX": "MAX",
        "MAX_FINISHED": "MAX FINISHED",
        "DELIVERED": "Geliefert",
    };

    return _status[status]
}


export const fetchVehicles = async (token: string): Promise<IVehicle[]> => {
    const response = await axios.post(`${process.env.API_URL}/api/vehicleList/`, {
        token,
    });
    return response.data.data;
};

export async function getVehicle(id, token) {
    return axios
        .post(`${process.env.API_URL}/api/vehicleList/?id=${id}`, {
            token,
        })
        .then((res) => res.data.data)
        .catch((err) => console.log(err));
}

export const fetchVehicleCheckpoints = async (
    vehicleId: string
): Promise<IVehicleCheckpoint[]> => {
    const response = await axios.get(
        `${process.env.API_URL}/api/checkState/${vehicleId}`
    );

    return response.data.data;
};

export const setVehicleCheckpoint = async (
    vehicleId: number,
    checkpointId: number,
    status: string,
    token: string
): Promise<boolean> => {
    const response = await axios.post(`${process.env.API_URL}/api/checkState`, {
        vehicleId,
        checkpointId,
        status,
        token,
    });
    return response.data.state;
};

export const submitWorkLog = async (
    checkpointId: string,
    description: string,
    hour: number,
    min: number,
    status: string,
    tiresAge: string,
    tiresSize: string,
    token: string,
    vehicleId: string
): Promise<boolean> => {
    const response = await axios.put(`${process.env.API_URL}/api/checkState`, {
        vehicleId,
        checkpointId,
        status,
        token,
        description,
        hour,
        min,
        tiresAge,
        tiresSize,
    });

    return response.data;
};

export const calculateInteralWorkShopCost = async (
    vehicleId: String
): Promise<Boolean> => {
    const response = await axios.get(
        `${process.env.API_URL}/api/calculate_internal_workshop_cost/${vehicleId}`
    );
    return response.data;
};

export const detectPreparationCost = async (
    vehicleId: string
): Promise<boolean> => {
    const response = await axios.get(
        `${process.env.API_URL}/api/detectPreparationCost/${vehicleId}`,
        {
            params: {
                id: 1,
            },
        }
    );
    return response.data;
};

export const updateVehicleCheckpoint = async (
    vehicleId: number,
    checkpointId: number,
    status: string,
    token: string
): Promise<boolean> => {
    const response = await axios.put(`${process.env.API_URL}/api/checkState`, {
        vehicleId,
        checkpointId,
        status,
        token,
    });
    return response.data;
};

export const updateVehicleStatus = async (
    vehicle_id: number,
    new_status: string
): Promise<{
    status: boolean;
    vehicle_id: number;
    new_status: string;
}> => {
    const response = await axios.post(
        `${process.env.API_URL}/api/vehicle_update_status`,
        {
            vehicle_id,
            new_status,
        }
    );
    return response.data;
};


export const deleteVehicle = async (
    vehicle_id: number,
): Promise<{
    status: boolean;
    vehicle_id: number;
    new_status: string;
}> => {
    const response = await axios.post(
        `${process.env.API_URL}/api/delete_vehicle`,
        {
            vehicle_id,
        }
    );
    return response.data;
};
