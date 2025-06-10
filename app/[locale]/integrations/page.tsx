"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Typography,
  Badge,
  Avatar,
  Space,
  Tabs,
  Tag,
  Table,
  Modal,
  Form,
  Switch,
  Statistic,
  Progress,
  Divider,
  List,
  Alert,
  Tooltip,
} from "antd";
import {
  LinkOutlined,
  PlusOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  CodeOutlined,
  KeyOutlined,
  SecurityScanOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface Integration {
  id: string;
  name: string;
  description: string;
  type: "api" | "webhook" | "oauth" | "database";
  provider: string;
  status: "active" | "inactive" | "error" | "pending";
  endpoint: string;
  method: string;
  lastSync: string;
  syncFrequency: string;
  dataFlows: string[];
  authentication: {
    type: "bearer" | "basic" | "oauth2" | "api_key";
    isConfigured: boolean;
  };
  monitoring: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    totalRequests: number;
  };
  configuration: Record<string, any>;
}

interface APILog {
  id: string;
  integrationId: string;
  timestamp: string;
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  success: boolean;
  errorMessage?: string;
}

export default function IntegrationsPage() {
  const t = useTranslations("integrations");

  const [activeTab, setActiveTab] = useState("integrations");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [editingIntegration, setEditingIntegration] =
    useState<Integration | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(
    null
  );

  // Mock data
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Salesforce",
      description: "Sync customer data and deals with Salesforce CRM",
      type: "api",
      provider: "Salesforce",
      status: "active",
      endpoint: "https://api.salesforce.com/v1/crm",
      method: "POST",
      lastSync: "2024-01-23T14:30:00Z",
      syncFrequency: "Every 15 minutes",
      dataFlows: ["Contacts", "Deals", "Activities"],
      authentication: {
        type: "oauth2",
        isConfigured: true,
      },
      monitoring: {
        uptime: 99.8,
        responseTime: 245,
        errorRate: 0.2,
        totalRequests: 15847,
      },
      configuration: {
        clientId: "sf_client_123",
        environment: "production",
      },
    },
    {
      id: "2",
      name: "HubSpot",
      description: "Bidirectional sync with HubSpot marketing platform",
      type: "api",
      provider: "HubSpot",
      status: "active",
      endpoint: "https://api.hubapi.com/crm/v3",
      method: "GET",
      lastSync: "2024-01-23T14:25:00Z",
      syncFrequency: "Every 30 minutes",
      dataFlows: ["Leads", "Companies", "Email Campaigns"],
      authentication: {
        type: "api_key",
        isConfigured: true,
      },
      monitoring: {
        uptime: 98.5,
        responseTime: 180,
        errorRate: 1.5,
        totalRequests: 8934,
      },
      configuration: {
        apiKey: "hub_key_***",
        portalId: "12345678",
      },
    },
    {
      id: "3",
      name: "Stripe",
      description: "Payment processing and subscription management",
      type: "webhook",
      provider: "Stripe",
      status: "error",
      endpoint: "https://webhook.site/stripe-crm",
      method: "POST",
      lastSync: "2024-01-23T13:45:00Z",
      syncFrequency: "Real-time",
      dataFlows: ["Payments", "Subscriptions", "Customers"],
      authentication: {
        type: "bearer",
        isConfigured: false,
      },
      monitoring: {
        uptime: 95.2,
        responseTime: 320,
        errorRate: 4.8,
        totalRequests: 2456,
      },
      configuration: {
        webhookSecret: "whsec_***",
      },
    },
  ]);

  const [apiLogs, setApiLogs] = useState<APILog[]>([
    {
      id: "1",
      integrationId: "1",
      timestamp: "2024-01-23T14:30:15Z",
      method: "POST",
      endpoint: "/api/contacts/sync",
      statusCode: 200,
      responseTime: 245,
      success: true,
    },
    {
      id: "2",
      integrationId: "2",
      timestamp: "2024-01-23T14:25:30Z",
      method: "GET",
      endpoint: "/crm/v3/objects/contacts",
      statusCode: 201,
      responseTime: 180,
      success: true,
    },
    {
      id: "3",
      integrationId: "3",
      timestamp: "2024-01-23T08:15:45Z",
      method: "GET",
      endpoint: "/v1/customers",
      statusCode: 401,
      responseTime: 320,
      success: false,
      errorMessage: "Invalid API key",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "error":
        return "error";
      case "pending":
        return "processing";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api":
        return <CloudServerOutlined />;
      case "webhook":
        return <SyncOutlined />;
      case "oauth":
        return <SecurityScanOutlined />;
      case "database":
        return <DatabaseOutlined />;
      default:
        return <LinkOutlined />;
    }
  };

  const getAuthIcon = (authType: string) => {
    switch (authType) {
      case "bearer":
        return <KeyOutlined />;
      case "basic":
        return <SecurityScanOutlined />;
      case "oauth2":
        return <SecurityScanOutlined />;
      case "api_key":
        return <KeyOutlined />;
      default:
        return <KeyOutlined />;
    }
  };

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || integration.status === statusFilter;
    const matchesType = typeFilter === "all" || integration.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredLogs = selectedIntegration
    ? apiLogs.filter((log) => log.integrationId === selectedIntegration)
    : apiLogs;

  const integrationColumns = [
    {
      title: "Integration",
      key: "integration",
      render: (_: any, record: Integration) => (
        <div>
          <Space>
            {getTypeIcon(record.type)}
            <div>
              <Text strong>{record.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.description}
              </Text>
            </div>
          </Space>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={getStatusColor(status) as any}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag icon={getTypeIcon(type)}>{type.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Authentication",
      key: "auth",
      render: (_: any, record: Integration) => (
        <Space>
          {getAuthIcon(record.authentication.type)}
          <Text>{record.authentication.type}</Text>
          {record.authentication.isConfigured ? (
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
          )}
        </Space>
      ),
    },
    {
      title: "Uptime",
      key: "uptime",
      render: (_: any, record: Integration) => (
        <div>
          <Progress
            percent={record.monitoring.uptime}
            size="small"
            status={record.monitoring.uptime > 95 ? "success" : "exception"}
          />
          <Text style={{ fontSize: "12px" }}>{record.monitoring.uptime}%</Text>
        </div>
      ),
    },
    {
      title: "Last Sync",
      dataIndex: "lastSync",
      key: "lastSync",
      render: (lastSync: string) => (
        <Text style={{ fontSize: "12px" }}>
          {new Date(lastSync).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Integration) => (
        <Space>
          <Tooltip title="View Logs">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedIntegration(record.id);
                setActiveTab("logs");
              }}
            />
          </Tooltip>
          <Tooltip title="Configure">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => {
                setEditingIntegration(record);
                setShowIntegrationModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Test Connection">
            <Button type="text" icon={<SyncOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const logColumns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (timestamp: string) => (
        <Text style={{ fontSize: "12px" }}>
          {new Date(timestamp).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (method: string) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: "Endpoint",
      dataIndex: "endpoint",
      key: "endpoint",
      render: (endpoint: string) => (
        <Text code style={{ fontSize: "12px" }}>
          {endpoint}
        </Text>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_: any, record: APILog) => (
        <Badge
          status={record.success ? "success" : "error"}
          text={record.statusCode.toString()}
        />
      ),
    },
    {
      title: "Response Time",
      dataIndex: "responseTime",
      key: "responseTime",
      render: (responseTime: number) => <Text>{responseTime}ms</Text>,
    },
    {
      title: "Error",
      dataIndex: "errorMessage",
      key: "errorMessage",
      render: (error: string) =>
        error ? (
          <Tooltip title={error}>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
          </Tooltip>
        ) : (
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
        ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title
              level={1}
              style={{
                color: "white",
                margin: 0,
                fontSize: "32px",
                fontWeight: "700",
              }}
            >
              🔗 API Integrations
            </Title>
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "16px",
                display: "block",
                marginTop: "8px",
              }}
            >
              Manage third-party connections and data synchronization
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(10px)",
            }}
            onClick={() => setShowIntegrationModal(true)}
          >
            Add Integration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Statistic
              title="Total Integrations"
              value={integrations.length}
              prefix={<LinkOutlined style={{ color: "#4F46E5" }} />}
              valueStyle={{ color: "#1e293b", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Statistic
              title="Active"
              value={integrations.filter((i) => i.status === "active").length}
              prefix={<CheckCircleOutlined style={{ color: "#10B981" }} />}
              valueStyle={{ color: "#1e293b", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Statistic
              title="Avg Uptime"
              value={
                integrations.reduce((sum, i) => sum + i.monitoring.uptime, 0) /
                integrations.length
              }
              precision={1}
              suffix="%"
              prefix={<ThunderboltOutlined style={{ color: "#F59E0B" }} />}
              valueStyle={{ color: "#1e293b", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Statistic
              title="Total Requests"
              value={integrations.reduce(
                (sum, i) => sum + i.monitoring.totalRequests,
                0
              )}
              prefix={<BarChartOutlined style={{ color: "#EF4444" }} />}
              valueStyle={{ color: "#1e293b", fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card
        style={{
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Integrations" key="integrations">
            {/* Filters */}
            <div style={{ marginBottom: "24px" }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={8}>
                  <Search
                    placeholder="Search integrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%" }}
                    size="large"
                  />
                </Col>
                <Col xs={24} sm={4}>
                  <Select
                    value={statusFilter}
                    onChange={setStatusFilter}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Status"
                  >
                    <Option value="all">All Status</Option>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                    <Option value="error">Error</Option>
                    <Option value="pending">Pending</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={4}>
                  <Select
                    value={typeFilter}
                    onChange={setTypeFilter}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Type"
                  >
                    <Option value="all">All Types</Option>
                    <Option value="api">API</Option>
                    <Option value="webhook">Webhook</Option>
                    <Option value="oauth">OAuth</Option>
                    <Option value="database">Database</Option>
                  </Select>
                </Col>
              </Row>
            </div>

            {/* Integrations Table */}
            <Table
              columns={integrationColumns}
              dataSource={filteredIntegrations}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </TabPane>

          <TabPane tab="API Logs" key="logs">
            <div style={{ marginBottom: "16px" }}>
              <Alert
                message="API Activity Monitoring"
                description="Real-time monitoring of all API requests and responses across your integrations."
                type="info"
                showIcon
              />
            </div>

            <Table
              columns={logColumns}
              dataSource={filteredLogs}
              rowKey="id"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
