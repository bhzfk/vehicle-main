import { SmileOutlined, UploadOutlined } from "@ant-design/icons";
import { Modal, Form, Input, Upload, Button, notification } from "antd";
import { useState } from "react";
import {
  submitWorkLog,
  detectPreparationCost,
} from "services/vehicles.service";
import { getSingleFile } from "utils/helpers";

const SubmitJobLogModal = ({
  setReqModal,
  vehicleId,
  currentCheckpointId,
  token,
  refetchSpareparts,
  reqModal,
  status,
}) => {
  const [image, setImage] = useState();

  const [form] = Form.useForm();
  const normFile = (e: any) => {
    const img = getSingleFile(e);
    if (img) setImage(img);
    else return;
  };

  const handleFormCancel = (e) => {
    setReqModal(false);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const onJobLogSubmit = async ({ hour, min, description }) => {
    const resp = await submitWorkLog(
      currentCheckpointId.toString(),
      description,
      +hour,
      +min,
      status,
      "",
      "",
      token,
      vehicleId
    );

    if (resp) {
      refetchSpareparts();
      detectPreparationCost(vehicleId);
      setReqModal(false);
      notification.success({
        message: "Succeed",
        description: "Work log submitted successfully",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });

      form.resetFields()
    }
  };

  return (
    <Modal
      title="Submit work log"
      visible={reqModal}
      onOk={form.submit}
      centered
      onCancel={handleFormCancel}
    >
      <div className="flex flex-col items-center justify-center mt-12">
        <Form
          {...layout}
          form={form}
          name="register-spare"
          className="w-full"
          onFinish={onJobLogSubmit}
        >
          <Form.Item name="description" required label="Description">
            <Input />
          </Form.Item>

          <Form.Item label="Duration">
            <div className="grid grid-cols-2 gap-1">
              <Form.Item name="hour">
                <Input min={0} type="number" placeholder="hours" />
              </Form.Item>
              <Form.Item name="min">
                <Input
                  type="number"
                  step={10}
                  min={0}
                  max={50}
                  placeholder="minutes"
                />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            name="image"
            label="Images"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload an image"
          >
            <Upload
              name="images"
              listType="picture"
              className="upload-list-inline"
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default SubmitJobLogModal;
