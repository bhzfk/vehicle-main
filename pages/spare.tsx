import { Spin } from "antd";
import { useMemo } from "react";
import { useSpareParts } from "hooks/useSpareParts";
import {
  ISparePartTable,
  mapSparePartDataToTable,
} from "services/spares.service";
import SpareViewTable from "components/spare/SpareViewTable";

const Spare = () => {
  const { isLoading, data } = useSpareParts();

  let dataSource: ISparePartTable[] = useMemo(() => [], []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin tip="loading spare parts..." />
      </div>
    );
  } else {
    dataSource = [];
    dataSource = mapSparePartDataToTable(data, dataSource);
    return (
      <div className="pt-8">
        <SpareViewTable
          showCount={true}
          dataSource={dataSource}
          isLoading={isLoading}
        />
      </div>
    );
  }
};

export default Spare;
