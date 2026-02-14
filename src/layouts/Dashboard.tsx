import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import Icon, { BellFilled } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  message,
  Space,
  theme,
} from "antd";
import { useState, type ReactNode } from "react";
import Logo from "../components/icons/Logo";
import { useAuthStore } from "../store/store";
import Home from "../components/icons/Home";
import UserIcon from "../components/icons/UserIcon";
import { foodIcon } from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import { UserRole } from "../constants";

const { Sider, Header, Content, Footer } = Layout;

interface MenuItems{
    key:string,
    icon:ReactNode,
    label:ReactNode
}
const items:MenuItems[] = [
  {
    key: "/",
    icon: <Icon component={Home} />,
    label: <NavLink to="/">Home</NavLink>,
  },
  {
    key: "/users",
    icon: <Icon component={UserIcon} />,
    label: <NavLink to="/users">Users</NavLink>,
  },
  {
    key: "/restaurants",
    icon: <Icon component={foodIcon} />,
    label: <NavLink to="/restaurants">Restaurants</NavLink>,
  },
  {
    key: "/products",
    icon: <Icon component={BasketIcon} />,
    label: <NavLink to="/products">Products</NavLink>,
  },
  {
    key: "/promo",
    icon: <Icon component={GiftIcon} />,
    label: <NavLink to="/promos">Promos</NavLink>,
  },
];

async function logoutUser() {
  return await logout();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMenuItems = (items: MenuItems[], role: string): any[]  => {
  if (role === UserRole.MANAGER) {
    return items.filter((item) => item.key !== "/user");
  }
  return items;
};


export default function Dashboard() {
  const { user, logout: logoutFromStore } = useAuthStore();
  const loaction = useLocation()
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutUser,
    onSuccess: async () => {
      message.success('logout successfully')
      logoutFromStore();
      return;
    },
  });
 
  if (user === null) {
    return <Navigate to={`/auth/login?returnTo=${loaction.pathname}`} replace />;
  }
  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          theme="light"
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo">
            <Logo />
          </div>

          <Menu
            theme="light"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            items={getMenuItems(items,user.role) ?? []}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              background: colorBgContainer,
            }}
          >
            <Flex gap={"middle"} align="start" justify="space-between">
              <Badge
                text={
                  user?.role === UserRole.ADMIN
                    ? "You are Admin"
                    : (user?.tenant?.name ?? "No tenant")
                }
                status="success"
              />
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutMutate(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Avatar
                    style={{
                      backgroundColor: "#fde3cf",
                      color: "#f56a00",
                    }}
                  >
                    U
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "16px 16px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>Mernspace pizza shop</Footer>
        </Layout>
      </Layout>
    </div>
  );
}
