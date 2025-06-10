"use client";

import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Table,
  Space,
  Modal,
  message,
  Divider,
  Upload,
  Typography,
  Row,
  Col,
  Tag,
  Avatar,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  MailOutlined,
  DownloadOutlined,
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  TeamOutlined,
  SecurityScanOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useTranslations } from "next-intl";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

export default function SettingsPage() {
  const t = useTranslations("settings");
  const [activeTab, setActiveTab] = useState("general");
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Sample data
  const users = [
    {
      id: 1,
      name: "Sarah Wilson",
      email: "sarah@company.com",
      role: "Admin",
      status: "Active",
      department: "Sales",
      lastLogin: "2024-01-15 10:30",
    },
    {
      id: 2,
      name: "Mike Johnson",
      email: "mike@company.com",
      role: "Sales Manager",
      status: "Active",
      department: "Sales",
      lastLogin: "2024-01-15 09:15",
    },
    {
      id: 3,
      name: "John Smith",
      email: "john@company.com",
      role: "Support Agent",
      status: "Inactive",
      department: "Support",
      lastLogin: "2024-01-14 16:45",
    },
  ];

  const emailTemplates = [
    {
      id: 1,
      name: "Welcome Email",
      subject: "Welcome to our service",
      type: "Customer Onboarding",
      status: "Active",
      lastModified: "2024-01-15",
    },
    {
      id: 2,
      name: "Follow Up",
      subject: "Following up on your inquiry",
      type: "Lead Nurturing",
      status: "Active",
      lastModified: "2024-01-14",
    },
    {
      id: 3,
      name: "Support Response",
      subject: "We've received your support request",
      type: "Support",
      status: "Draft",
      lastModified: "2024-01-13",
    },
  ];

  const userColumns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar size={40} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag
          color={
            role === "Admin"
              ? "red"
              : role === "Sales Manager"
              ? "blue"
              : "green"
          }
        >
          {role}
        </Tag>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedUser(record);
              setUserModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => message.success("User deleted successfully")}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const templateColumns = [
    {
      title: "Template Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.subject}
          </Text>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Active" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Last Modified",
      dataIndex: "lastModified",
      key: "lastModified",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTemplate(record);
              setTemplateModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this template?"
            onConfirm={() => message.success("Template deleted successfully")}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleExportData = (type: string) => {
    message.success(`${type} data exported successfully`);
  };

  const handleImportData = (type: string) => {
    message.success(`${type} data imported successfully`);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <Title level={2} style={{ marginBottom: "8px" }}>
          Settings
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Manage your CRM system configuration, users, and preferences
        </Text>
      </div>

      <Card style={{ borderRadius: "12px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: "general",
              label: (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <SettingOutlined />
                  General Settings
                </span>
              ),
              children: (
                <div style={{ maxWidth: "600px" }}>
                  <Title level={4} style={{ marginBottom: "24px" }}>
                    System Configuration
                  </Title>
                  <Form layout="vertical">
                    <Row gutter={[24, 0]}>
                      <Col span={12}>
                        <Form.Item label="Company Name">
                          <Input
                            placeholder="Your Company Name"
                            defaultValue="Acme Corporation"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Time Zone">
                          <Select
                            defaultValue="utc+7"
                            placeholder="Select timezone"
                          >
                            <Select.Option value="utc+7">
                              UTC+7 (Bangkok)
                            </Select.Option>
                            <Select.Option value="utc+0">
                              UTC+0 (London)
                            </Select.Option>
                            <Select.Option value="utc-5">
                              UTC-5 (New York)
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={[24, 0]}>
                      <Col span={12}>
                        <Form.Item label="Default Currency">
                          <Select
                            defaultValue="usd"
                            placeholder="Select currency"
                          >
                            <Select.Option value="usd">USD ($)</Select.Option>
                            <Select.Option value="thb">THB (฿)</Select.Option>
                            <Select.Option value="eur">EUR (€)</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Date Format">
                          <Select
                            defaultValue="dd/mm/yyyy"
                            placeholder="Select date format"
                          >
                            <Select.Option value="dd/mm/yyyy">
                              DD/MM/YYYY
                            </Select.Option>
                            <Select.Option value="mm/dd/yyyy">
                              MM/DD/YYYY
                            </Select.Option>
                            <Select.Option value="yyyy-mm-dd">
                              YYYY-MM-DD
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Divider />

                    <Title level={5} style={{ marginBottom: "16px" }}>
                      Email Settings
                    </Title>
                    <Form.Item label="SMTP Server">
                      <Input
                        placeholder="smtp.gmail.com"
                        defaultValue="smtp.company.com"
                      />
                    </Form.Item>
                    <Row gutter={[24, 0]}>
                      <Col span={12}>
                        <Form.Item label="Port">
                          <Input placeholder="587" defaultValue="587" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Security">
                          <Select
                            defaultValue="tls"
                            placeholder="Select security"
                          >
                            <Select.Option value="tls">TLS</Select.Option>
                            <Select.Option value="ssl">SSL</Select.Option>
                            <Select.Option value="none">None</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Divider />

                    <Title level={5} style={{ marginBottom: "16px" }}>
                      Notification Preferences
                    </Title>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text style={{ fontWeight: 500 }}>
                            Email Notifications
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Receive email notifications for important events
                          </Text>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text style={{ fontWeight: 500 }}>
                            Browser Notifications
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Show browser push notifications
                          </Text>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text style={{ fontWeight: 500 }}>
                            SMS Notifications
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Send SMS for critical alerts
                          </Text>
                        </div>
                        <Switch />
                      </div>
                    </Space>

                    <Divider />

                    <Button
                      type="primary"
                      size="large"
                      style={{ marginTop: "16px" }}
                    >
                      Save Settings
                    </Button>
                  </Form>
                </div>
              ),
            },
            {
              key: "users",
              label: (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <TeamOutlined />
                  User Management
                </span>
              ),
              children: (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "24px",
                    }}
                  >
                    <div>
                      <Title level={4} style={{ marginBottom: "8px" }}>
                        Team Members
                      </Title>
                      <Text type="secondary">
                        Manage user accounts, roles and permissions
                      </Text>
                    </div>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setSelectedUser(null);
                        setUserModalVisible(true);
                      }}
                    >
                      Add User
                    </Button>
                  </div>

                  <Table
                    columns={userColumns}
                    dataSource={users}
                    rowKey="id"
                    pagination={false}
                  />
                </div>
              ),
            },
            {
              key: "templates",
              label: (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <MailOutlined />
                  Email Templates
                </span>
              ),
              children: (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "24px",
                    }}
                  >
                    <div>
                      <Title level={4} style={{ marginBottom: "8px" }}>
                        Email Templates
                      </Title>
                      <Text type="secondary">
                        Manage automated email templates for your workflows
                      </Text>
                    </div>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => {
                        setSelectedTemplate(null);
                        setTemplateModalVisible(true);
                      }}
                    >
                      Create Template
                    </Button>
                  </div>

                  <Table
                    columns={templateColumns}
                    dataSource={emailTemplates}
                    rowKey="id"
                    pagination={false}
                  />
                </div>
              ),
            },
            {
              key: "import-export",
              label: (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <ExportOutlined />
                  Data Management
                </span>
              ),
              children: (
                <div>
                  <Title level={4} style={{ marginBottom: "24px" }}>
                    Import & Export Data
                  </Title>

                  <Row gutter={[24, 24]}>
                    <Col span={12}>
                      <Card
                        title={
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <ExportOutlined />
                            Export Data
                          </span>
                        }
                        style={{ height: "100%" }}
                      >
                        <Paragraph
                          type="secondary"
                          style={{ marginBottom: "20px" }}
                        >
                          Export your CRM data in various formats for backup or
                          migration purposes.
                        </Paragraph>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Button
                            block
                            icon={<DownloadOutlined />}
                            onClick={() => handleExportData("Customers")}
                          >
                            Export Customers (CSV)
                          </Button>
                          <Button
                            block
                            icon={<DownloadOutlined />}
                            onClick={() => handleExportData("Leads")}
                          >
                            Export Leads (CSV)
                          </Button>
                          <Button
                            block
                            icon={<DownloadOutlined />}
                            onClick={() => handleExportData("Tickets")}
                          >
                            Export Support Tickets (CSV)
                          </Button>
                          <Button
                            block
                            icon={<DownloadOutlined />}
                            onClick={() => handleExportData("Full Database")}
                          >
                            Export Full Database (JSON)
                          </Button>
                        </Space>
                      </Card>
                    </Col>

                    <Col span={12}>
                      <Card
                        title={
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <ImportOutlined />
                            Import Data
                          </span>
                        }
                        style={{ height: "100%" }}
                      >
                        <Paragraph
                          type="secondary"
                          style={{ marginBottom: "20px" }}
                        >
                          Import data from CSV or JSON files. Make sure your
                          data follows our template format.
                        </Paragraph>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          <Upload
                            accept=".csv"
                            showUploadList={false}
                            customRequest={() => handleImportData("Customers")}
                          >
                            <Button block icon={<UploadOutlined />}>
                              Import Customers (CSV)
                            </Button>
                          </Upload>
                          <Upload
                            accept=".csv"
                            showUploadList={false}
                            customRequest={() => handleImportData("Leads")}
                          >
                            <Button block icon={<UploadOutlined />}>
                              Import Leads (CSV)
                            </Button>
                          </Upload>
                          <Upload
                            accept=".csv"
                            showUploadList={false}
                            customRequest={() => handleImportData("Tickets")}
                          >
                            <Button block icon={<UploadOutlined />}>
                              Import Support Tickets (CSV)
                            </Button>
                          </Upload>
                          <Upload
                            accept=".json"
                            showUploadList={false}
                            customRequest={() => handleImportData("Database")}
                          >
                            <Button block icon={<UploadOutlined />}>
                              Import Database (JSON)
                            </Button>
                          </Upload>
                        </Space>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              key: "security",
              label: (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <SecurityScanOutlined />
                  Security
                </span>
              ),
              children: (
                <div style={{ maxWidth: "600px" }}>
                  <Title level={4} style={{ marginBottom: "24px" }}>
                    Security Settings
                  </Title>

                  <Form layout="vertical">
                    <Title level={5} style={{ marginBottom: "16px" }}>
                      Password Policy
                    </Title>
                    <Row gutter={[24, 0]}>
                      <Col span={12}>
                        <Form.Item label="Minimum Password Length">
                          <Select defaultValue="8" placeholder="Select length">
                            <Select.Option value="6">
                              6 characters
                            </Select.Option>
                            <Select.Option value="8">
                              8 characters
                            </Select.Option>
                            <Select.Option value="12">
                              12 characters
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="Password Expiry (days)">
                          <Select defaultValue="90" placeholder="Select expiry">
                            <Select.Option value="30">30 days</Select.Option>
                            <Select.Option value="60">60 days</Select.Option>
                            <Select.Option value="90">90 days</Select.Option>
                            <Select.Option value="never">Never</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Space
                      direction="vertical"
                      style={{ width: "100%", marginBottom: "24px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text style={{ fontWeight: 500 }}>
                            Require Special Characters
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Passwords must contain special characters
                          </Text>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text style={{ fontWeight: 500 }}>
                            Two-Factor Authentication
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Require 2FA for all users
                          </Text>
                        </div>
                        <Switch />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text style={{ fontWeight: 500 }}>
                            Session Timeout
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Auto-logout after inactivity
                          </Text>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </Space>

                    <Divider />

                    <Title level={5} style={{ marginBottom: "16px" }}>
                      Data Access
                    </Title>
                    <Form.Item label="Default User Role">
                      <Select
                        defaultValue="viewer"
                        placeholder="Select default role"
                      >
                        <Select.Option value="admin">Admin</Select.Option>
                        <Select.Option value="manager">Manager</Select.Option>
                        <Select.Option value="user">User</Select.Option>
                        <Select.Option value="viewer">Viewer</Select.Option>
                      </Select>
                    </Form.Item>

                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text style={{ fontWeight: 500 }}>Audit Trail</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Log all user actions and data changes
                          </Text>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text style={{ fontWeight: 500 }}>
                            IP Restrictions
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Restrict access to specific IP addresses
                          </Text>
                        </div>
                        <Switch />
                      </div>
                    </Space>

                    <Divider />

                    <Button
                      type="primary"
                      size="large"
                      style={{ marginTop: "16px" }}
                    >
                      Save Security Settings
                    </Button>
                  </Form>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* User Modal */}
      <Modal
        title={selectedUser ? "Edit User" : "Add New User"}
        open={userModalVisible}
        onCancel={() => {
          setUserModalVisible(false);
          setSelectedUser(null);
        }}
        footer={null}
        width={600}
      >
        <Form layout="vertical" style={{ marginTop: "24px" }}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Full Name" rules={[{ required: true }]}>
                <Input
                  placeholder="Enter full name"
                  defaultValue={selectedUser?.name}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email Address" rules={[{ required: true }]}>
                <Input
                  placeholder="Enter email"
                  defaultValue={selectedUser?.email}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Role" rules={[{ required: true }]}>
                <Select
                  placeholder="Select role"
                  defaultValue={selectedUser?.role}
                >
                  <Select.Option value="Admin">Admin</Select.Option>
                  <Select.Option value="Sales Manager">
                    Sales Manager
                  </Select.Option>
                  <Select.Option value="Support Agent">
                    Support Agent
                  </Select.Option>
                  <Select.Option value="Viewer">Viewer</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Department" rules={[{ required: true }]}>
                <Select
                  placeholder="Select department"
                  defaultValue={selectedUser?.department}
                >
                  <Select.Option value="Sales">Sales</Select.Option>
                  <Select.Option value="Support">Support</Select.Option>
                  <Select.Option value="Marketing">Marketing</Select.Option>
                  <Select.Option value="Management">Management</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Phone Number">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item label="Status">
            <Select
              placeholder="Select status"
              defaultValue={selectedUser?.status || "Active"}
            >
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
              <Select.Option value="Pending">Pending</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ textAlign: "right", marginTop: "24px" }}>
            <Space>
              <Button onClick={() => setUserModalVisible(false)}>Cancel</Button>
              <Button
                type="primary"
                onClick={() => {
                  message.success(
                    selectedUser
                      ? "User updated successfully"
                      : "User created successfully"
                  );
                  setUserModalVisible(false);
                  setSelectedUser(null);
                }}
              >
                {selectedUser ? "Update User" : "Create User"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Email Template Modal */}
      <Modal
        title={
          selectedTemplate ? "Edit Email Template" : "Create Email Template"
        }
        open={templateModalVisible}
        onCancel={() => {
          setTemplateModalVisible(false);
          setSelectedTemplate(null);
        }}
        footer={null}
        width={800}
      >
        <Form layout="vertical" style={{ marginTop: "24px" }}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Template Name" rules={[{ required: true }]}>
                <Input
                  placeholder="Enter template name"
                  defaultValue={selectedTemplate?.name}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Template Type" rules={[{ required: true }]}>
                <Select
                  placeholder="Select type"
                  defaultValue={selectedTemplate?.type}
                >
                  <Select.Option value="Customer Onboarding">
                    Customer Onboarding
                  </Select.Option>
                  <Select.Option value="Lead Nurturing">
                    Lead Nurturing
                  </Select.Option>
                  <Select.Option value="Support">Support</Select.Option>
                  <Select.Option value="Marketing">Marketing</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Email Subject" rules={[{ required: true }]}>
            <Input
              placeholder="Enter email subject"
              defaultValue={selectedTemplate?.subject}
            />
          </Form.Item>
          <Form.Item label="Email Content" rules={[{ required: true }]}>
            <TextArea
              rows={8}
              placeholder="Enter email content with placeholders like {{customer_name}}, {{company_name}}"
              defaultValue={`Hello {{customer_name}},

Thank you for your interest in our services. We're excited to work with you!

Best regards,
{{sender_name}}
{{company_name}}`}
            />
          </Form.Item>
          <Form.Item label="Status">
            <Select
              placeholder="Select status"
              defaultValue={selectedTemplate?.status || "Draft"}
            >
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Archived">Archived</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ textAlign: "right", marginTop: "24px" }}>
            <Space>
              <Button onClick={() => setTemplateModalVisible(false)}>
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  message.success(
                    selectedTemplate
                      ? "Template updated successfully"
                      : "Template created successfully"
                  );
                  setTemplateModalVisible(false);
                  setSelectedTemplate(null);
                }}
              >
                {selectedTemplate ? "Update Template" : "Create Template"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
