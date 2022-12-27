import { checkpointStatus } from "services/checkpoints.service";
import { Menu } from "antd";

const CheckpointStatusDropDown = ({ handleSelect, status, filter }) => {
  return (
    <Menu onClick={handleSelect}>
      {checkpointStatus.map(
        (cpStatus) =>
          cpStatus.value !== status &&
          !filter.includes(cpStatus.value) && (
            <Menu.Item key={cpStatus.value}>
              <a>{cpStatus.message}</a>
            </Menu.Item>
          )
      )}
    </Menu>
  );
};

export default CheckpointStatusDropDown;
