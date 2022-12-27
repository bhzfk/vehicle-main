import { UploadOutlined } from "@ant-design/icons";
import { Modal, Form, Input, Upload, Button } from "antd";
import { useSparePartForVehicle } from "hooks/useSpareParts";
import { useState } from "react";
import { submitSparePart } from "services/spares.service";
import { getSingleFile } from "utils/helpers";

const SubmitSparePartModal = ({
  setReqSpareModel,
  vehicleId,
  currentCheckpointId,
  token,
  refetchSpareparts,
  reqSpareModal,
}) => {
  const [image, setImage] = useState();

  const [form] = Form.useForm();

  const normFile = (e: any) => {
    const img = getSingleFile(e);
    if (img) setImage(img);
    else return;
  };

  const handleSparePartCancel = (e) => {
    setReqSpareModel(false);
  };

  const { refetch } = useSparePartForVehicle(+vehicleId);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const onSpareFormSubmit = async (values) => {

    const resp = await submitSparePart({
      file: image,
      vehicleId,
      checkpointId: currentCheckpointId,
      title: values.title,
      description: values.description,
      suppliers: values.suppliers,
      token,
    });

    if (resp) {
      refetchSpareparts();
      refetch()
      setReqSpareModel(false);
      form.resetFields()
    }
  };

  return (
    <Modal
      title="Ersatzteil bestellen"
      visible={reqSpareModal}
      onOk={form.submit}
      centered
      onCancel={handleSparePartCancel}
    >
      <div className="flex flex-col items-center justify-center mt-12">
        <Form
          {...layout}
          form={form}
          name="register-spare"
          className="w-full"
          onFinish={onSpareFormSubmit}
        >
          <Form.Item name="title" required label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="description" required label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="suppliers" required label="Zulieferer">
            <Input />
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

export default SubmitSparePartModal;
