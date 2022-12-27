import { DownOutlined } from "@ant-design/icons";
import { Button, Collapse, Dropdown } from "antd";
import SpareWorkshopTable from "components/spare/spare-workshop";
import { useState } from "react";
import { findCheckpointTitleByCheckpointId } from "utils/helpers";
import CheckpointStatusDropDown from "./checkpoint-status-dropdown";
import StatusIcon from "./status-icons";
import VehicleInfoList from "./vehicle-infolist";

const { Panel } = Collapse;

const WorkshopView = ({
  vehicleInfo,
  isLoading,
  spareData,
  sparesLoading,
  refetchSpareData,
  checkpointsLoading,
  vCheckpointsLoading,
  vehicleCheckpointsQuery,
  checkpointsQuery,
}) => {
  const handleSelect = () => {};
  const [checkpointId, setCheckpointId] = useState();
  return (
    <div className="flex flex-col">
      <div className="flex px-8">
        <VehicleInfoList vehicleInfo={vehicleInfo} isLoading={isLoading} />
        <div className="flex flex-col mr-8">
          <SpareWorkshopTable
            dataSource={spareData}
            isLoading={sparesLoading}
            refetch={refetchSpareData}
            showRepairs={true}
          />
          <div className="flex flex-col px-4 py-4 mx-8 mt-4 bg-gray-100">
            <h2 className="text-lg">Notwendige Reparaturen</h2>
            <Collapse accordion>
              {!vCheckpointsLoading &&
                !checkpointsLoading &&
                vehicleCheckpointsQuery.map((cp) => {
                  return (
                    cp.status === "no" && (
                      <Panel
                        key={cp.id}
                        extra={<StatusIcon status={cp.status} />}
                        header={findCheckpointTitleByCheckpointId(
                          cp.checkpointId,
                          checkpointsQuery
                        )}
                      >
                        <div className="flex flex-col">
                          <Dropdown
                            // trigger={["click"]}
                            overlay={() => (
                              <CheckpointStatusDropDown
                                filter="done"
                                status={cp.status}
                                handleSelect={()=>{}}
                              />
                            )}
                          >
                            <button
                              className="flex items-center justify-center w-2/3 px-4 py-1 bg-gray-100 rounded-lg"
                              onClick={(e) => e.preventDefault()}
                            >
                              {cp.status} <DownOutlined className="ml-2" />
                            </button>
                          </Dropdown>
                          {cp.status === "no" && (
                            <Button
                              onClick={() => {
                                setCheckpointId(cp.id);
                                // modal();
                              }}
                              className="ml-2"
                            >
                              Ersatzteile anfordern
                            </Button>
                          )}
                        </div>
                      </Panel>
                    )
                  );
                })}
            </Collapse>
            <div>{}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopView;
