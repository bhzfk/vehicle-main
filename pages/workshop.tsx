import { useAuth } from "@reactivers/use-auth";
import { useVehiclesArchive } from "hooks/useVehicles";
import { Spin } from "antd";
import { useMemo } from "react";
import {
  IVehicle,
  IVehicleOverview,
  mapVehiclesDataForOverview,
} from "services/vehicles.service";
import OverviewTable from "components/overview/OverviewTable";

const Workshop = () => {
  // async function getVehicles = () {}
  const { token } = useAuth();

  const {
    isLoading,
    data,
  }: { isLoading: boolean; error: any; data: IVehicle[]; isFetching: boolean } =
    useVehiclesArchive(token);
  let dataSource: IVehicleOverview[] = useMemo(() => [], []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin tip="loading vehicles archive..." />
      </div>
    );
  } else {
    dataSource = [];
    dataSource = mapVehiclesDataForOverview(data, dataSource);
    return (
      <OverviewTable
        dataSource={dataSource}
        isLoading={isLoading}
        refetch={() => {}}
      />
    );
  }
};

export default Workshop;
