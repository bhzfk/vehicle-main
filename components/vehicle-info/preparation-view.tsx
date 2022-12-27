import { Button, Tabs } from "antd";
import { useCheckpoints } from "hooks/useCheckpoints";
import { useZones } from "hooks/useZones";
import { useMemo, useState } from "react";
import { solveCheckpointsByArea } from "services/checkpoints.service";
import { IZone } from "services/zone.service";
import TasksOverview from "./tasks-overview";
import { Collapse } from "antd";
import { useVehicleCheckpoints } from "hooks/useVehicles";
import { findCheckpointStatus } from "utils/helpers";
import CheckpointStatus from "./checkpoint-status";
import { useAuth } from "@reactivers/use-auth";
import { useSpareParts } from "hooks/useSpareParts";
import SubmitSparePartModal from "./submit-sparepart-modal";
import StatusIcon from "./status-icons";
import SubmitJobLogModal from "./submit-repair-done";
import SubmitRepairPendingModal from "./submit-repair-pending";

const { Panel } = Collapse;
const { TabPane } = Tabs;
const PreparationView = ({
  vehicleId,
  getAreaData,
  totalProgress,
  areas,
  filter,
}) => {
  const { token } = useAuth();

  const [showCheckpointForm, setShowCheckpointForm] = useState(false);
  const [selectedZones, setSelectedZones] = useState<IZone[]>();
  const [zonesCat, setZonesCat] = useState<IZone[]>([]);
  const [reqSpareModal, setReqSpareModel] = useState<boolean>(false);
  const [reqRepairPendingModal, setReqRepairPendingModal] =
    useState<boolean>(false);

  const [reqJobLogModal, setReqJobLogModal] = useState<boolean>(false);
  const [currentCheckpointId, setCurrentCheckpointId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>();

  enum TabNames {
    Overview = "1",
    Form = "2",
  }
  const [activeTab, setActiveTab] = useState<string>(TabNames.Overview);

  const { data: checkpointsQuery } = useCheckpoints();

  const {
    data: vehicleCheckpointsQuery,
    refetch: refetchVehicleCheckpoints,
    isLoading: checkpointsLoading,
  } = useVehicleCheckpoints(vehicleId);

  const { zonesQuery } = useZones();

  useMemo(() => {
    if (checkpointsQuery?.length && zonesQuery?.length) {
      let tempZones = [...zonesQuery];
      tempZones.map((tempZone) => {
        tempZone.checkpoints = [];
        checkpointsQuery.map((cp) => {
          if (cp.zoneId == tempZone.id) {
            tempZone.checkpoints.push(cp);
          }
        });
      });
      setZonesCat([...tempZones]);
    }
  }, [checkpointsQuery, zonesQuery]);

  const switchToForm = (areaId: number) => {
    const filteredZone = zonesCat.filter((zone) => zone.areaId === areaId);
    setSelectedZones([...filteredZone]);
    setShowCheckpointForm(true);
    switchTab(TabNames.Form);
  };

  function OnCheckpointsUpdate() {
    refetchVehicleCheckpoints();
  }

  function switchTab(key: string) {
    setActiveTab(key);
    if (key === TabNames.Overview) setShowCheckpointForm(false);
  }

  const { refetch: refetchSpareparts } = useSpareParts();

  const solveAllZone = async (zone) => {
    const resp = await solveCheckpointsByArea(zone.id, vehicleId);
    if (resp.changed === "yes") {
      refetchVehicleCheckpoints();
      getAreaData();
    }
  };

  return (
    <>
      <SubmitRepairPendingModal
        setReqModal={setReqRepairPendingModal}
        reqModal={reqRepairPendingModal}
        vehicleId={vehicleId}
        currentCheckpointId={currentCheckpointId}
        token={token}
        refetchSpareparts={refetchSpareparts}
      />
      <SubmitJobLogModal
        status={selectedStatus}
        setReqModal={setReqJobLogModal}
        reqModal={reqJobLogModal}
        vehicleId={vehicleId}
        currentCheckpointId={currentCheckpointId}
        token={token}
        refetchSpareparts={refetchSpareparts}
      />
      <SubmitSparePartModal
        setReqSpareModel={setReqSpareModel}
        vehicleId={vehicleId}
        currentCheckpointId={currentCheckpointId}
        token={token}
        refetchSpareparts={refetchSpareparts}
        reqSpareModal={reqSpareModal}
      />
      <div className="w-full ml-4">
        <Tabs
          activeKey={activeTab}
          defaultActiveKey={TabNames.Overview}
          onChange={switchTab}
          type="card"
          centered
        >
          <TabPane tab="Übersicht" key="1">
            <TasksOverview
              switchToForm={switchToForm}
              areas={areas}
              totalProgress={totalProgress}
              filter={filter}
              getAreaData={getAreaData}
              vehicleId={vehicleId}
              refetchCheckpoints={refetchVehicleCheckpoints}
            />
          </TabPane>
          {showCheckpointForm && (
            <TabPane tab="Form" key="2">
              <div className="grid gap-2">
                {selectedZones?.length &&
                  selectedZones.map((zone) =>
                    zone.checkpoints.length ? (
                      <div
                        className="p-2 mb-4 bg-gray-50 rounded-2xl"
                        key={zone.id}
                      >
                        <h3 className="w-64 py-2 pl-4 text-blue-400 rounded-xl">
                          {zone.title}
                        </h3>
                        <div>
                          <Collapse accordion>
                            {zone.checkpoints.map((checkpoint) => {
                              const status = findCheckpointStatus(
                                checkpoint.id,
                                vehicleCheckpointsQuery
                              );
                              return (
                                <Panel
                                  extra={<StatusIcon status={status} />}
                                  header={checkpoint.title}
                                  key={checkpoint.id}
                                >
                                  <CheckpointStatus
                                    setCheckpointId={setCurrentCheckpointId}
                                    showSparePartModal={() =>
                                      setReqSpareModel(true)
                                    }
                                    showRepairPendingModal={() =>
                                      setReqRepairPendingModal(true)
                                    }
                                    showWorkLogModal={
                                      (_status: string) => {
                                        setSelectedStatus(_status);
                                        setReqJobLogModal(true);
                                      }
                                      // setReqSpareModel(true)
                                    }
                                    token={token}
                                    vehicleId={vehicleId}
                                    status={status}
                                    checkpoint={checkpoint}
                                    refetchVehicleCheckpoints={
                                      OnCheckpointsUpdate
                                    }
                                    getAreaData={getAreaData}
                                  />
                                </Panel>
                              );
                            })}
                          </Collapse>
                        </div>

                        <div className="flex justify-center mt-2">
                          <Button
                            onClick={() => solveAllZone(zone)}
                            type="dashed"
                          >
                            Alles auf Grün setzen
                          </Button>
                        </div>
                      </div>
                    ) : null
                  )}
              </div>
            </TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default PreparationView;
