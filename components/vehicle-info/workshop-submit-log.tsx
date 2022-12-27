import { useState} from "react";
import {Button, Form, Input} from "antd";
import {
    calculateInteralWorkShopCost,
    submitWorkLog,
} from "services/vehicles.service";

const WorkShopSubmitLog = ({
                               vehicleId,
                               checkPointId,
                               status,
                               statuses,
                               token,
                               checkpoint,
                           }) => {
    const [form] = Form.useForm();
    const [isOnlySave, setIsOnlySaved] = useState(false)
    return (
        <Form
            labelCol={{span: 5}}
            labelAlign="left"
            form={form}
            onFinish={async ({description, hour, min}) => {
                let time = (hour * 60) + min;
                // if (description.length > 0 && time > 0) {
                const resp = await submitWorkLog(
                    checkPointId,
                    description,
                    Math.abs(hour),
                    Math.abs(min),
                    isOnlySave ? statuses[0] : statuses[1],
                    "0",
                    "0",
                    token,
                    vehicleId
                );
                await calculateInteralWorkShopCost(vehicleId);
                alert("Log submitted");
                // }
            }}
            initialValues={{
                description: checkpoint.description,
                hour: checkpoint.hour,
                min: checkpoint.min,
            }}
        >
            <Form.Item name="description" label="Beschreibung">
                <Input/>
            </Form.Item>
            <Form.Item label="Dauer">
                <div className="grid grid-cols-2 gap-1">
                    <Form.Item name="hour">
                        <Input min={0} type="number" placeholder="hours"/>
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
            <Button
                style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
                onClick={() => {
                    setIsOnlySaved(false)
                    form.submit()
                }}
            >
                Fehler behoben
            </Button>
            <br />
            <Button
                style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}
                onClick={() => {
                    setIsOnlySaved(true)
                    form.submit()
                }}
            >
                Speichern
            </Button>
        </Form>
    );
};

export default WorkShopSubmitLog;
