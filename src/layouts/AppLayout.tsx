import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Check live Facebook",
    key: "check-live",
  },
  {
    label: "Cắt chuỗi",
    key: "split-str",
  },
  {
    label: "Gộp link BM",
    key: "merge-str",
  },
  {
    key: "",
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

const AppLayout: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title = "Tiện ích",
}) => {
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
    <div className="container mx-auto">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
        <link rel="canonical" href="" />
      </Helmet>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
        style={{
          background: "linear-gradient(to right, #f2fbfc, #e0f7fa)",
          borderBottom: "1px solid #d1e9e9",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          fontSize: 18,
        }}
        theme="light"
      />
      <div>{children}</div>
    </div>
  );
};
export default AppLayout;
