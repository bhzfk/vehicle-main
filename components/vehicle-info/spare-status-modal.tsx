import {
  DownOutlined,
  FolderOpenTwoTone,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "@reactivers/use-auth";
import { Modal, Form, Input, Select, Dropdown, Button, Menu } from "antd";
import { Option } from "antd/lib/mentions";
import axios from "axios";
import { useSparePartForVehicle } from "hooks/useSpareParts";
import { useEffect } from "react";
import { useState } from "react";
import { updateSpareParts } from "services/spares.service";

const SpareStatusModal = ({
  vehicleId,
  partId,
  status,
  setReqSpareStatusModal,
  reqSpareStatusModal,
  refetch2,
}) => {
  const [form] = Form.useForm();
  const { token } = useAuth();
  const handleSparePartCancel = (e) => {
    setCurrentStatus("OPEN");
    setReqSpareStatusModal(false);
  };

  const { refetch } = useSparePartForVehicle(+vehicleId);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [currentStatus, setCurrentStatus] = useState<string>(status);

  const onSpareFormSubmit = async ({ price, status }) => {
    const resp = await updateSpareParts({
      id: partId?.id,
      price,
      status: status,
      vehicleId: vehicleId,
      token,
    });

    if (resp.result) {
      // refetchSpareparts();
      const response: { result: boolean } = await axios.get(
        process.env.API_URL + "/api/detectSparePartsCost/" + vehicleId
      );
      const { result } = response;
      // if (result) {
      refetch();
      refetch2();
      setReqSpareStatusModal(false);
      // }
      form.resetFields();
      setCurrentStatus("OPEN");
    }
  };

  function handleMenuClick({ key }) {
    setCurrentStatus(key);
  }

  useEffect(() => {form.resetFields()}, [partId])

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="OPEN" icon={<FolderOpenTwoTone />}>
        Öffen
      </Menu.Item>
      <Menu.Item key="ORDERED" icon={<UserOutlined />}>
        Bestellt
      </Menu.Item>
      <Menu.Item key="ARRIVED" icon={<UserOutlined />}>
        Angekommen
      </Menu.Item>
      <Menu.Item key="INSTALLED" icon={<UserOutlined />}>
        Verbaut
      </Menu.Item>
    </Menu>
  );

  return (
    <Modal
      title="Spare part status"
      visible={reqSpareStatusModal}
      onOk={form.submit}
      centered
      onCancel={handleSparePartCancel}
    >
      <div className="flex flex-col items-center justify-center ">
        <Form
          {...layout}
          form={form}
          name="spare-status"
          className="w-full"
          onFinish={onSpareFormSubmit}
          initialValues={partId}
        >
          <Form.Item name="status" label="Status">
            <Select>
              <Option value="">Select a status</Option>
              <Option value="OPEN">Öffen</Option>
              <Option value="ARRIVED">Angekommen</Option>
              <Option value="ORDERED">Bestellt</Option>
              <Option value="INSTALLED">Verbaut</Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Preis">
            <Input type="number" min={0} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default SpareStatusModal;
