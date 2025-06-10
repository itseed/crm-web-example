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
  Timeline,
  DatePicker,
  Descriptions,
} from "antd";
import {
  SecurityScanOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  UserOutlined,
  SettingOutlined,
  DatabaseOutlined,
  MailOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  FileSearchOutlined,
  MonitorOutlined,
  TeamOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  BugOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  LockOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  category: "security" | "data" | "user" | "system" | "communication";
  resource: string;
  resourceId?: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  severity: "low" | "medium" | "high" | "critical";
  result: "success" | "failure" | "warning";
  metadata?: Record<string, any>;
  location?: string;
}

interface AuditSummary {
  totalEvents: number;
  securityEvents: number;
  dataEvents: number;
  userEvents: number;
  systemEvents: number;
  failedAttempts: number;
  highSeverityEvents: number;
}

export default function AuditLogsPage() {
  const t = useTranslations("auditLogs");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedResult, setSelectedResult] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const logsPerPage = 20;

  // Mock data - same as original but kept for consistency
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2024-01-23T10:30:00Z",
      userId: "user-123",
      userName: "Sarah Johnson",
      action: "LOGIN",
      category: "security",
      resource: "Authentication System",
      description: "User logged in successfully",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "low",
      result: "success",
      location: "New York, NY",
      metadata: {
        sessionId: "sess_abc123",
        loginMethod: "password",
      },
    },
    {
      id: "2",
      timestamp: "2024-01-23T10:25:00Z",
      userId: "user-456",
      userName: "Mike Chen",
      action: "CREATE_CUSTOMER",
      category: "data",
      resource: "Customer Record",
      resourceId: "cust-789",
      description: "Created new customer record for Acme Corp",
      ipAddress: "192.168.1.101",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      severity: "medium",
      result: "success",
      location: "San Francisco, CA",
      metadata: {
        customerName: "Acme Corp",
        customerType: "Enterprise",
      },
    },
    {
      id: "3",
      timestamp: "2024-01-23T10:20:00Z",
      userId: "user-789",
      userName: "David Wilson",
      action: "FAILED_LOGIN",
      category: "security",
      resource: "Authentication System",
      description: "Failed login attempt - incorrect password",
      ipAddress: "203.0.113.42",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      severity: "high",
      result: "failure",
      location: "Unknown",
      metadata: {
        attemptCount: 3,
        accountLocked: false,
      },
    },
    {
      id: "4",
      timestamp: "2024-01-23T10:15:00Z",
      userId: "system",
      userName: "System",
      action: "DATA_BACKUP",
      category: "system",
      resource: "Database",
      description: "Automated daily backup completed successfully",
      ipAddress: "127.0.0.1",
      userAgent: "System/1.0",
      severity: "low",
      result: "success",
      metadata: {
        backupSize: "2.4GB",
        duration: "5m 32s",
      },
    },
    {
      id: "5",
      timestamp: "2024-01-23T10:10:00Z",
      userId: "user-123",
      userName: "Sarah Johnson",
      action: "UPDATE_USER_PERMISSIONS",
      category: "user",
      resource: "User Management",
      resourceId: "user-456",
      description: "Updated permissions for Mike Chen - added Admin role",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "medium",
      result: "success",
      location: "New York, NY",
      metadata: {
        addedRoles: ["Admin"],
        removedRoles: [],
        targetUser: "Mike Chen",
      },
    },
    {
      id: "6",
      timestamp: "2024-01-23T10:05:00Z",
      userId: "user-456",
      userName: "Mike Chen",
      action: "DELETE_LEAD",
      category: "data",
      resource: "Lead Record",
      resourceId: "lead-123",
      description: "Deleted lead record for obsolete prospect",
      ipAddress: "192.168.1.101",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      severity: "high",
      result: "success",
      location: "San Francisco, CA",
      metadata: {
        leadName: "John Doe - TechCorp",
        reason: "Duplicate entry",
      },
    },
    {
      id: "7",
      timestamp: "2024-01-23T09:55:00Z",
      userId: "user-789",
      userName: "David Wilson",
      action: "EXPORT_DATA",
      category: "data",
      resource: "Customer Database",
      description: "Exported customer data for quarterly report",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "medium",
      result: "success",
      location: "Chicago, IL",
      metadata: {
        exportFormat: "CSV",
        recordCount: 1523,
        fileSize: "890KB",
      },
    },
    {
      id: "8",
      timestamp: "2024-01-23T09:50:00Z",
      userId: "user-123",
      userName: "Sarah Johnson",
      action: "SEND_EMAIL_CAMPAIGN",
      category: "communication",
      resource: "Email Marketing",
      resourceId: "campaign-456",
      description: 'Launched email campaign "Q1 Product Updates"',
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "low",
      result: "success",
      location: "New York, NY",
      metadata: {
        campaignName: "Q1 Product Updates",
        recipientCount: 2450,
        segmentation: "Active Customers",
      },
    },
  ]);

  const auditSummary: AuditSummary = {
    totalEvents: auditLogs.length,
    securityEvents: auditLogs.filter((log) => log.category === "security")
      .length,
    dataEvents: auditLogs.filter((log) => log.category === "data").length,
    userEvents: auditLogs.filter((log) => log.category === "user").length,
    systemEvents: auditLogs.filter((log) => log.category === "system").length,
    failedAttempts: auditLogs.filter((log) => log.result === "failure").length,
    highSeverityEvents: auditLogs.filter(
      (log) => log.severity === "high" || log.severity === "critical"
    ).length,
  };

  const uniqueUsers = Array.from(new Set(auditLogs.map((log) => log.userName)));

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || log.category === selectedCategory;
    const matchesSeverity =
      selectedSeverity === "all" || log.severity === selectedSeverity;
    const matchesResult =
      selectedResult === "all" || log.result === selectedResult;
    const matchesUser = selectedUser === "all" || log.userName === selectedUser;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSeverity &&
      matchesResult &&
      matchesUser
    );
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "security":
        return <SecurityScanOutlined style={{ color: "#ff4d4f" }} />;
      case "data":
        return <DatabaseOutlined style={{ color: "#1890ff" }} />;
      case "user":
        return <UserOutlined style={{ color: "#52c41a" }} />;
      case "system":
        return <SettingOutlined style={{ color: "#722ed1" }} />;
      case "communication":
        return <MailOutlined style={{ color: "#fa8c16" }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "success":
        return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
      case "failure":
        return <CloseCircleOutlined style={{ color: "#ff4d4f" }} />;
      case "warning":
        return <WarningOutlined style={{ color: "#fa8c16" }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "success";
      case "medium":
        return "warning";
      case "high":
        return "error";
      case "critical":
        return "error";
      default:
        return "default";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "security":
        return "red";
      case "data":
        return "blue";
      case "user":
        return "green";
      case "system":
        return "purple";
      case "communication":
        return "orange";
      default:
        return "default";
    }
  };

  const exportLogs = () => {
    const csv = [
      [
        "Timestamp",
        "User",
        "Action",
        "Category",
        "Resource",
        "Severity",
        "Result",
        "IP Address",
        "Description",
      ],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.userName,
        log.action,
        log.category,
        log.resource,
        log.severity,
        log.result,
        log.ipAddress,
        log.description,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      width: 180,
      render: (timestamp: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
          <Text style={{ fontSize: "12px" }}>
            {new Date(timestamp).toLocaleString()}
          </Text>
        </Space>
      ),
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
      width: 150,
      render: (userName: string, record: AuditLog) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text strong>{userName}</Text>
        </Space>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (action: string) => (
        <Tag
          color="geekblue"
          style={{ fontFamily: "monospace", fontSize: "11px" }}
        >
          {action}
        </Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: string) => (
        <Space>
          {getCategoryIcon(category)}
          <Tag color={getCategoryColor(category)}>{category}</Tag>
        </Space>
      ),
    },
    {
      title: "Resource",
      dataIndex: "resource",
      key: "resource",
      width: 150,
      render: (resource: string) => <Text>{resource}</Text>,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      width: 100,
      render: (severity: string) => (
        <Badge
          status={getSeverityColor(severity) as any}
          text={severity.toUpperCase()}
        />
      ),
    },
    {
      title: "Result",
      dataIndex: "result",
      key: "result",
      width: 100,
      render: (result: string) => (
        <Space>
          {getResultIcon(result)}
          <Text>{result}</Text>
        </Space>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 130,
      render: (ipAddress: string) => (
        <Text code style={{ fontSize: "11px" }}>
          {ipAddress}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record: AuditLog) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => setSelectedLog(record)}
          size="small"
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      {/* Modern Gradient Header */}
      <Card
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "16px",
          marginBottom: "24px",
        }}
        bodyStyle={{ padding: "32px" }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Space size="large" align="center">
              <div
                style={{
                  fontSize: "48px",
                  lineHeight: 1,
                }}
              >
                🛡️
              </div>
              <div>
                <Title
                  level={1}
                  style={{
                    color: "white",
                    margin: 0,
                    fontSize: "32px",
                    fontWeight: 700,
                  }}
                >
                  Audit Logs
                </Title>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    fontSize: "16px",
                    marginTop: "8px",
                    display: "block",
                  }}
                >
                  Monitor and track all system activities and security events
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                size="large"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: "white",
                }}
              >
                Filters
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={exportLogs}
                size="large"
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                }}
              >
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Statistic
              title="Total Events"
              value={auditSummary.totalEvents}
              prefix={<InfoCircleOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Statistic
              title="Security Events"
              value={auditSummary.securityEvents}
              prefix={<SecurityScanOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Statistic
              title="Data Events"
              value={auditSummary.dataEvents}
              prefix={<DatabaseOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Statistic
              title="User Events"
              value={auditSummary.userEvents}
              prefix={<UserOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Statistic
              title="System Events"
              value={auditSummary.systemEvents}
              prefix={<SettingOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Statistic
              title="Failed Attempts"
              value={auditSummary.failedAttempts}
              prefix={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f", fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters Panel */}
      {showFilters && (
        <Card
          style={{
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid #f0f0f0",
          }}
          title="Filters"
          extra={
            <Button
              type="link"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedSeverity("all");
                setSelectedResult("all");
                setSelectedUser("all");
              }}
            >
              Clear All
            </Button>
          }
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text strong style={{ marginBottom: "8px", display: "block" }}>
                  Search
                </Text>
                <Input
                  placeholder="Search logs..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text strong style={{ marginBottom: "8px", display: "block" }}>
                  Category
                </Text>
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  style={{ width: "100%" }}
                >
                  <Option value="all">All Categories</Option>
                  <Option value="security">Security</Option>
                  <Option value="data">Data</Option>
                  <Option value="user">User</Option>
                  <Option value="system">System</Option>
                  <Option value="communication">Communication</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text strong style={{ marginBottom: "8px", display: "block" }}>
                  Severity
                </Text>
                <Select
                  value={selectedSeverity}
                  onChange={setSelectedSeverity}
                  style={{ width: "100%" }}
                >
                  <Option value="all">All Severities</Option>
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="critical">Critical</Option>
                </Select>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text strong style={{ marginBottom: "8px", display: "block" }}>
                  Result
                </Text>
                <Select
                  value={selectedResult}
                  onChange={setSelectedResult}
                  style={{ width: "100%" }}
                >
                  <Option value="all">All Results</Option>
                  <Option value="success">Success</Option>
                  <Option value="failure">Failure</Option>
                  <Option value="warning">Warning</Option>
                </Select>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Audit Logs Table */}
      <Card
        title={
          <Space>
            <SecurityScanOutlined />
            <span>Audit Logs ({filteredLogs.length} entries)</span>
          </Space>
        }
        style={{
          borderRadius: "12px",
          border: "1px solid #f0f0f0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: logsPerPage,
            total: filteredLogs.length,
            onChange: setCurrentPage,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 1200 }}
          style={{ marginTop: "16px" }}
        />
      </Card>

      {/* Log Detail Modal */}
      <Modal
        title={
          <Space>
            <FileSearchOutlined />
            <span>Audit Log Details</span>
          </Space>
        }
        open={!!selectedLog}
        onCancel={() => setSelectedLog(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedLog(null)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedLog && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: "24px" }}>
              <Descriptions.Item label="Timestamp" span={2}>
                <Space>
                  <ClockCircleOutlined />
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="User">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {selectedLog.userName}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="User ID">
                <Text code>{selectedLog.userId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Action">
                <Tag color="geekblue">{selectedLog.action}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                <Space>
                  {getCategoryIcon(selectedLog.category)}
                  <Tag color={getCategoryColor(selectedLog.category)}>
                    {selectedLog.category}
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Resource" span={2}>
                {selectedLog.resource}
                {selectedLog.resourceId && (
                  <Text code style={{ marginLeft: "8px" }}>
                    ({selectedLog.resourceId})
                  </Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Badge
                  status={getSeverityColor(selectedLog.severity) as any}
                  text={selectedLog.severity.toUpperCase()}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Result">
                <Space>
                  {getResultIcon(selectedLog.result)}
                  {selectedLog.result}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="IP Address">
                <Space>
                  <GlobalOutlined />
                  <Text code>{selectedLog.ipAddress}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedLog.location || "Unknown"}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {selectedLog.description}
              </Descriptions.Item>
              <Descriptions.Item label="User Agent" span={2}>
                <Text
                  code
                  style={{
                    fontSize: "11px",
                    wordBreak: "break-all",
                  }}
                >
                  {selectedLog.userAgent}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            {/* Metadata */}
            {selectedLog.metadata &&
              Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <Title level={5}>Additional Information</Title>
                  <Card size="small" style={{ background: "#fafafa" }}>
                    <pre
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        lineHeight: "1.4",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </Card>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}
