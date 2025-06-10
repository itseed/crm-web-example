"use client";

import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Avatar,
  Progress,
  Typography,
  Select,
  DatePicker,
  Input,
  Modal,
  Form,
  Row,
  Col,
  Tabs,
  List,
  Checkbox,
  Divider,
  message,
  Badge,
  Tooltip,
  Dropdown,
  MenuProps,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BugOutlined,
  BulbOutlined,
  FireOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

export default function TasksPage() {
  const t = useTranslations("tasks");
  const [selectedTab, setSelectedTab] = useState("all");
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Sample task data
  const tasks = [
    {
      id: 1,
      title: "Follow up with Acme Corp lead",
      description: "Schedule a demo call to present our solution",
      priority: "high",
      status: "in_progress",
      assignee: "Sarah Wilson",
      dueDate: "2024-01-20",
      progress: 60,
      type: "sales",
      customer: "Acme Corp",
      tags: ["lead", "demo", "urgent"],
      createdAt: "2024-01-15",
      comments: 3,
    },
    {
      id: 2,
      title: "Resolve login issue for TechStart",
      description: "Customer experiencing authentication problems",
      priority: "high",
      status: "todo",
      assignee: "Mike Johnson",
      dueDate: "2024-01-18",
      progress: 0,
      type: "support",
      customer: "TechStart Inc",
      tags: ["bug", "authentication", "urgent"],
      createdAt: "2024-01-16",
      comments: 5,
    },
    {
      id: 3,
      title: "Prepare monthly sales report",
      description: "Compile Q4 performance metrics and insights",
      priority: "medium",
      status: "done",
      assignee: "Emily Davis",
      dueDate: "2024-01-15",
      progress: 100,
      type: "administrative",
      customer: null,
      tags: ["report", "monthly", "analytics"],
      createdAt: "2024-01-10",
      comments: 2,
    },
    {
      id: 4,
      title: "Update CRM automation rules",
      description: "Optimize lead scoring and email sequences",
      priority: "low",
      status: "in_progress",
      assignee: "John Smith",
      dueDate: "2024-01-25",
      progress: 30,
      type: "technical",
      customer: null,
      tags: ["automation", "crm", "improvement"],
      createdAt: "2024-01-12",
      comments: 1,
    },
    {
      id: 5,
      title: "Client onboarding for DataFlow Systems",
      description: "Complete account setup and initial training",
      priority: "medium",
      status: "todo",
      assignee: "Lisa Brown",
      dueDate: "2024-01-22",
      progress: 0,
      type: "onboarding",
      customer: "DataFlow Systems",
      tags: ["onboarding", "training", "new-client"],
      createdAt: "2024-01-17",
      comments: 0,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "blue";
      case "in_progress":
        return "orange";
      case "done":
        return "green";
      case "blocked":
        return "red";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales":
        return <BulbOutlined style={{ color: "#4F46E5" }} />;
      case "support":
        return <BugOutlined style={{ color: "#EF4444" }} />;
      case "technical":
        return <FireOutlined style={{ color: "#F59E0B" }} />;
      case "onboarding":
        return <UserOutlined style={{ color: "#10B981" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#6B7280" }} />;
    }
  };

  const taskActions: MenuProps["items"] = [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View Details",
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Task",
    },
    {
      type: "divider",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete Task",
      danger: true,
    },
  ];

  const columns = [
    {
      title: "Task",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "8px",
              height: "32px",
              borderRadius: "4px",
              backgroundColor: getPriorityColor(record.priority),
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              {getTypeIcon(record.type)}
              <Text style={{ fontWeight: 500, fontSize: "14px" }}>{text}</Text>
            </div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.description}
            </Text>
            {record.customer && (
              <div style={{ marginTop: "4px" }}>
                <Tag size="small" color="blue">
                  {record.customer}
                </Tag>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      key: "assignee",
      width: 150,
      render: (assignee: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar size={28} style={{ backgroundColor: "#4F46E5" }}>
            {assignee
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <Text style={{ fontSize: "13px" }}>{assignee}</Text>
        </div>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      width: 120,
      render: (progress: number) => (
        <div>
          <Progress
            percent={progress}
            size="small"
            strokeColor="#4F46E5"
            showInfo={false}
          />
          <Text style={{ fontSize: "12px", color: "#6B7280" }}>
            {progress}%
          </Text>
        </div>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
      render: (dueDate: string, record: any) => {
        const isOverdue =
          dayjs(dueDate).isBefore(dayjs()) && record.status !== "done";
        const isDueSoon =
          dayjs(dueDate).diff(dayjs(), "days") <= 2 && record.status !== "done";

        return (
          <div>
            <Text
              style={{
                fontSize: "13px",
                color: isOverdue
                  ? "#EF4444"
                  : isDueSoon
                  ? "#F59E0B"
                  : "#374151",
              }}
            >
              {dayjs(dueDate).format("MMM DD")}
            </Text>
            {isOverdue && (
              <div style={{ fontSize: "11px", color: "#EF4444" }}>Overdue</div>
            )}
            {isDueSoon && !isOverdue && (
              <div style={{ fontSize: "11px", color: "#F59E0B" }}>Due soon</div>
            )}
          </div>
        );
      },
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      width: 80,
      render: (comments: number) => (
        <Badge count={comments} size="small" style={{ fontSize: "11px" }} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 60,
      render: (record: any) => (
        <Dropdown
          menu={{
            items: taskActions,
            onClick: ({ key }) => {
              if (key === "edit") {
                setSelectedTask(record);
                setTaskModalVisible(true);
              } else if (key === "delete") {
                message.success("Task deleted successfully");
              } else if (key === "view") {
                setSelectedTask(record);
                setTaskModalVisible(true);
              }
            },
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      ),
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "my_tasks" && task.assignee === "Sarah Wilson") ||
      (selectedTab === "overdue" &&
        dayjs(task.dueDate).isBefore(dayjs()) &&
        task.status !== "done") ||
      (selectedTab === "completed" && task.status === "done");

    return matchesSearch && matchesStatus && matchesPriority && matchesTab;
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "done").length,
    overdue: tasks.filter(
      (t) => dayjs(t.dueDate).isBefore(dayjs()) && t.status !== "done"
    ).length,
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div>
          <Title level={2} style={{ marginBottom: "8px" }}>
            Task Management
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Organize and track your team's work efficiently
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setSelectedTask(null);
            setTaskModalVisible(true);
          }}
          style={{ borderRadius: "8px" }}
        >
          Create Task
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: "12px", textAlign: "center" }}>
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              Total Tasks
            </Text>
            <Title level={2} style={{ margin: "8px 0", color: "#1E293B" }}>
              {taskStats.total}
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: "12px", textAlign: "center" }}>
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              To Do
            </Text>
            <Title level={2} style={{ margin: "8px 0", color: "#3B82F6" }}>
              {taskStats.todo}
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: "12px", textAlign: "center" }}>
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              In Progress
            </Text>
            <Title level={2} style={{ margin: "8px 0", color: "#F59E0B" }}>
              {taskStats.inProgress}
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card style={{ borderRadius: "12px", textAlign: "center" }}>
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              Completed
            </Text>
            <Title level={2} style={{ margin: "8px 0", color: "#10B981" }}>
              {taskStats.completed}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: "16px" }}>
        {/* Filters and Tabs */}
        <div style={{ marginBottom: "24px" }}>
          <Tabs
            activeKey={selectedTab}
            onChange={setSelectedTab}
            items={[
              { key: "all", label: `All Tasks (${taskStats.total})` },
              { key: "my_tasks", label: "My Tasks" },
              { key: "overdue", label: `Overdue (${taskStats.overdue})` },
              { key: "completed", label: `Completed (${taskStats.completed})` },
            ]}
          />

          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <Search
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="todo">To Do</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
              <Select.Option value="done">Done</Select.Option>
              <Select.Option value="blocked">Blocked</Select.Option>
            </Select>
            <Select
              placeholder="Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: 120 }}
            >
              <Select.Option value="all">All Priority</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="low">Low</Select.Option>
            </Select>
          </div>
        </div>

        {/* Tasks Table */}
        <Table
          columns={columns}
          dataSource={filteredTasks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} tasks`,
          }}
          style={{ marginTop: "16px" }}
        />
      </Card>

      {/* Task Modal */}
      <Modal
        title={selectedTask ? "Edit Task" : "Create New Task"}
        open={taskModalVisible}
        onCancel={() => {
          setTaskModalVisible(false);
          setSelectedTask(null);
        }}
        footer={null}
        width={800}
      >
        <Form layout="vertical" style={{ marginTop: "24px" }}>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <Form.Item label="Task Title" rules={[{ required: true }]}>
                <Input
                  placeholder="Enter task title"
                  defaultValue={selectedTask?.title}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Priority" rules={[{ required: true }]}>
                <Select
                  placeholder="Select priority"
                  defaultValue={selectedTask?.priority}
                  size="large"
                >
                  <Select.Option value="low">Low</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="high">High</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Description">
            <TextArea
              rows={4}
              placeholder="Describe the task details..."
              defaultValue={selectedTask?.description}
            />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item label="Status" rules={[{ required: true }]}>
                <Select
                  placeholder="Select status"
                  defaultValue={selectedTask?.status || "todo"}
                  size="large"
                >
                  <Select.Option value="todo">To Do</Select.Option>
                  <Select.Option value="in_progress">In Progress</Select.Option>
                  <Select.Option value="done">Done</Select.Option>
                  <Select.Option value="blocked">Blocked</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Assignee" rules={[{ required: true }]}>
                <Select
                  placeholder="Select assignee"
                  defaultValue={selectedTask?.assignee}
                  size="large"
                >
                  <Select.Option value="Sarah Wilson">
                    Sarah Wilson
                  </Select.Option>
                  <Select.Option value="Mike Johnson">
                    Mike Johnson
                  </Select.Option>
                  <Select.Option value="Emily Davis">Emily Davis</Select.Option>
                  <Select.Option value="John Smith">John Smith</Select.Option>
                  <Select.Option value="Lisa Brown">Lisa Brown</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Due Date" rules={[{ required: true }]}>
                <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  defaultValue={
                    selectedTask?.dueDate ? dayjs(selectedTask.dueDate) : null
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Type">
                <Select
                  placeholder="Select task type"
                  defaultValue={selectedTask?.type}
                  size="large"
                >
                  <Select.Option value="sales">Sales</Select.Option>
                  <Select.Option value="support">Support</Select.Option>
                  <Select.Option value="technical">Technical</Select.Option>
                  <Select.Option value="onboarding">Onboarding</Select.Option>
                  <Select.Option value="administrative">
                    Administrative
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Customer (Optional)">
                <Select
                  placeholder="Select customer"
                  defaultValue={selectedTask?.customer}
                  size="large"
                  allowClear
                >
                  <Select.Option value="Acme Corp">Acme Corp</Select.Option>
                  <Select.Option value="TechStart Inc">
                    TechStart Inc
                  </Select.Option>
                  <Select.Option value="DataFlow Systems">
                    DataFlow Systems
                  </Select.Option>
                  <Select.Option value="Innovation Labs">
                    Innovation Labs
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Tags">
            <Select
              mode="tags"
              placeholder="Add tags..."
              defaultValue={selectedTask?.tags}
              size="large"
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: "32px" }}>
            <Space>
              <Button onClick={() => setTaskModalVisible(false)} size="large">
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  message.success(
                    selectedTask
                      ? "Task updated successfully"
                      : "Task created successfully"
                  );
                  setTaskModalVisible(false);
                  setSelectedTask(null);
                }}
              >
                {selectedTask ? "Update Task" : "Create Task"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
