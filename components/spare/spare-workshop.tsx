import {DeleteOutlined, DownloadOutlined} from "@ant-design/icons";
import {Tag, Table, Button, Modal, Image} from "antd";
import moment from "moment";
import {useEffect, useState} from "react";
import {deleteSparePart, ISparePartTable, getSpareStatusName} from "services/spares.service";
import {v4 as uuidv4} from "uuid";

import "moment/locale/de";
import {statusColors} from "services/vehicles.service";
import SubmitSparePartModal from "components/vehicle-info/submit-sparepart-modal";
import {useRouter} from "next/router";
import SpareStatusModal from "components/vehicle-info/spare-status-modal";
import axios from "axios";
import {useVehicle} from "hooks/useVehicles";
import {useAuth} from "@reactivers/use-auth";

moment.locale("de");

const SpareWorkshopTable = ({
                                dataSource,
                                isLoading,
                                showRepairs = true,
                                refetch,
                            }: {
    dataSource: ISparePartTable[];
    isLoading: boolean;
    refetch: () => void;
    showRepairs?: boolean;
}) => {
    const router = useRouter();
    const [sparePartList, setSparePartList] = useState<ISparePartTable[]>([]);
    const [selectedPart, setSelectedPart] = useState<ISparePartTable>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [reqSpareStatusModal, setReqSpareStatusModal] = useState(false);
    const {token} = useAuth();
    const vehicle2 = useVehicle(token, 271);

    const siteURL = process.env.SITE_URL;

    const removeSparePart = async (vehicle, id) => {
        const resp = await deleteSparePart(id);
        if (resp.backStatus === "1") {
            axios.get(
                `${process.env.API_URL}/api/detectSparePartsCost/${vehicle.vehicleId}`
            );
            refetch();
        }
    };

    useEffect(() => {
        if (!isLoading && dataSource.length) {
            setSparePartList([...dataSource]);
        } else {
            setSparePartList([]);
        }
    }, [isLoading, dataSource]);

    const columns = [
        {
            title: "Ersatzteil",
            dataIndex: "title",
            key: uuidv4(),
        },
        {
            title: "Beschreibung",
            dataIndex: "description",
            key: uuidv4(),
        },
        {
            title: "Zulieferer",
            dataIndex: "suppliers",
            key: uuidv4(),
        },
        {
            title: "Bilder",
            dataIndex: "jsn",
            key: uuidv4(),
            render: (jsn) => {
                const images = JSON.parse(jsn);
                return (
                    <Image
                        alt="test"
                        width={40}
                        src={
                            images
                                ? `${siteURL}/uploads/${images[0].fileName}`
                                : "/placeholders/nocar.png"
                        }
                    />
                );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: uuidv4(),
            render: (status: string, item: ISparePartTable) => {
                if (status) {
                    return (
                        <Tag
                            onClick={() => {
                                setSelectedPart(item);
                                setSelectedStatus(status);
                                setReqSpareStatusModal(true);
                            }}
                            color={statusColors[status].color}
                            className="font-sans cursor-pointer"
                        >
                            {getSpareStatusName(status)}
                        </Tag>
                    );
                } else {
                    return <div className="text-center">---</div>;
                }
            },
        },
        {
            title: "Kaufpreis",
            dataIndex: "price",
            key: uuidv4(),
        },
        {
            title: "Löschen",
            key: uuidv4(),
            width: 100,
            render: (id: ISparePartTable, item) => (
                <Button
                    type="dashed"
                    shape="circle"
                    icon={<DeleteOutlined/>}
                    className="text-yellow-800 bg-yellow-100 "
                    onClick={() => {
                        removeSparePart(id, item.id);
                    }}
                />
            ),
        },
        {
            title: "Datum",
            key: uuidv4(),
            width: 100,
            render: (id: ISparePartTable) => (
                <Button
                    type="dashed"
                    shape="circle"
                    icon={<DownloadOutlined/>}
                    className="text-yellow-800 bg-yellow-100 "
                    onClick={() => {
                        setSelectedPart(id);
                        setModalVisible(true);
                    }}
                />
            ),
        },
    ];

    return (
        <div>
            <SpareStatusModal
                status={selectedStatus}
                vehicleId={router.query.id as string}
                partId={selectedPart}
                setReqSpareStatusModal={setReqSpareStatusModal}
                reqSpareStatusModal={reqSpareStatusModal}
                refetch2={refetch}
            />
            <Modal
                title="Datumsangaben"
                centered
                visible={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
            >

                <div className="flex p-4 my-2 bg-green-50">
                    <p className="font-sans font-bold text-gray-700 ">Anforderungsdatum: </p>
                    <span className="ml-3 text-green-600">
             {selectedPart?.createDate
                 ? moment(selectedPart?.createDate).format("LLLL")
                 : "-"}
          </span>
                </div>
                <div className="flex p-4 my-2 bg-green-50">
                    <p className="font-sans font-bold text-gray-700 ">Bestelldatum: </p>
                    <span className="ml-3 text-green-600">
            {selectedPart?.OrderDate
                ? moment(selectedPart?.OrderDate).format("LLLL")
                : "-"}
          </span>
                </div>
                <div className="flex p-4 my-2 bg-green-50">
                    <p className="font-sans font-bold text-gray-700 ">Ankunftsdatum : </p>
                    <span
                        className="ml-3 text-green-600">{selectedPart?.ArriveDate ? moment(selectedPart?.ArriveDate).format("LLLL") : "-"}</span>
                </div>
                <div className="flex p-4 my-2 bg-green-50">
                    <p className="font-sans font-bold text-gray-700 ">Verbaut : </p>
                    <span
                        className="ml-3 text-green-600">{selectedPart?.InstalledDate ? moment(selectedPart?.InstalledDate).format("LLLL") : "-"}</span>
                </div>
            </Modal>
            <Table
                className="time-table-row-select"
                bordered={true}
                pagination={{pageSize: 5, position: ["bottomCenter"]}}
                dataSource={sparePartList}
                columns={columns}
            />
        </div>
    );
};

export default SpareWorkshopTable;
