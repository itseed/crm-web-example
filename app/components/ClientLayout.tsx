"use client";

import {
  ConfigProvider,
  Layout,
  Menu,
  Avatar,
  Space,
  Button,
  Typography,
  Badge,
  Dropdown,
  MenuProps,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  ThunderboltOutlined,
  UserAddOutlined,
  BarChartOutlined,
  FunnelPlotOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
  CrownOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  MessageOutlined,
  BookOutlined,
  ApiOutlined,
  SecurityScanOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, StrictMode } from "react";
import type { ReactNode } from "react";
import themeConfig from "../../theme/themeConfig";
import LanguageSwitcher from "./LanguageSwitcher";
import { useDataSeeder } from "../../hooks/useDataSeeder";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const t = useTranslations("menu");
  const locale = useLocale();
  const { seedSampleData } = useDataSeeder();

  // Seed sample data on first load
  useEffect(() => {
    seedSampleData();
  }, [seedSampleData]);

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile Settings",
    },
    {
      key: "account",
      icon: <UserSwitchOutlined />,
      label: "Account Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
      danger: true,
    },
  ];

  return (
    <ConfigProvider theme={themeConfig}>
      <StrictMode>
        <Layout style={{ minHeight: "100vh", background: "#F8FAFC" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Logo/Brand Area */}
            <div
              style={{
                color: "#fff",
                padding: "24px 16px",
                textAlign: "center",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "20px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                <CrownOutlined style={{ fontSize: "24px", color: "#FFD700" }} />
                SaaS CRM
              </div>
              <Text
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "12px",
                  display: "block",
                  marginTop: "4px",
                  letterSpacing: "0.3px",
                }}
              >
                Professional Edition
              </Text>
            </div>

            <Menu
              theme="dark"
              mode="inline"
              style={{
                background: "transparent",
                border: "none",
                padding: "0 8px",
              }}
              items={[
                {
                  key: "dashboard",
                  icon: <DashboardOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {t("dashboard")}
                    </Link>
                  ),
                },
                {
                  key: "leads",
                  icon: <UserAddOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/leads`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {t("leads")}
                    </Link>
                  ),
                },
                {
                  key: "pipeline",
                  icon: <FunnelPlotOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/pipeline`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Sales Pipeline
                    </Link>
                  ),
                },
                {
                  key: "customers",
                  icon: <UserOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/customers`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {t("customers")}
                    </Link>
                  ),
                },
                {
                  key: "tickets",
                  icon: <CustomerServiceOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/tickets`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {t("tickets")}
                    </Link>
                  ),
                },
                {
                  key: "tasks",
                  icon: <CheckSquareOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/tasks`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Tasks
                    </Link>
                  ),
                },
                {
                  key: "communications",
                  icon: <MessageOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/communications`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Communications
                    </Link>
                  ),
                },
                {
                  key: "automation",
                  icon: <ThunderboltOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/automation`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {t("automation")}
                    </Link>
                  ),
                },
                {
                  key: "analytics",
                  icon: <BarChartOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/analytics`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Analytics
                    </Link>
                  ),
                },
                {
                  key: "reports",
                  icon: <FileTextOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/reports`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Reports
                    </Link>
                  ),
                },
                {
                  key: "knowledge-base",
                  icon: <BookOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/knowledge-base`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Knowledge Base
                    </Link>
                  ),
                },
                {
                  key: "integrations",
                  icon: <ApiOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/integrations`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Integrations
                    </Link>
                  ),
                },
                {
                  key: "workflow-builder",
                  icon: <BranchesOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/workflow-builder`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Workflow Builder
                    </Link>
                  ),
                },
                {
                  key: "audit-logs",
                  icon: <SecurityScanOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/audit-logs`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Audit Logs
                    </Link>
                  ),
                },
                {
                  key: "settings",
                  icon: <SettingOutlined style={{ fontSize: "16px" }} />,
                  label: (
                    <Link
                      href={`/${locale}/settings`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      Settings
                    </Link>
                  ),
                },
              ]}
            />

            {/* Bottom Section */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "16px",
                right: "16px",
                padding: "16px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "12px",
                  display: "block",
                  textAlign: "center",
                }}
              >
                Need help?
              </Text>
              <Button
                type="link"
                size="small"
                style={{
                  color: "#FFD700",
                  padding: 0,
                  height: "auto",
                  fontSize: "12px",
                  fontWeight: "500",
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  marginTop: "4px",
                }}
              >
                Contact Support
              </Button>
            </div>
          </Sider>

          <Layout style={{ background: "#F8FAFC" }}>
            <Header
              style={{
                background: "#fff",
                padding: "0 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                borderBottom: "1px solid #E2E8F0",
                height: "72px",
              }}
            >
              {/* Left side - Page title */}
              <div>
                <Text
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#1E293B",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Sales CRM Dashboard
                </Text>
                <Text
                  style={{
                    color: "#64748B",
                    fontSize: "14px",
                    display: "block",
                    marginTop: "2px",
                  }}
                >
                  Manage your business relationships effectively
                </Text>
              </div>

              {/* Right side - Actions */}
              <Space size="large">
                {/* Notifications */}
                <Badge count={3} size="small">
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    size="large"
                    style={{
                      color: "#64748B",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      width: "40px",
                      height: "40px",
                    }}
                  />
                </Badge>

                {/* Settings */}
                <Link href={`/${locale}/settings`}>
                  <Button
                    type="text"
                    icon={<SettingOutlined />}
                    size="large"
                    style={{
                      color: "#64748B",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      width: "40px",
                      height: "40px",
                    }}
                  />
                </Link>

                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* User Profile */}
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Space style={{ cursor: "pointer" }}>
                    <Avatar
                      size={40}
                      style={{
                        background:
                          "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                        border: "2px solid #E2E8F0",
                      }}
                    >
                      SA
                    </Avatar>
                    <div style={{ textAlign: "left", lineHeight: "1.2" }}>
                      <Text
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#1E293B",
                          display: "block",
                        }}
                      >
                        Sales Admin
                      </Text>
                      <Text
                        style={{
                          fontSize: "12px",
                          color: "#64748B",
                          display: "block",
                        }}
                      >
                        admin@company.com
                      </Text>
                    </div>
                  </Space>
                </Dropdown>
              </Space>
            </Header>

            <Content
              style={{
                margin: "24px",
                background: "transparent",
                minHeight: "calc(100vh - 120px)",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "16px",
                  padding: "32px",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  border: "1px solid #E2E8F0",
                  minHeight: "calc(100vh - 168px)",
                }}
              >
                {children}
              </div>
            </Content>
          </Layout>
        </Layout>
      </StrictMode>
    </ConfigProvider>
  );
}
