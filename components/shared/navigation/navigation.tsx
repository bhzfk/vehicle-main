import { useAuth } from "@reactivers/use-auth";
import { Button, Menu } from "antd";
import { useRouter } from "next/router";
import { useState } from "react";
import { menuItems } from "services/menus.service";
import Logotype from "../logo/flogotype/flogotype";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useIsFetching } from "react-query";

/* eslint-disable-next-line */
export interface NavigationProps {}

export function Navigation(props: NavigationProps) {
  const { logout, user } = useAuth();
  let role = null;
  if (user.userInfo) {
    role = user.userInfo.role;
  }
  const router = useRouter();
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  // It's true whenever a query is run in the background
  const isFetching = useIsFetching();

  const [selected, setSelected] = useState("");
  const handleItemSelect = (e) => {
    setSelected(e.key);
    router.push(`/${menuItems[e.key].link}`);
  };

  return (
    <div className="flex items-center justify-center w-full h-24 px-8 text-lg bg-gray-100 md:justify-between font-body dark:bg-black">
      <Logotype
        classes="w-1/5 flex items-center cursor-pointer"
        setSelected={setSelected}
        scaleFactor={2}
      />
      <div className="flex justify-center w-3/5">
        <Menu
          onClick={handleItemSelect}
          selectedKeys={[selected]}
          mode="horizontal"
          className="flex items-center justify-center w-full"
        >
          {menuItems.map(
            (menuItem) =>
              menuItem.roles.includes(role) && (
                <Menu.Item className="font-sans" key={menuItem.id}>
                  {menuItem.title_de}
                </Menu.Item>
              )
          )}
        </Menu>
      </div>
      <div className="flex justify-end invisible w-1/5 md:visible">
        {isFetching ? <Spin indicator={antIcon} /> : null}
        <Button
          className="ml-4 font-sans"
          onClick={() => {
            localStorage.clear();
            logout()
          }}
          type="default"
        >
          Ausloggen
        </Button>
      </div>
    </div>
  );
}

export default Navigation;
