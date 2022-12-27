import { Collapse } from "antd";
import SpareViewTable from "components/spare/SpareViewTable";
import { useVehicleCheckpoints } from "hooks/useVehicles";
import { useState } from "react";
import { findCheckpointStatus } from "utils/helpers";
import CheckpointStatus from "./checkpoint-status";
import StatusIcon from "./status-icons";
import VehicleInfoList from "./vehicle-infolist";

const { Panel } = Collapse;
const WorkshopView = ({
  vehicleInfo,
  isLoading,
  spareData,
  sparesLoading,
  vehicleId,
}) => {
  const {
    data: vehicleCheckpointsQuery,
    refetch: refetchVehicleCheckpoints,
    isLoading: checkpointsLoading,
  } = useVehicleCheckpoints(vehicleId);

  const [currentCheckpointId, setCurrentCheckpointId] = useState();

  return (
    <div className="flex flex-col ">
      <div className="flex">
        {/* <VehicleInfoList vehicleInfo={vehicleInfo} isLoading={isLoading} /> */}
        <SpareViewTable
          showCount={false}
          dataSource={spareData}
          isLoading={sparesLoading}
        />
      </div>
      <div className="flex items-center justify-center w-1/2 mx-8 bg-red-100">
        <Collapse accordion>
          {vehicleCheckpointsQuery.map((checkpoint) => {
            return (
              checkpoint.status === "no" && (
                <Panel
                  // extra={
                  //   <StatusIcon
                  //     status="no"
                  //     checkpointStatus={checkpoint.status}
                  //   />
                  // }
                  header={checkpoint.status}
                  key={checkpoint.id}
                >
                  {/* <CheckpointStatus
                  setCheckpointId={setCurrentCheckpointId}
                  showModal={() => setReqSpareModel(true)}
                  token={token}
                  vehicleId={vehicleId}
                  status={status}
                  checkpoint={checkpoint}
                  refetchVehicleCheckpoints={OnCheckpointsUpdate}
                  getAreaData={getAreaData}
                /> */}
                </Panel>
              )
            );
          })}
        </Collapse>
      </div>
    </div>
  );
};

export default WorkshopView;
