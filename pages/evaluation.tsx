import { useAuth } from "@reactivers/use-auth";
import { Spin } from "antd";
import BusinessEvalViewTable from "components/evaluation/BusinessEvalViewTable";
import { useBusinessEvaluation } from "hooks/useVehicles";
import { useMemo } from "react";
import {
  IBEvalView,
  mapEvaluationDateForView,
} from "services/evaluation.service";

const Evaluation = () => {
  const { token } = useAuth();
  const { isLoading, data } = useBusinessEvaluation(token);

  let dataSource: IBEvalView[] = useMemo(() => [], []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin tip="loading vehicles archive..." />
      </div>
    );
  } else {
    dataSource = [];
    dataSource = mapEvaluationDateForView(data, dataSource);
    return (
      <BusinessEvalViewTable dataSource={dataSource} isLoading={isLoading} />
    );
  }
};

export default Evaluation;
