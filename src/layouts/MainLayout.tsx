import { ReactNode } from "react";

import { Layout, theme } from "antd";

const { Content } = Layout;

interface IProps {
  children: ReactNode;
}
const MainLayout = ({ children }: IProps) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>
      {/* <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Check Live UID",
            }
          ]}
        />
      </Sider> */}
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header> */}
        <Content
          style={{
            // margin: "24px 16px",
            padding: "24px 16px",
            background: "linear-gradient(to bottom right, #e0f7fa, #ffffff)", // Gradient pastel sáng
            borderRadius: borderRadiusLG,
            textAlign: "left",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
