import { ICheckpoint } from "services/checkpoints.service";
import { IVehicleCheckpoint } from "./../services/vehicles.service";

export const findCheckpointStatus = (
  checkpointId: number,
  vehicleCheckpoints: IVehicleCheckpoint[]
): string | undefined => {
  const cp = vehicleCheckpoints.find(
    (vcp) => vcp.checkpointId === checkpointId
  );
  return cp?.status || undefined;
};

export const getSingleFile = (e: any) => {
  if (Array.isArray(e)) {
    return null;
  } else {
    if (e.fileList && e.fileList.length) {
      return e.fileList[0].originFileObj;
    } else return null;
  }
};

export const findZoneTitleByCheckpointId = (
  checkpointId: number,
  cpArray: ICheckpoint[]
) => {
  const checkpoint = cpArray.find((cp) => cp.id === checkpointId);
  return checkpoint.zoneTitle;
};

export const findCheckpointTitleByCheckpointId = (
  checkpointId: number,
  cpArray: ICheckpoint[]
) => {
  const checkpoint = cpArray.find((cp) => cp.id === checkpointId);
  return checkpoint.title;
};
