import { useAuth } from "@reactivers/use-auth";
import useVehicles from "hooks/useVehicles";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { mapVehiclesDataForOverview } from "services/vehicles.service";
import OverviewTable from "components/overview/OverviewTable";

const Overview = () => {
  const { token, user } = useAuth();
  const { vehiclesLoading, vehiclesQuery, isError, refetchVehicles } = useVehicles(token);
  const [mappedVehicles, setMappedVehicles] = useState([]);

  useEffect(() => {
    if (!vehiclesLoading && !isError && vehiclesQuery.length) {
      let dataSource = [];
      dataSource = mapVehiclesDataForOverview(vehiclesQuery, dataSource, user.userInfo?.role);
      setMappedVehicles([...dataSource]);
    }
  }, [vehiclesQuery, vehiclesLoading, isError]);

  if (vehiclesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin tip="loading vehicles..." />
      </div>
    );
  } else {
    return (
      <>
      <OverviewTable dataSource={mappedVehicles} isLoading={vehiclesLoading} refetch={refetchVehicles} />
      </>
    );
  }
};

export default Overview;
