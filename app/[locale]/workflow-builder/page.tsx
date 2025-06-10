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
} from "antd";
import {
  BranchesOutlined,
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ArrowRightOutlined,
  FilterOutlined,
  CodeOutlined,
  SendOutlined,
  BarChartOutlined,
  EyeOutlined,
  SyncOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action" | "delay";
  name: string;
  description: string;
  configuration: Record<string, any>;
  position: { x: number; y: number };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive" | "draft";
  trigger: string;
  nodes: WorkflowNode[];
  executions: {
    total: number;
    successful: number;
    failed: number;
    lastExecution: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: "completed" | "running" | "failed" | "cancelled";
  startTime: string;
  endTime?: string;
  duration?: number;
  trigger: string;
  steps: {
    stepId: string;
    stepName: string;
    status: "completed" | "running" | "failed" | "skipped";
    startTime: string;
    endTime?: string;
    result?: any;
    error?: string;
  }[];
}

export default function WorkflowBuilderPage() {
  const t = useTranslations("workflows");

  const [activeTab, setActiveTab] = useState("workflows");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [viewingExecution, setViewingExecution] =
    useState<WorkflowExecution | null>(null);

  // Mock data
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "New Lead Welcome Sequence",
      description: "Automated welcome email sequence for new leads",
      category: "Lead Management",
      status: "active",
      trigger: "New lead created",
      nodes: [
        {
          id: "trigger-1",
          type: "trigger",
          name: "New Lead Created",
          description: "Triggers when a new lead is added to the system",
          configuration: { source: "form_submission" },
          position: { x: 100, y: 100 },
        },
        {
          id: "action-1",
          type: "action",
          name: "Send Welcome Email",
          description: "Send personalized welcome email",
          configuration: { template: "welcome_template", delay: 0 },
          position: { x: 300, y: 100 },
        },
        {
          id: "delay-1",
          type: "delay",
          name: "Wait 2 Days",
          description: "Wait 2 days before next action",
          configuration: { duration: 48, unit: "hours" },
          position: { x: 500, y: 100 },
        },
      ],
      executions: {
        total: 342,
        successful: 335,
        failed: 7,
        lastExecution: "2024-01-23T14:30:00Z",
      },
      createdAt: "2024-01-10T09:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
      createdBy: "Sarah Johnson",
    },
    {
      id: "2",
      name: "Deal Stage Progression",
      description: "Notify team when deals move to specific stages",
      category: "Sales",
      status: "active",
      trigger: "Deal stage changed",
      nodes: [
        {
          id: "trigger-2",
          type: "trigger",
          name: "Deal Stage Changed",
          description: "Triggers when deal moves to closing stage",
          configuration: { stage: "closing" },
          position: { x: 100, y: 100 },
        },
        {
          id: "condition-1",
          type: "condition",
          name: "Deal Value Check",
          description: "Check if deal value exceeds threshold",
          configuration: {
            field: "value",
            operator: "greater_than",
            value: 10000,
          },
          position: { x: 300, y: 100 },
        },
      ],
      executions: {
        total: 156,
        successful: 151,
        failed: 5,
        lastExecution: "2024-01-23T13:45:00Z",
      },
      createdAt: "2024-01-08T14:20:00Z",
      updatedAt: "2024-01-22T10:15:00Z",
      createdBy: "Mike Chen",
    },
    {
      id: "3",
      name: "Customer Onboarding",
      description: "Complete onboarding process for new customers",
      category: "Customer Success",
      status: "draft",
      trigger: "Customer created",
      nodes: [],
      executions: {
        total: 0,
        successful: 0,
        failed: 0,
        lastExecution: "",
      },
      createdAt: "2024-01-22T16:45:00Z",
      updatedAt: "2024-01-23T09:30:00Z",
      createdBy: "Lisa Wang",
    },
  ]);

  const [executions, setExecutions] = useState<WorkflowExecution[]>([
    {
      id: "1",
      workflowId: "1",
      workflowName: "New Lead Welcome Sequence",
      status: "completed",
      startTime: "2024-01-23T14:30:00Z",
      endTime: "2024-01-23T14:31:15Z",
      duration: 75,
      trigger: "Lead created: John Doe",
      steps: [
        {
          stepId: "trigger-1",
          stepName: "New Lead Created",
          status: "completed",
          startTime: "2024-01-23T14:30:00Z",
          endTime: "2024-01-23T14:30:02Z",
        },
        {
          stepId: "action-1",
          stepName: "Send Welcome Email",
          status: "completed",
          startTime: "2024-01-23T14:30:02Z",
          endTime: "2024-01-23T14:31:15Z",
          result: { emailSent: true, recipient: "john@example.com" },
        },
      ],
    },
    {
      id: "2",
      workflowId: "2",
      workflowName: "Deal Stage Progression",
      status: "failed",
      startTime: "2024-01-23T13:45:00Z",
      endTime: "2024-01-23T13:45:30Z",
      duration: 30,
      trigger: "Deal moved to closing: ACME Corp Deal",
      steps: [
        {
          stepId: "trigger-2",
          stepName: "Deal Stage Changed",
          status: "completed",
          startTime: "2024-01-23T13:45:00Z",
          endTime: "2024-01-23T13:45:01Z",
        },
        {
          stepId: "condition-1",
          stepName: "Deal Value Check",
          status: "failed",
          startTime: "2024-01-23T13:45:01Z",
          endTime: "2024-01-23T13:45:30Z",
          error: "Unable to access deal value field",
        },
      ],
    },
  ]);

  const categories = [
    "Lead Management",
    "Customer Success",
    "Customer Support",
    "Sales",
    "Marketing",
  ];

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || workflow.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || workflow.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "default";
      case "draft":
        return "warning";
      default:
        return "default";
    }
  };

  const getExecutionStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "running":
        return "processing";
      case "failed":
        return "error";
      case "cancelled":
        return "default";
      default:
        return "default";
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "trigger":
        return <ThunderboltOutlined />;
      case "condition":
        return <FilterOutlined />;
      case "action":
        return <SendOutlined />;
      case "delay":
        return <ClockCircleOutlined />;
      default:
        return <ThunderboltOutlined />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "trigger":
        return "#4F46E5";
      case "condition":
        return "#F59E0B";
      case "action":
        return "#10B981";
      case "delay":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const workflowColumns = [
    {
      title: "Workflow",
      key: "workflow",
      render: (_: any, record: Workflow) => (
        <div>
          <Text strong style={{ fontSize: "14px" }}>
            {record.name}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
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
      title: "Trigger",
      dataIndex: "trigger",
      key: "trigger",
      render: (trigger: string) => (
        <Space>
          <ThunderboltOutlined style={{ color: "#4F46E5" }} />
          <Text style={{ fontSize: "12px" }}>{trigger}</Text>
        </Space>
      ),
    },
    {
      title: "Success Rate",
      key: "successRate",
      render: (_: any, record: Workflow) => {
        const rate =
          record.executions.total > 0
            ? (record.executions.successful / record.executions.total) * 100
            : 0;
        return (
          <div>
            <Progress
              percent={rate}
              size="small"
              status={
                rate > 90 ? "success" : rate > 70 ? "normal" : "exception"
              }
            />
            <Text style={{ fontSize: "11px" }}>
              {record.executions.successful}/{record.executions.total}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Last Run",
      key: "lastRun",
      render: (_: any, record: Workflow) => (
        <Text style={{ fontSize: "12px" }}>
          {record.executions.lastExecution
            ? new Date(record.executions.lastExecution).toLocaleString()
            : "Never"}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Workflow) => (
        <Space>
          <Tooltip title={record.status === "active" ? "Pause" : "Activate"}>
            <Button
              type="text"
              icon={
                record.status === "active" ? (
                  <PauseCircleOutlined />
                ) : (
                  <PlayCircleOutlined />
                )
              }
              style={{
                color: record.status === "active" ? "#F59E0B" : "#10B981",
              }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingWorkflow(record);
                setShowWorkflowModal(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button type="text" icon={<CopyOutlined />} />
          </Tooltip>
          <Tooltip title="View Executions">
            <Button
              type="text"
              icon={<BarChartOutlined />}
              onClick={() => setActiveTab("executions")}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const executionColumns = [
    {
      title: "Workflow",
      dataIndex: "workflowName",
      key: "workflowName",
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={getExecutionStatusColor(status) as any}
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: "Trigger",
      dataIndex: "trigger",
      key: "trigger",
      render: (trigger: string) => (
        <Text style={{ fontSize: "12px" }}>{trigger}</Text>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => (
        <Text>{duration ? `${duration}s` : "-"}</Text>
      ),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime: string) => (
        <Text style={{ fontSize: "12px" }}>
          {new Date(startTime).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: WorkflowExecution) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => setViewingExecution(record)}
        >
          View Details
        </Button>
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
              🌊 Workflow Builder
            </Title>
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "16px",
                display: "block",
                marginTop: "8px",
              }}
            >
              Create and manage automated business processes
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
            onClick={() => setShowWorkflowModal(true)}
          >
            Create Workflow
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
              title="Total Workflows"
              value={workflows.length}
              prefix={<BranchesOutlined style={{ color: "#4F46E5" }} />}
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
              value={workflows.filter((w) => w.status === "active").length}
              prefix={<PlayCircleOutlined style={{ color: "#10B981" }} />}
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
              title="Total Executions"
              value={workflows.reduce((sum, w) => sum + w.executions.total, 0)}
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
              title="Success Rate"
              value={
                workflows.reduce((sum, w) => sum + w.executions.total, 0) > 0
                  ? (workflows.reduce(
                      (sum, w) => sum + w.executions.successful,
                      0
                    ) /
                      workflows.reduce(
                        (sum, w) => sum + w.executions.total,
                        0
                      )) *
                    100
                  : 0
              }
              precision={1}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: "#EF4444" }} />}
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
          <TabPane tab="Workflows" key="workflows">
            {/* Filters */}
            <div style={{ marginBottom: "24px" }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={8}>
                  <Search
                    placeholder="Search workflows..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%" }}
                    size="large"
                  />
                </Col>
                <Col xs={24} sm={4}>
                  <Select
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Category"
                  >
                    <Option value="all">All Categories</Option>
                    {categories.map((category) => (
                      <Option key={category} value={category}>
                        {category}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={4}>
                  <Select
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Status"
                  >
                    <Option value="all">All Status</Option>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                    <Option value="draft">Draft</Option>
                  </Select>
                </Col>
              </Row>
            </div>

            {/* Workflows Table */}
            <Table
              columns={workflowColumns}
              dataSource={filteredWorkflows}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
              }}
            />
          </TabPane>

          <TabPane tab="Executions" key="executions">
            <div style={{ marginBottom: "16px" }}>
              <Alert
                message="Workflow Execution History"
                description="Monitor all workflow executions, their status, and performance metrics."
                type="info"
                showIcon
              />
            </div>

            <Table
              columns={executionColumns}
              dataSource={executions}
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

      {/* Execution Details Modal */}
      <Modal
        title="Execution Details"
        open={!!viewingExecution}
        onCancel={() => setViewingExecution(null)}
        footer={[
          <Button key="close" onClick={() => setViewingExecution(null)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewingExecution && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
              <Col span={8}>
                <Statistic
                  title="Status"
                  value={viewingExecution.status}
                  valueStyle={{
                    color:
                      viewingExecution.status === "completed"
                        ? "#52c41a"
                        : viewingExecution.status === "failed"
                        ? "#ff4d4f"
                        : "#1890ff",
                  }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Duration"
                  value={viewingExecution.duration || 0}
                  suffix="seconds"
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Steps"
                  value={viewingExecution.steps.length}
                />
              </Col>
            </Row>

            <Divider orientation="left">Execution Timeline</Divider>
            <Timeline>
              {viewingExecution.steps.map((step, index) => (
                <Timeline.Item
                  key={step.stepId}
                  color={
                    step.status === "completed"
                      ? "green"
                      : step.status === "failed"
                      ? "red"
                      : step.status === "running"
                      ? "blue"
                      : "gray"
                  }
                  dot={
                    step.status === "completed" ? (
                      <CheckCircleOutlined />
                    ) : step.status === "failed" ? (
                      <CloseCircleOutlined />
                    ) : step.status === "running" ? (
                      <SyncOutlined spin />
                    ) : (
                      <ClockCircleOutlined />
                    )
                  }
                >
                  <div>
                    <Text strong>{step.stepName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {new Date(step.startTime).toLocaleString()}
                      {step.endTime &&
                        ` - ${new Date(step.endTime).toLocaleString()}`}
                    </Text>
                    {step.error && (
                      <div style={{ marginTop: "8px" }}>
                        <Alert message={step.error} type="error" />
                      </div>
                    )}
                    {step.result && (
                      <div style={{ marginTop: "8px" }}>
                        <Text code style={{ fontSize: "11px" }}>
                          {JSON.stringify(step.result, null, 2)}
                        </Text>
                      </div>
                    )}
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        )}
      </Modal>
    </div>
  );
}
