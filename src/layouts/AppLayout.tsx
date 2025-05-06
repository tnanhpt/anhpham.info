import React, { useEffect, useState } from "react";
import { EditOutlined, FacebookOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Check Live UID Facebook",
    key: "check-live-uid",
    icon: <FacebookOutlined style={{ fontSize: "22px" }} />,
  },
  {
    key: "",
    icon: <EditOutlined style={{ fontSize: "22px" }} />,
    label: (
      <a
        href="https://note.anhpham.info"
        target="_blank"
        rel="noopener noreferrer"
      >
        Ghi chú nhanh
      </a>
    ),
  },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [current, setCurrent] = useState("check-live-uid");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let path = location.pathname.split("/")[1];
    if (!path) {
      path = "check-live-uid";
    }
    setCurrent(path);
  }, [location.pathname]);

  const onClick: MenuProps["onClick"] = (e) => {
    if (!e.key) return;
    setCurrent(e.key);
    switch (e.key) {
      default:
        navigate("/" + e.key);
        break;
    }
  };

  return (
    <>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        style={{
          background: "linear-gradient(to right, #e0f7fa, #ffffff)", // Gradient pastel sáng
          borderBottom: "1px solid #d1e9e9", // Đường viền nhẹ
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Hiệu ứng đổ bóng
         
        }}
        theme="light"
      />
      <div>{children}</div>
    </>
  );
};
export default AppLayout;
