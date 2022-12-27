import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { TextLoop } from "react-text-loop-next";
import { useAuth } from "@reactivers/use-auth";
import Loading from "./loading";

const Login = () => {
  const initialValues = { remember: true, username: "", password: "" };
  const [isError, setIsError] = useState(false);
  const [form] = Form.useForm();
  const [showLoading, setShowLoading] = useState(false);
  const { login, token, user } = useAuth();
  const roles = [
    { abbr: "wox", title: "owner", access: [] },
    { abbr: "asx", title: "sale", access: [] },
    { abbr: "1sx", title: "max", access: [] },
    { abbr: "pox", title: "workshop", access: [] },
    { abbr: "per", title: "preparation", access: [] },
    { abbr: "wor", title: "workshop_user", access: [] },
    { abbr: "spa", title: "spare", access: [] },
  ];

  const onFormSubmit = async (values) => {
    const { username, password, remember } = values;
    const response = await fetch(process.env.API_URL + "/api/ulogin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();

    if (!data.state) {
      setIsError(true);
      form.setFieldsValue({ password: "" });
    } else {
      setIsError(false);
      form.resetFields();
      const role = roles.find(
        (role) => role.abbr === data.token.substring(0, 3)
      );
      setShowLoading(true);
      setTimeout(() => {
        // Storing user data
        localStorage.setItem(
          "vehicle_user_data",
          JSON.stringify({
            username,
            token: data.token,
            role: role.title,
          })
        );

        login({ username, token: data.token, userInfo: { role: role.title } });
      }, 4960);
    }
  };

  {
    return showLoading ? (
      <Loading />
    ) : (
      <div className="flex">
        <div className="flex flex-col items-center justify-center w-full bg-gray-200 md:w-1/3">
          <div className="mb-20">
            <Image
              src="/logo/logo.png"
              width={410 * 0.5}
              height={109 * 0.5}
              alt="logo"
            />
          </div>
          <Form
            form={form}
            name="login-form"
            className="w-2/3 sm:w-1/2 md:w-2/3 2xl:w-1/2"
            initialValues={initialValues}
            onFinish={onFormSubmit}
          >
            <Alert
              className={clsx(
                "mb-4 rounded-xl",
                !isError ? "invisible" : "visible"
              )}
              banner
              type="error"
              message={
                <TextLoop mask interval={5000}>
                  <div>Invalid credentials</div>
                  <div>Please try again</div>
                </TextLoop>
              }
            />

            <Form.Item name="username" rules={[{ required: true }]}>
              <Input
                className="w-full h-12 text-xl rounded-lg"
                prefix={<UserOutlined className="mr-2" />}
                placeholder="Nutzername"
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
              <Input
                prefix={<LockOutlined className="mr-2" />}
                className="h-12 text-xl rounded-lg"
                type="password"
                placeholder="Passwort"
              />
            </Form.Item>
            <div className="flex justify-between pb-4">
              <Form.Item
                className=""
                name="remember"
                valuePropName="checked"
                noStyle
              >
                <Checkbox>Erinnere dich an mich</Checkbox>
              </Form.Item>
              <span className="text-primary">Passwort vergessen?</span>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="mr-2">
                Anmeldung
              </Button>
              Or{" "}
              <a href="#" className="text-primary">
                jetzt registrieren!
              </a>
            </Form.Item>
          </Form>
        </div>
        <div className="relative flex invisible h-screen sm:visible md:w-2/3 bg-primary">
          <Image
            className=""
            alt="Mountains"
            src="/backgrounds/umweltteaser_startseite.jpg"
            layout="fill"
            objectFit="cover"
            quality={100}
            objectPosition="15%"
          />
        </div>
      </div>
    );
  }
};

export default Login;
