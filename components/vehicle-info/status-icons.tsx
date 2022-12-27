import {
  CheckCircleTwoTone,
  FrownTwoTone,
  LoadingOutlined,
  MehTwoTone,
  SmileTwoTone,
} from "@ant-design/icons";
import { checkpointStatus } from "services/checkpoints.service";

const StatusIcon = ({ status }) => {

  switch (status) {
    case checkpointStatus[2].value: //ok
    case checkpointStatus[3].value: //ok
    case checkpointStatus[4].value: //partOk
      return <CheckCircleTwoTone twoToneColor="#52c41a" />;
    case checkpointStatus[0].value: //pending
    case checkpointStatus[1].value: //pending
      return <FrownTwoTone color="#f82000" />;
    // case checkpointStatus[4].value: //no
    //   return <FrownTwoTone twoToneColor="#f82000" />;
    default:
      return <MehTwoTone twoToneColor="#838383" />;
  }
};

export default StatusIcon;
