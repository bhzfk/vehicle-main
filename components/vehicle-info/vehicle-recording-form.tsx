import { useAuth } from "@reactivers/use-auth";
import { Badge, Button, Card, DatePicker, Form, Input, Radio } from "antd";
import clsx from "clsx";
import { updatePhysicalRecording } from "services/recording.service";
import { fixDateFormat } from "utils/format";

const VehicleReception = ({
  conditions,
  vehicleId,
  onVehicleInfoUpdate,
  vehicleInfo,
  isLoading,
}) => {
  const { token } = useAuth();
  const [form] = Form.useForm();
  !isLoading &&
    form.setFieldsValue({ vehicleNumber: vehicleInfo[0].vehicleNumber });
  const onUpdateSubmit = async (values: any) => {
    values.startDate = fixDateFormat(values.startDate._d);
    values.conditionId = values.conditionId.toString();
    values.token = token;
    values.vehicleId = vehicleId.toString();
    await updatePhysicalRecording(values);
    onVehicleInfoUpdate();
  };

  return (
    <Form
      form={form}
      onFinish={onUpdateSubmit}
      name="recording-update"
      layout="inline"
    >
      <h1>DDD</h1>
      <Form.Item
        // rules={[{ required: true }]}
        name="vehicleNumber"
        label="Fahrzeugnummer."
      >
        <Input placeholder="vehicle number" />
      </Form.Item>
      <Form.Item
        // rules={[{ required: true }]}
        name="startDate"
        label="Start Datum"
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        // rules={[{ required: true }]}
        name="conditionId"
        className="w-full"
      >
        <Radio.Group buttonStyle="solid">
          <div className="grid grid-cols-2 gap-8">
            {conditions.map((condition) => {
              let color =
                condition.color === "orange" ? "yellow" : condition.color;
              return (
                <div
                  key={condition.id}
                  className="transition-all border-2 border-gray-100 cursor-pointer hover:border-gray-200"
                >
                  <Badge.Ribbon color={color} className="">
                    <Card title={condition.title} className="p-0" size="small">
                      <div className="flex">
                        <p
                          className={clsx(
                            `bg-${color}-50`,
                            "p-2 flex-1 m-0 min-h-20"
                          )}
                        >
                          {condition.description}
                        </p>
                        <div
                          className={clsx(
                            "pr-1 pb-1 flex items-end",
                            `bg-${color}-50`
                          )}
                        >
                          <Radio.Button value={condition.id}>
                            Auswählen
                          </Radio.Button>
                        </div>
                      </div>
                    </Card>
                  </Badge.Ribbon>
                </div>
              );
            })}
          </div>
        </Radio.Group>
      </Form.Item>
      <div className="flex items-center justify-center w-full mt-8">
        <Form.Item>
          <Button type="default" htmlType="submit">
            Weiter
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default VehicleReception;
