import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Space, Tag, Table, Button, Modal, Image } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { ISparePartTable } from "services/spares.service";
import { v4 as uuidv4 } from "uuid";

import "moment/locale/de";
import { statusColors } from "services/vehicles.service";
import { IBEvalView } from "services/evaluation.service";
import clsx from "clsx";
moment.locale("de");

const BusinessEvalViewTable = ({
  dataSource,
  isLoading,
}: {
  dataSource: IBEvalView[];
  isLoading: boolean;
}) => {
  const [evalList, setEvalList] = useState<IBEvalView[]>([]);
  const [dateType, setDateType] = useState(false);

  const siteURL = process.env.SITE_URL;

  useEffect(() => {
    setEvalList([...dataSource]);
  }, [isLoading, dataSource]);

  const columns = [
    {
      title: "Fahrzeugnummer",
      dataIndex: "vehicleNumber",
      key: uuidv4(),
      // sorter: (a, b) => a - b,
      // render: (vehicleNo) => <a>{vehicleNo}</a>,
    },
    {
      title: (filters, sortOrder) => <div>Marke</div>,
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
              confirm({ closeDropdown: false });
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
      filterIcon: () => <SearchOutlined />,
      onFilter: (value, record) => {
        return record.make.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: (filters, sortOrder) => <div>Modell</div>,
      dataIndex: "model",
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
              confirm({ closeDropdown: false });
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
      filterIcon: () => <SearchOutlined />,
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
              confirm({ closeDropdown: false });
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
      filterIcon: () => <SearchOutlined />,
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
      title: "Verkaufsdatum",
      dataIndex: "saleDate",
      key: uuidv4(),
      sorter: (a, b) => a.saleDate - b.saleDate,
      render: (saleDate) => {
        if (!saleDate) return <p>---</p>;
        return (
          <p
            className="cursor-pointer "
            onClick={() => {
              setDateType(!dateType);
            }}
          >
            {dateType
              ? moment(saleDate).fromNow()
              : moment(saleDate).format("L")}
          </p>
        );
      },
    },
    {
      title: "Kaufdatum",
      dataIndex: "purchaseDate",
      key: uuidv4(),
      sorter: (a, b) => a.purchaseDate - b.purchaseDate,
      render: (purchaseDate) => {
        if (!purchaseDate) return <p>---</p>;
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
      title: "Vorbereitungskosten",
      dataIndex: "processingCosts",
      key: uuidv4(),
    },
    {
      title: "Ersatzteilkosten",
      dataIndex: "sparePartsCosts",
      key: uuidv4(),
    },

    {
      title: "Werkstattkosten",
      dataIndex: "workshopCosts",
      key: uuidv4(),
    },
    {
      title: "Andere Kosten",
      dataIndex: "otherCosts",
      key: uuidv4(),
    },
    {
      title: "Gesamtkosten",
      dataIndex: "totalCosts",
      key: uuidv4(),
    },

    {
      title: "Verkaufspreis",
      dataIndex: "sellingPrice",
      key: uuidv4(),
    },
    {
      title: "Profit",
      dataIndex: "profits",
      key: uuidv4(),
      render: (profits, item) => {
        return (
          <a
            href={`/vehicle-info/${item.vId}`}
            className={clsx(`text-${profits < 0 ? "red" : "green"}-400`)}
          >
            {profits}
          </a>
        );
      },
    },
  ];

  return (
    <>
      <div className="mx-4 mt-8">
        <Space className="flex w-full h-16 px-4 text-center bg-gray-100">
          <p className="text-gray-600">Total spare parts: {evalList.length}</p>
          {/* <Input value={searchPhrase} onChange={onSearch} /> */}
        </Space>
        <Table
          className="time-table-row-select"
          bordered={true}
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          dataSource={evalList}
          columns={columns}
        />
      </div>
    </>
  );
};

export default BusinessEvalViewTable;
