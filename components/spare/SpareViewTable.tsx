import {DeleteOutlined, DownloadOutlined, RightOutlined, SearchOutlined} from "@ant-design/icons";
import {Input, Space, Tag, Table, Button, Modal, Image, Select, Tooltip} from "antd";
import moment from "moment";
import {useEffect, useState} from "react";
import {ISparePart, ISparePartTable} from "services/spares.service";
import {v4 as uuidv4} from "uuid";

import "moment/locale/de";
import {deleteVehicle, IVehicleOverview, statusColors, updateVehicleStatus} from "services/vehicles.service";
import {Option} from "antd/lib/mentions";
import Link from "next/link";

moment.locale("de");

const SpareViewTable = ({
                            dataSource,
                            isLoading,
                            showCount = true,
                        }: {
    dataSource: ISparePartTable[];
    isLoading: boolean;
    showCount: boolean;
}) => {
    const [sparePartList, setSparePartList] = useState<ISparePartTable[]>([]);
    const [dateType, setDateType] = useState(false);

    const [vehicleId, setVehicleId] = useState(null);
    const [newStatus, setNewStatus] = useState("");


    const [selectedPart, setSelectedPart] = useState<ISparePartTable>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const siteURL = process.env.SITE_URL;

    useEffect(() => {
        if (!isLoading && dataSource.length) setSparePartList([...dataSource]);
    }, [isLoading, dataSource]);

    const columns = [
        {
            title: (filters, sortOrder) => <div>Marke</div>,
            dataIndex: "brand",
            key: uuidv4(),
            filterDropdown: ({
                                 setSelectedKeys,
                                 selectedKeys,
                                 confirm,
                                 clearFilters,
                             }) => {
                return (
                    <Input
                        autoFocus
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                            confirm({closeDropdown: false});
                        }}
                        value={selectedKeys[0]}
                        placeholder="Search between brands"
                        onPressEnter={() => {
                            confirm();
                        }}
                        onBlur={() => {
                            confirm();
                        }}
                    />
                );
            },
            filterIcon: () => <SearchOutlined/>,
            onFilter: (value, record) => {
                return record.brand.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: "Fahrzeugnummer",
            dataIndex: "vehicleNumber",
            key: uuidv4(),
            filterDropdown: ({
                                 setSelectedKeys,
                                 selectedKeys,
                                 confirm,
                                 clearFilters,
                             }) => {
                return (
                    <Input
                        autoFocus
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                            confirm({closeDropdown: false});
                        }}
                        value={selectedKeys[0]}
                        placeholder="Search between customers"
                        onPressEnter={() => {
                            confirm();
                        }}
                        onBlur={() => {
                            confirm();
                        }}
                    />
                );
            },
            filterIcon: () => <SearchOutlined/>,
            onFilter: (value, record) => {
                if (record.vehicleNo)
                    return record.vehicleNo.toLowerCase().includes(value.toLowerCase());

                return false;
            },
        },
        {
            title: (filters, sortOrder) => <div>Kategorie</div>,
            dataIndex: "Kategorie",
            key: uuidv4(),
            filterDropdown: ({
                                 setSelectedKeys,
                                 selectedKeys,
                                 confirm,
                                 clearFilters,
                             }) => {
                return (
                    <Input
                        autoFocus
                        onChange={(e) => {
                            setSelectedKeys(e.target.value ? [e.target.value] : []);
                            confirm({closeDropdown: false});
                        }}
                        value={selectedKeys[0]}
                        placeholder="Search between categories"
                        onPressEnter={() => {
                            confirm();
                        }}
                        onBlur={() => {
                            confirm();
                        }}
                    />
                );
            },
            filterIcon: () => <SearchOutlined/>,
            onFilter: (value, record) => {
                return record.category.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: "Erstzulassung",
            dataIndex: "firstRegistration",
            key: uuidv4(),
            sorter: (a, b) => a.firstRegistration - b.firstRegistration,
            render: (firstRegistration) => {
                return (
                    <p
                        className="cursor-pointer "
                        onClick={() => {
                            setDateType(!dateType);
                        }}
                    >
                        {dateType
                            ? moment(firstRegistration).fromNow()
                            : moment(firstRegistration).format("L")}
                    </p>
                );
            },
        },
        {
            title: "Ersatzteil",
            dataIndex: "sparePart",
            key: uuidv4(),
        },
        {
            title: "Beschreibung",
            dataIndex: "description",
            key: uuidv4(),
        },
        {
            title: "Bilder",
            dataIndex: "images",
            key: uuidv4(),
            render: (images) => {
                return (
                    // <Image
                    //   alt="test"
                    //   width={40}
                    //   src={
                    //     images
                    //       ? `${siteURL}/uploads/${images[0].fileName}`
                    //       : "/placeholders/nocar.png"
                    //   }
                    // />
                    <Image
                        height={40}
                        width={40}
                        alt="spare"
                        fallback="/placeholders/nocar.png"
                        src={
                            images
                                ? `${siteURL}/uploads/${images[0].fileName}`
                                : "/placeholders/nocar.png"
                        }
                    />
                    //   <Image
                    //     height="40"
                    //     width="40"
                    //     alt="spare part"
                    //     src={
                    //       images
                    //         ? `${siteURL}/uploads/${images[0].fileName}`
                    //         : "/placeholders/nocar.png"
                    //     }
                    //   />
                );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: uuidv4(),
            render: (text, record) => {
                if (record.status) {
                    return (
                        <Tag
                            color={statusColors[record.status].color}
                            className="font-sans"
                            onClick={() => {
                                setVehicleId(record.id);
                            }}
                        >
                            {record.statusName}
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
            title: "Datumsangaben",
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
        {
            title: "Bearbeiten",
            dataIndex: "action",
            key: uuidv4(),
            render: (id: number, item: ISparePart) => {
                return (
                    <div className={'flex'}>
                        <Link href={`/vehicle-info/${item.vehicleId}`} passHref>
                            <Tooltip title={item.vehicleId}>
                                <div
                                    className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full cursor-pointer">
                                    <RightOutlined/>
                                </div>
                            </Tooltip>
                        </Link>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <Modal
                title="Datum"
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
                : "TBD"}
          </span>
                </div>
                <div className="flex p-4 my-2 bg-green-50">
                    <p className="font-sans font-bold text-gray-700 ">Bestelldatum: </p>
                    <span className="ml-3 text-green-600">
            {selectedPart?.OrderDate
                ? moment(selectedPart?.OrderDate).format("LLLL")
                : "TBD"}
          </span>
                </div>
                <div className="flex p-4 my-2 bg-green-50">
                    <p className="font-sans font-bold text-gray-700 ">Ankunftsdatum: </p>
                    <span className="ml-3 text-green-600">
            {selectedPart?.ArriveDate
                ? moment(selectedPart?.ArriveDate).format("LLLL")
                : "TBD"}
          </span>
                </div>
                <div className="flex p-4 my-2 bg-green-50">
                    <p className="font-sans font-bold text-gray-700 ">Ankunftsdatum: </p>
                    <span className="ml-3 text-green-600">
            {selectedPart?.InstalledDate
                ? moment(selectedPart?.InstalledDate).format("LLLL")
                : "TBD"}
          </span>
                </div>
            </Modal>
            <div className="mx-4">
                {showCount && (
                    <Space className="flex w-full h-16 px-4 text-center bg-gray-100">
                        <p className="text-gray-600">
                            Total spare parts: {sparePartList.length}
                        </p>
                        {/* <Input value={searchPhrase} onChange={onSearch} /> */}
                    </Space>
                )}
                <Table
                    className="time-table-row-select"
                    bordered={true}
                    pagination={{pageSize: 5, position: ["bottomCenter"]}}
                    dataSource={sparePartList}
                    columns={columns}
                />


            </div>
            <Modal
                title="Change Status"
                onOk={() => {
                    if (newStatus != "")
                        updateVehicleStatus(vehicleId, newStatus).then((response) => {
                            if (response.status == true) {
                                setVehicleId(null);
                                setNewStatus("");
                            }
                        });
                }}
                onCancel={() => {
                    setVehicleId(null);
                    setNewStatus("");
                }}
                visible={vehicleId !== null}
            >
                <label>New Status : </label>
                <Select value={newStatus} onChange={(value) => setNewStatus(value)}>
                    <Option value="">Status auswählen</Option>
                    <Option value="INCOMING">Auf dem Weg</Option>
                    <Option value="ARRIVED">Angekommen</Option>
                    <Option value="PROCESSING">In Bearbeitung</Option>
                    <Option value="WORKSHOP">Werkstatt</Option>
                    <Option value="SALE">Verkauf</Option>
                    <Option value="FINALPREPARATIONSSALE">FINALPREPARATIONSSALE</Option>
                    <Option value="SOLD">Verkauft</Option>
                    <Option value="OPEN">Öffen</Option>
                    <Option value="ORDERED">Bestellt</Option>
                    <Option value="CHECKED">Kontrolliert</Option>
                    <Option value="MAX">MAX</Option>
                    <Option value="MAX_FINISHED">MAX FINISHED</Option>
                    <Option value="DELIVERED">Geliefert</Option>
                </Select>
            </Modal>

        </>
    );
};

export default SpareViewTable;
