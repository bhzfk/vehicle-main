import {Space, Tag, Table, Input, Tooltip, Image, Select} from "antd";
import {
    deleteVehicle,
    IVehicleOverview,
    statusColors,
    updateVehicleStatus,
} from "services/vehicles.service";
// import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {RightOutlined, SearchOutlined, DeleteOutlined} from "@ant-design/icons";
import moment from "moment";
import "moment/locale/de";
import {truncate} from "utils/format";
import Modal from "antd/lib/modal/Modal";
import {Option} from "antd/lib/mentions";
import {useAuth} from "@reactivers/hooks";

moment.locale("de");

const OverviewTable = ({
                           dataSource,
                           isLoading,
                           refetch,
                       }: {
    dataSource: IVehicleOverview[];
    isLoading: boolean;
    refetch: any;
}) => {
    const siteURL = process.env.SITE_URL;
    const [vehiclesList, setVehiclesList] = useState<IVehicleOverview[]>([]);
    const [dateType, setDateType] = useState(false);

    const [vehicleId, setVehicleId] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    const {user} = useAuth();

    useEffect(() => {
        setVehiclesList([...dataSource]);
    }, [dataSource, isLoading]);

    let columns = [
        {
            title: "Fahrzeugnummer.",
            dataIndex: "vehicleNo",
            key: uuidv4(),
            render: (vehicleNo, item) => (
                // <Link href={`/vehicle-info/${item.id}`}>{vehicleNo}</Link>
                <Tooltip title={vehicleNo}>{truncate(vehicleNo, 10, false)}</Tooltip>
            ),
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
            title: (filters, sortOrder) => <div>Make</div>,
            dataIndex: "make",
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
                        placeholder="Search between makes"
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
                return record.make.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: (filters, sortOrder) => <div>Modell</div>,
            dataIndex: "model",
            key: uuidv4(),
            render: (model) => (
                <Tooltip title={model}>{truncate(model, 10, false)}</Tooltip>
            ),
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
                        placeholder="Search between models"
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
                return record.model.toLowerCase().includes(value.toLowerCase());
            },
        },
        {
            title: (filters, sortOrder) => <div>Kategorie</div>,
            dataIndex: "category",
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
    ];

    if (user.userInfo.role === 'owner' || user.userInfo.role === 'sale') {

        columns.push({
                title: "Kaufdatum",
                dataIndex: "purchaseDate",
                key: uuidv4(),
                // @ts-ignore
                sorter: (a, b) => a.purchaseDate - b.purchaseDate,
                render: (purchaseDate) => {
                    return (
                        <p
                            className="cursor-pointer "
                            onClick={() => {
                                setDateType(!dateType);
                            }}
                        >
                            {dateType
                                ? moment(purchaseDate).fromNow()
                                : moment(purchaseDate).format("L")}
                        </p>
                    );
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
            },)
    }

    columns.push({
            title: (filters, sortOrder) => <div>Identifikationsnummer</div>,
            dataIndex: "idNumber",
            key: uuidv4(),
            render: (idNumber) => (
                // <Tooltip title={idNumber}>{truncate(idNumber, 10, false)}</Tooltip>
                <Tooltip title={idNumber}>...{idNumber.substr(-6)}</Tooltip>
            ),
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
                return record.idNumber.toLowerCase().includes(value.toLowerCase());
            },
        }
        ,
        // @ts-ignore
        {
            title: "Bilder",
            dataIndex: "images",
            key: uuidv4(),
            render: (images) => {
                return (
                    <Image
                        height={40}
                        width={40}
                        alt="vehicle"
                        fallback="/placeholders/nocar.png"
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
            title: "Zustand",
            dataIndex: "condition",
            key: uuidv4(),
            render: (condition) => {
                if (condition) {
                    return (
                        <Tooltip title={condition.title}>
                            <Tag color={condition.color} className="font-sans">
                                {truncate(condition.title, 10, false)}
                            </Tag>
                        </Tooltip>
                    );
                } else {
                    return <div className="text-center">---</div>;
                }
            },
        },
        {
            title: "Status",
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
            filters: [
                {
                    text: 'Auf dem Weg',
                    value: 'INCOMING',
                },
                {
                    text: 'Angekommen',
                    value: 'ARRIVED',
                },
                {
                    text: 'In Bearbeitung',
                    value: 'PROCESSING',
                },
                {
                    text: 'Werkstatt',
                    value: 'WORKSHOP',
                },
                {
                    text: 'Verkauf',
                    value: 'SALE',
                },
                {
                    text: 'FINALPREPARATIONSSALE',
                    value: 'FINALPREPARATIONSSALE',
                },
                {
                    text: 'Verkauft',
                    value: 'SOLD',
                },
                {
                    text: 'Öffen',
                    value: 'OPEN',
                },
                {
                    text: 'Bestellt',
                    value: 'ORDERED',
                },
                {
                    text: 'Kontrolliert',
                    value: 'CHECKED',
                },
                {
                    text: 'MAX',
                    value: 'MAX',
                },
                {
                    text: 'MAX_FINISHED',
                    value: 'MAX_FINISHED',
                },
                {
                    text: 'Geliefert',
                    value: 'DELIVERED',
                },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string, record) => record.status === value,
            width: '30%',
        },
        {
            title: "Ersatzteil",
            dataIndex: "openOrderArrive",
            key: uuidv4(),
        },
        {
            title: "Bearbeiten",
            dataIndex: "action",
            key: uuidv4(),
            render: (id: number, item: IVehicleOverview) => {
                return (
                    <div className={'flex'}>
                        <Link href={`/vehicle-info/${item.id}`} passHref>
                            <Tooltip title={item.id}>
                                <div
                                    className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full cursor-pointer">
                                    <RightOutlined/>
                                </div>
                            </Tooltip>
                        </Link>
                        {user.userInfo?.role === 'owner' && (<div
                            className="flex items-center justify-center w-8 h-8 bg-red-300 rounded-full cursor-pointer ml-3"
                            onClick={() => {
                                if (confirm("Are you sure ?"))
                                    deleteVehicle(item.id).then((response) => {
                                        if (response.status == true) {
                                            refetch()
                                        }
                                    });
                            }}>
                            <DeleteOutlined/>
                        </div>)}
                    </div>
                );
            },
        },)


    return (
        <div className="mx-4 mt-8">
            <Space className="flex w-full h-12 px-4 text-center bg-gray-100">
                <p className="m-0 text-gray-600">
                    Anzahl der Fahrzeuge: {vehiclesList.length}
                </p>
                {/* <Input value={searchPhrase} onChange={onSearch} /> */}
            </Space>
            <Table
                bordered={true}
                // title={() => `Total vehicles: ${data.length}`}
                pagination={{pageSize: 5, position: ["bottomCenter"]}}
                dataSource={vehiclesList}
                columns={columns}
            />

            <Modal
                title="Change Status"
                onOk={() => {
                    if (newStatus != "")
                        updateVehicleStatus(vehicleId, newStatus).then((response) => {
                            if (response.status == true) {
                                setVehicleId(null);
                                setNewStatus("");
                                refetch();
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
        </div>
    );
};

export default OverviewTable;
