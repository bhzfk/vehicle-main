import {useAuth} from "@reactivers/use-auth";

import {useSparePartForVehicle} from "hooks/useSpareParts";
import {useVehicle, useVehicleCheckpoints} from "hooks/useVehicles";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Button, Collapse, Dropdown, Input, Space, Tabs, Upload} from "antd";
import VehicleInfoList from "components/vehicle-info/vehicle-infolist";
import getConditions, {ICondition} from "services/conditions.service";
import VehicleReception from "components/vehicle-info/vehicle-recording-form";
import VehicleInfoControl from "components/vehicle-info/vehicle-info-form";
import PreparationView from "components/vehicle-info/preparation-view";
import {fetchAreas, IArea} from "services/area.service";
import {
    fetchDonePoints,
    fetchTotalPoints,
} from "services/checkpoints.service";
import {useCheckpoints} from "hooks/useCheckpoints";
import SpareWorkshopTable from "components/spare/spare-workshop";
import StatusIcon from "components/vehicle-info/status-icons";
import {findCheckpointTitleByCheckpointId} from "utils/helpers";
import CheckpointStatusDropDown from "components/vehicle-info/checkpoint-status-dropdown";
import {DownOutlined, UploadOutlined} from "@ant-design/icons";
import {updateVehicleCheckpoint} from "services/vehicles.service";
import SubmitSparePartModal from "components/vehicle-info/submit-sparepart-modal";
import SubmitJobLogModalWorkshop from "components/vehicle-info/submit-repair-done-workshop";
import Modal from "antd/lib/modal/Modal";
import {Form} from "antd";
import {submitSparePart} from "services/spares.service";
import TextArea from "antd/lib/input/TextArea";
import WorkShopSubmitLog from "components/vehicle-info/workshop-submit-log";

const {TabPane} = Tabs;

const VehicleInfo = () => {
    const {token, user} = useAuth();

    enum TabNames {
        Info = "1",
        Reception = "2",
        Preparation = "3",
        Max = "3_1",
        Casual = "4",
        Workshop = "5",
        Sales = "6",
    }

    const router = useRouter();
    const {id} = router.query;
    const [vehicleId, setVehicleId] = useState(id as string);
    const {vehicleInfo, isLoading, refetch} = useVehicle(token, +vehicleId);
    const {
        spareData,
        sparesLoading,
        refetch: refetchSpareData,
    } = useSparePartForVehicle(+vehicleId);
    const [preparationTab, setPreparationTab] = useState(false);
    const [casualTab, setCasualTab] = useState(false);
    const [workshopTab, setWorkshopTab] = useState(false);
    const [conditions, setConditions] = useState<ICondition[]>([]);
    const [activeTab, setActiveTab] = useState<string>(TabNames.Reception);
    const [salesTab, setSalesTab] = useState<boolean>(false);

    const [refresh, setRefresh] = useState(0);

    const [checkpointId, setCheckpointId] = useState<number>();
    const [selectedStatus, setSelectedStatus] = useState<string>("no");

    const [areas, setAreas] = useState<IArea[]>([]);
    const [salingAreas, setSalingAreas] = useState<IArea[]>([]);
    const [totalProgress, setTotalProgress] = useState({solved: 0, total: 0});
    const [totalProgressCasual, setTotalProgressCasual] = useState({
        solved: 0,
        total: 0,
    });

    const [totalSalingProcess, setTotalSalingProcess] = useState({
        solved: 0,
        total: 0,
    });

    const [reqSpareModal, setReqSpareModel] = useState<boolean>(false);
    const [reqJobLogModal, setReqJobLogModal] = useState<boolean>(false);
    const [changeStatusInModal, setChangeStatusInModal] =
        useState<boolean>(false);

    const requestConditions = async () => {
        const data: ICondition[] = await getConditions();
        setConditions([...data]);
    };

    const {
        data: vehicleCheckpointsQuery,
        refetch: refetchVehicleCheckpoints,
        isLoading: vCheckpointsLoading,
    } = useVehicleCheckpoints(router.query.id as string);

    const {data: checkpointsQuery, isLoading: checkpointsLoading} =
        useCheckpoints();

    function onVehicleInfoUpdate() {
        refetch().then((response) => {
            setPreparationTab(true);
            if (response.data[0].conditionTitle.startsWith("Max -")) {
                setActiveTab(TabNames.Max);
            } else {
                setActiveTab(TabNames.Preparation);
            }
        });
    }

    useEffect(() => {
        getAreaData();
        getSalingAreaData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getAreaData() {
        const areasData: IArea[] = await fetchAreas();
        if (areasData && areasData.length) {
            let newArea = [...areasData];
            let totalProgressSolved = 0;
            let totalProgressPoints = 0;

            let totalProgressSolved0 = 0;
            let totalProgressPoints0 = 0;
            areasData.forEach(async (areaData, index) => {
                const totalPoints = await fetchTotalPoints(
                    id as string,
                    areaData.id,
                    areaData.type
                );

                if (areaData.type === 1) totalProgressPoints += totalPoints;
                if (areaData.type === 0) totalProgressPoints0 += totalPoints;

                newArea[index].totalPoints = totalPoints;

                const solvedPoints = await fetchDonePoints(
                    +id,
                    areaData.id,
                    areaData.type
                );

                if (areaData.type === 1) totalProgressSolved += solvedPoints;
                if (areaData.type === 0) totalProgressSolved0 += solvedPoints;
                newArea[index].solvedPoints = solvedPoints;

                setAreas([...newArea]);

                setTotalProgress({
                    solved: totalProgressSolved,
                    total: totalProgressPoints,
                });

                setTotalProgressCasual({
                    solved: totalProgressSolved0,
                    total: totalProgressPoints0
                })

                CheckAllTabs();
            });
        }
    }

    async function getSalingAreaData() {
        const areasData: IArea[] = await fetchAreas();
        if (areasData && areasData.length) {
            let newArea = [...areasData];
            let totalProgressSolved = 0;
            let totalProgressPoints = 0;
            areasData.forEach(async (areaData, index) => {
                const totalPoints = await fetchTotalPoints(
                    id as string,
                    areaData.id,
                    areaData.type
                );

                if (areaData.type === 2) totalProgressPoints += totalPoints;

                newArea[index].totalPoints = totalPoints;

                const solvedPoints = await fetchDonePoints(
                    +id,
                    areaData.id,
                    areaData.type
                );

                console.log(solvedPoints);
                if (areaData.type === 2) totalProgressSolved += solvedPoints;
                newArea[index].solvedPoints = solvedPoints;

                console.log(totalProgressSolved, totalProgressPoints);

                setSalingAreas([...newArea]);
                setTotalSalingProcess({
                    solved: totalProgressSolved,
                    total: totalProgressPoints,
                });
                if (
                    casualTab &&
                    totalProgressPoints > 0 &&
                    totalProgressPoints === totalProgressSolved
                ) {
                    CheckAllTabs();
                }
            });
        }
    }

    function checkPreparationTab() {
        setPreparationTab(true);
        return true;

        if (vehicleInfo && vehicleInfo[0].status !== "INCOMING") {
            setPreparationTab(true);
            return true;
        }
        return false;
    }

    function checkCasualTab() {
        setCasualTab(true);
        return true;

        if (vehicleInfo && vehicleInfo[0].isNew == 1) {
            setCasualTab(true);
            return true;
        }
        return false;
    }

    function checkWorkshopTab() {
        setWorkshopTab(true);
        return true;

        if (
            vehicleInfo &&
            ["SALE", "SOLD", "WORKSHOP", "FINALPREPARATION"].includes(
                vehicleInfo[0].status
            )
        ) {
            setWorkshopTab(true);
            return true;
        }
        return false;
    }

    function checkSalesTab() {
        setSalesTab(true);
        return true;
        if (
            vehicleInfo &&
            vehicleInfo[0].status !== "ARRIVED" &&
            vehicleInfo[0].status !== "INCOMING" &&
            vehicleInfo[0].status !== "WORKSHOP"
        ) {
            setSalesTab(true);
            return true;
        }
        return false;
    }

    function CheckAllTabs() {
        checkPreparationTab();
        checkCasualTab();
        checkWorkshopTab();
        checkSalesTab();
    }

    useEffect(() => {
        setVehicleId(router.query.id as string);
        requestConditions();
    }, [router.query.id]);

    useEffect(() => {
        CheckAllTabs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleInfo, router.query]);

    function switchTab(key) {
        CheckAllTabs();
        setActiveTab(key);
    }

    function gotoPreparation() {
        switchTab(TabNames.Preparation);
    }

    const {Panel} = Collapse;

    const onSelectCheckpointStatusDDItem = async (key, checkpointId) => {
        const resp = await updateVehicleCheckpoint(
            +vehicleId,
            checkpointId,
            key,
            token
        );
        if (resp) {
            refetchVehicleCheckpoints();
            getAreaData();
        }
    };

    const [requestSparePartModalVisiblity, setRequestSparePartModalVisiblity] =
        useState(false);

    return (
        <>
            <SubmitJobLogModalWorkshop
                status={selectedStatus}
                setReqModal={setReqJobLogModal}
                reqModal={reqJobLogModal}
                vehicleId={vehicleId}
                currentCheckpointId={checkpointId}
                token={token}
                refetchSpareparts={refetchSpareData}
                changeStatusFN={onSelectCheckpointStatusDDItem}
            />
            <SubmitSparePartModal
                setReqSpareModel={setReqSpareModel}
                vehicleId={vehicleId}
                currentCheckpointId={checkpointId}
                token={token}
                refetchSpareparts={() => {
                    setRefresh(refresh + 1), refetchSpareData();
                }}
                reqSpareModal={reqSpareModal}
            />
            <Tabs
                centered
                activeKey={activeTab}
                defaultActiveKey={
                    preparationTab ? TabNames.Preparation : TabNames.Reception
                }
                onChange={switchTab}
            >
                {["owner", "sale"].includes(user.userInfo.role) && (
                    <TabPane tab="Info" key="1">
                        <div className="flex flex-col">
                            <SpareWorkshopTable
                                dataSource={spareData}
                                isLoading={sparesLoading}
                                refetch={refetchSpareData}
                            />
                            <VehicleInfoControl
                                refetchVehicles={refetch}
                                gotoPreparation={gotoPreparation}
                                isLoading={isLoading}
                                id={id}
                                vehicleInfo={vehicleInfo}
                                token={token}
                            />
                        </div>
                    </TabPane>
                )}
                {["owner", "sale", "workshop", "spare"].includes(user.userInfo.role) && (
                    <TabPane tab="Rezeption" key="2">
                        <div className="flex flex-col">
                            <div className="flex px-8">
                                <div className="flex flex-col mr-8">
                                    <VehicleInfoList
                                        vehicleInfo={vehicleInfo}
                                        isLoading={isLoading}
                                    />
                                </div>
                                <VehicleReception
                                    onVehicleInfoUpdate={onVehicleInfoUpdate}
                                    conditions={conditions}
                                    vehicleId={vehicleId}
                                    vehicleInfo={vehicleInfo}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    </TabPane>
                )}
                {["owner", "max", "workshop", "spare"].includes(user.userInfo.role) &&
                    vehicleInfo &&
                    vehicleInfo[0].conditionTitle &&
                    vehicleInfo[0].conditionTitle.startsWith("Max -") && (
                        <TabPane tab="Max" key="3_1">
                            <div className="flex flex-col">
                                <div className="flex px-8 mr-8">
                                    <VehicleInfoList
                                        vehicleInfo={vehicleInfo}
                                        isLoading={isLoading}
                                    />
                                    <PreparationView
                                        totalProgress={totalProgressCasual}
                                        getAreaData={getAreaData}
                                        areas={areas}
                                        vehicleId={vehicleId}
                                        filter={0}
                                    />
                                </div>
                            </div>
                        </TabPane>
                    )}
                {["owner", "sale", "workshop", "preparation", "workshop_user", "spare"].includes(user.userInfo.role) && preparationTab && (
                    <TabPane tab="Vorbereitung" key="3">
                        <div className="flex flex-col">
                            <div className="flex px-8 mr-8">
                                <VehicleInfoList
                                    vehicleInfo={vehicleInfo}
                                    isLoading={isLoading}
                                />
                                <PreparationView
                                    totalProgress={totalProgress}
                                    getAreaData={getAreaData}
                                    areas={areas}
                                    vehicleId={vehicleId}
                                    filter={1}
                                />
                                {/* <Preparation vehicleId={vehicleId} /> */}
                            </div>
                        </div>
                    </TabPane>
                )}

                {["owner", "sale", "workshop", "spare"].includes(user.userInfo.role) && casualTab && (
                    <TabPane tab="Verkaufsprozess" key="4">
                        <div className="flex flex-col">
                            <div className="flex px-8 mr-8">
                                <VehicleInfoList
                                    vehicleInfo={vehicleInfo}
                                    isLoading={isLoading}
                                />
                                <PreparationView
                                    vehicleId={vehicleId}
                                    totalProgress={totalSalingProcess}
                                    getAreaData={getSalingAreaData}
                                    areas={salingAreas}
                                    filter={2}
                                />
                            </div>
                        </div>
                    </TabPane>
                )}
                {["owner", "sale", "workshop", "workshop_user", "spare"].includes(user.userInfo.role) && (
                    <TabPane tab="Ersatzteil" key="spare_parts">
                        <div className="flex flex-col">
                            <div className="flex px-8 mr-8">
                                <VehicleInfoList
                                    vehicleInfo={vehicleInfo}
                                    isLoading={isLoading}
                                />
                                <div className="mx-4">
                                    <Button
                                        className="mb-2"
                                        onClick={() => setRequestSparePartModalVisiblity(true)}
                                    >
                                        Ersatzteile anfordern
                                    </Button>
                                    <SpareWorkshopTable
                                        dataSource={spareData}
                                        isLoading={sparesLoading}
                                        refetch={() => {
                                            setRefresh(refresh + 1), refetchSpareData();
                                        }}
                                        showRepairs={true}
                                    />
                                </div>

                                <SubmitSparePartModal
                                    setReqSpareModel={setRequestSparePartModalVisiblity}
                                    vehicleId={vehicleInfo && vehicleInfo[0].id}
                                    currentCheckpointId={0}
                                    token={token}
                                    refetchSpareparts={refetchSpareData}
                                    reqSpareModal={requestSparePartModalVisiblity}
                                />
                            </div>
                        </div>
                    </TabPane>
                )}
                {["owner", "sale", "workshop", "workshop_user", "spare"].includes(user.userInfo.role) && (
                    <TabPane tab="Interne Werkstatt" key="internal_workshop">
                        <div className="flex flex-col">
                            <div className="flex px-8 mr-8">
                                <VehicleInfoList
                                    vehicleInfo={vehicleInfo}
                                    isLoading={isLoading}
                                />
                                <div className="flex flex-col mr-8 flex-1">
                                    <div className="flex flex-col px-4 py-4 mx-8 mt-4 bg-gray-100">
                                        <h2 className="text-lg">Notwendige Reparaturen</h2>
                                        <Collapse accordion>
                                            {!vCheckpointsLoading &&
                                                !checkpointsLoading &&
                                                vehicleCheckpointsQuery.map((cp, index) => {
                                                    if (
                                                        ["internal_workshop", "internal_ok"].includes(
                                                            cp.status
                                                        )
                                                    )
                                                        return (
                                                            <Panel
                                                                header={findCheckpointTitleByCheckpointId(
                                                                    cp.checkpointId,
                                                                    checkpointsQuery
                                                                )}
                                                                key={index}
                                                                className={
                                                                    cp.status === "internal_ok"
                                                                        ? "workshop-ok-panel-header"
                                                                        : ""
                                                                }
                                                            >
                                                                <WorkShopSubmitLog
                                                                    vehicleId={vehicleId}
                                                                    checkPointId={cp.checkpointId}
                                                                    status={cp.status}
                                                                    statuses={["internal_workshop", "internal_ok"]}
                                                                    token={token}
                                                                    checkpoint={cp}
                                                                />
                                                            </Panel>
                                                        );
                                                })}
                                        </Collapse>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                )}

                {["owner", "sale", "workshop", "spare"].includes(user.userInfo.role) && (
                    <TabPane tab="Externe Werkstatt" key="external_workshop">
                        <div className="flex flex-col">
                            <div className="flex px-8 mr-8">
                                <VehicleInfoList
                                    vehicleInfo={vehicleInfo}
                                    isLoading={isLoading}
                                />
                                <div className="flex flex-col mr-8 flex-1">
                                    <div className="flex flex-col px-4 py-4 mx-8 mt-4 bg-gray-100">
                                        <h2 className="text-lg">Notwendige Reparaturen</h2>
                                        <Collapse accordion>
                                            {!vCheckpointsLoading &&
                                                !checkpointsLoading &&
                                                vehicleCheckpointsQuery.map((cp, index) => {
                                                    if (
                                                        ["external_workshop", "external_ok"].includes(
                                                            cp.status
                                                        )
                                                    )
                                                        return (
                                                            <Panel
                                                                header={findCheckpointTitleByCheckpointId(
                                                                    cp.checkpointId,
                                                                    checkpointsQuery
                                                                )}
                                                                key={index}
                                                                className={
                                                                    cp.status === "external_ok"
                                                                        ? "workshop-ok-panel-header"
                                                                        : ""
                                                                }
                                                            >
                                                                <WorkShopSubmitLog
                                                                    vehicleId={vehicleId}
                                                                    checkPointId={cp.checkpointId}
                                                                    status={cp.status}
                                                                    statuses={["external_workshop", "external_ok"]}
                                                                    token={token}
                                                                    checkpoint={cp}
                                                                />
                                                            </Panel>
                                                        );
                                                })}
                                        </Collapse>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                )}
                {/* {workshopTab && (
          <TabPane tab="Workshop" key="5">
            <div className="flex flex-col">
              <div className="flex px-8">
                <VehicleInfoList
                  vehicleInfo={vehicleInfo}
                  isLoading={isLoading}
                />
                <div className="flex flex-col mr-8">
                  <SpareWorkshopTable
                    dataSource={spareData}
                    isLoading={sparesLoading}
                    refetch={() => {
                      setRefresh(refresh + 1), refetchSpareData();
                    }}
                    showRepairs={true}
                  />
                  <div className="flex flex-col px-4 py-4 mx-8 mt-4 bg-gray-100">
                    <h2 className="text-lg">Necessary repairs</h2>
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
                                <div className="flex">
                                  <Dropdown
                                    // trigger={["click"]}
                                    overlay={() => (
                                      <CheckpointStatusDropDown
                                        status={cp.status}
                                        filter="done"
                                        handleSelect={({ key }) => {
                                          setSelectedStatus(key);
                                          key === "ok" &&
                                            onSelectCheckpointStatusDDItem(
                                              key,
                                              cp.checkpointId
                                            );
                                        }}
                                      />
                                    )}
                                  >
                                    <a className="flex items-center justify-center w-2/3 px-4 py-1 bg-gray-100 rounded-lg">
                                      {cp.status}{" "}
                                      <DownOutlined className="ml-2" />
                                    </a>
                                  </Dropdown>

                                  {selectedStatus === "no" && (
                                    <Button
                                      onClick={() => {
                                        setCheckpointId(cp.checkpointId);
                                        setReqSpareModel(true);
                                      }}
                                      className="ml-2"
                                    >
                                      Request spare part
                                    </Button>
                                  )}
                                  {selectedStatus === "partOk" && (
                                    <Button
                                      onClick={() => {
                                        setCheckpointId(cp.checkpointId);
                                        setChangeStatusInModal(true);
                                        setReqJobLogModal(true);
                                      }}
                                      className="ml-2"
                                    >
                                      Submit work log
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
          </TabPane>
        )} */}

                {["owner", "sale"].includes(user.userInfo.role) && salesTab && (
                    <TabPane tab="BWA" key="6">
                        <div>
                            <div className="flex flex-col">
                                <div className="flex px-8">
                                    <VehicleInfoControl
                                        refetchVehicles={refetch}
                                        gotoPreparation={gotoPreparation}
                                        isLoading={isLoading}
                                        id={id}
                                        vehicleInfo={vehicleInfo}
                                        token={token}
                                        showUpdatePrice={true}
                                        refresh={refresh}
                                    />
                                </div>
                            </div>
                        </div>
                    </TabPane>
                )}
            </Tabs>
        </>
    );
};

export default VehicleInfo;
