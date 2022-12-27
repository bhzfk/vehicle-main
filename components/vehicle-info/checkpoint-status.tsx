import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { checkpointStatus } from "services/checkpoints.service";
import {
  setVehicleCheckpoint,
  updateVehicleCheckpoint,
} from "services/vehicles.service";
import CheckpointStatusDropDown from "./checkpoint-status-dropdown";

const CheckpointStatus = ({
  checkpoint,
  status,
  vehicleId,
  token,
  refetchVehicleCheckpoints,
  getAreaData,
  showSparePartModal,
  showWorkLogModal,
  showRepairPendingModal,
  setCheckpointId,
}) => {
  const statusName =
    checkpointStatus.find((cks) => cks.value === status)?.message ||
    "Undefined";

  const handleSelect = async ({ key }) => {
    let resp;

    if (status === undefined) {
      resp = await setVehicleCheckpoint(vehicleId, checkpoint.id, key, token);
    } else {
      resp = await updateVehicleCheckpoint(
        vehicleId,
        checkpoint.id,
        key,
        token
      );
    }

    if (resp) {
      refetchVehicleCheckpoints();
      getAreaData();
    }
  };

  return (
    <div className="flex">
      <Dropdown
        // trigger={["click"]}
        overlay={() => (
          <CheckpointStatusDropDown
            filter={["external_ok", "internal_ok"]}
            status={status}
            handleSelect={handleSelect}
          />
        )}
      >
        <button
          className="flex items-center justify-center w-2/3 px-4 py-1 bg-gray-100 rounded-lg"
          onClick={(e) => e.preventDefault()}
        >
          {statusName} <DownOutlined className="ml-2" />
        </button>
      </Dropdown>
      {status === "no" && (
        <Button
          onClick={() => {
            setCheckpointId(checkpoint.id);
            showSparePartModal();
          }}
          className="ml-2"
        >
          Ersatzteile anfordern
        </Button>
      )}
      {status === "partOk" && (
        <Button
          onClick={() => {
            setCheckpointId(checkpoint.id);
            showWorkLogModal(status);
          }}
          className="ml-2"
        >
          Submit work log
        </Button>
      )}
      {status === "pending" && (
        <Button
          onClick={() => {
            setCheckpointId(checkpoint.id);
            showRepairPendingModal();
          }}
          className="ml-2"
        >
          Submit work log
        </Button>
      )}
      {status === "done" && (
        <Button
          onClick={() => {
            setCheckpointId(checkpoint.id);
            showWorkLogModal(status);
          }}
          className="ml-2"
        >
          Submit work log
        </Button>
      )}
    </div>
  );
};

export default CheckpointStatus;
