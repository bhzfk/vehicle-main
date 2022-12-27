import { useTotalPoints } from "hooks/useCheckpoints";

type PropsType = {
  vehicleId: string;
  areaId: number;
  areaType: number;
};

const Checkpoints = ({ vehicleId, areaId, areaType }: PropsType) => {
  const { totalPointsLoading, totalPointsQuery, refetchTotalPoints } =
    useTotalPoints(vehicleId, areaId, areaType);

  return <div>{!totalPointsLoading && JSON.stringify(totalPointsQuery)}</div>;
};

export default Checkpoints;
