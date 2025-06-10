"use client";

import {
  Card,
  Timeline,
  Button,
  Space,
  Typography,
  Input,
  Select,
  DatePicker,
  Avatar,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  Upload,
  Tabs,
  List,
  Badge,
  Divider,
  message,
  Tooltip,
  Popover,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SendOutlined,
  PaperClipOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Search } = Input;

export default function CommunicationsPage() {
  const t = useTranslations("communications");
  const [activeTab, setActiveTab] = useState("timeline");
  const [communicationModalVisible, setCommunicationModalVisible] =
    useState(false);
  const [selectedType, setSelectedType] = useState("email");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Sample communication data
  const communications = [
    {
      id: 1,
      type: "email",
      subject: "Welcome to our platform",
      content: "Thank you for signing up! Here's how to get started...",
      customer: "John Doe",
      customerEmail: "john@acme.com",
      company: "Acme Corp",
      direction: "outbound",
      timestamp: "2024-01-18 14:30",
      attachments: ["welcome_guide.pdf"],
      status: "delivered",
      agent: "Sarah Wilson",
      tags: ["onboarding", "welcome"],
    },
    {
      id: 2,
      type: "call",
      subject: "Product demo and pricing discussion",
      content:
        "Discussed features, pricing plans, and implementation timeline. Customer interested in Enterprise plan.",
      customer: "Mike Johnson",
      customerEmail: "mike@techstart.com",
      company: "TechStart Inc",
      direction: "outbound",
      timestamp: "2024-01-18 11:00",
      duration: "45 minutes",
      status: "completed",
      agent: "Emily Davis",
      tags: ["demo", "sales", "pricing"],
    },
    {
      id: 3,
      type: "chat",
      subject: "Support inquiry - Login issues",
      content:
        "Customer experiencing difficulty logging in. Provided password reset instructions.",
      customer: "Lisa Chen",
      customerEmail: "lisa@dataflow.com",
      company: "DataFlow Systems",
      direction: "inbound",
      timestamp: "2024-01-18 09:15",
      status: "resolved",
      agent: "John Smith",
      tags: ["support", "login", "resolved"],
    },
    {
      id: 4,
      type: "meeting",
      subject: "Quarterly business review",
      content:
        "Reviewed performance metrics, discussed expansion opportunities, and upcoming feature requests.",
      customer: "Robert Brown",
      customerEmail: "robert@innovation.com",
      company: "Innovation Labs",
      direction: "meeting",
      timestamp: "2024-01-17 15:00",
      duration: "60 minutes",
      status: "completed",
      agent: "Sarah Wilson",
      tags: ["qbr", "review", "expansion"],
    },
    {
      id: 5,
      type: "email",
      subject: "Follow-up on proposal",
      content:
        "Following up on the proposal sent last week. Any questions or feedback?",
      customer: "Anna Taylor",
      customerEmail: "anna@future.com",
      company: "Future Tech",
      direction: "outbound",
      timestamp: "2024-01-17 10:30",
      status: "opened",
      agent: "Mike Johnson",
      tags: ["follow-up", "proposal"],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <MailOutlined style={{ color: "#4F46E5" }} />;
      case "call":
        return <PhoneOutlined style={{ color: "#10B981" }} />;
      case "chat":
        return <MessageOutlined style={{ color: "#F59E0B" }} />;
      case "meeting":
        return <VideoCameraOutlined style={{ color: "#EF4444" }} />;
      default:
        return <FileTextOutlined style={{ color: "#6B7280" }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "completed":
      case "resolved":
        return "green";
      case "opened":
      case "in_progress":
        return "blue";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      default:
        return "default";
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case "inbound":
        return "#10B981";
      case "outbound":
        return "#4F46E5";
      case "meeting":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const filteredCommunications = communications.filter((comm) => {
    const matchesSearch =
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || comm.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const communicationStats = {
    total: communications.length,
    emails: communications.filter((c) => c.type === "email").length,
    calls: communications.filter((c) => c.type === "call").length,
    chats: communications.filter((c) => c.type === "chat").length,
    meetings: communications.filter((c) => c.type === "meeting").length,
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
            Communications Hub
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Track all customer interactions and communications in one place
          </Text>
        </div>

        <Space>
          <Button icon={<DownloadOutlined />} style={{ borderRadius: "8px" }}>
            Export
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setCommunicationModalVisible(true)}
            style={{ borderRadius: "8px" }}
          >
            Log Communication
          </Button>
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={12} sm={6} lg={3}>
          <Card style={{ borderRadius: "12px", textAlign: "center" }}>
            <MailOutlined
              style={{
                fontSize: "24px",
                color: "#4F46E5",
                marginBottom: "8px",
              }}
            />
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              Emails
            </Text>
            <Title level={3} style={{ margin: "4px 0", color: "#1E293B" }}>
              {communicationStats.emails}
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card style={{ borderRadius: "12px", textAlign: "center" }}>
            <PhoneOutlined
              style={{
                fontSize: "24px",
                color: "#10B981",
                marginBottom: "8px",
              }}
            />
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              Calls
            </Text>
            <Title level={3} style={{ margin: "4px 0", color: "#1E293B" }}>
              {communicationStats.calls}
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card style={{ borderRadius: "12px", textAlign: "center" }}>
            <MessageOutlined
              style={{
                fontSize: "24px",
                color: "#F59E0B",
                marginBottom: "8px",
              }}
            />
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              Chats
            </Text>
            <Title level={3} style={{ margin: "4px 0", color: "#1E293B" }}>
              {communicationStats.chats}
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card style={{ borderRadius: "12px", textAlign: "center" }}>
            <VideoCameraOutlined
              style={{
                fontSize: "24px",
                color: "#EF4444",
                marginBottom: "8px",
              }}
            />
            <Text
              type="secondary"
              style={{ fontSize: "12px", display: "block" }}
            >
              Meetings
            </Text>
            <Title level={3} style={{ margin: "4px 0", color: "#1E293B" }}>
              {communicationStats.meetings}
            </Title>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: "16px" }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "timeline",
              label: (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <ClockCircleOutlined />
                  Communication Timeline
                </span>
              ),
              children: (
                <div>
                  {/* Filters */}
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "24px",
                      flexWrap: "wrap",
                    }}
                  >
                    <Search
                      placeholder="Search communications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: 300 }}
                      allowClear
                    />
                    <Select
                      placeholder="Type"
                      value={typeFilter}
                      onChange={setTypeFilter}
                      style={{ width: 120 }}
                    >
                      <Select.Option value="all">All Types</Select.Option>
                      <Select.Option value="email">Email</Select.Option>
                      <Select.Option value="call">Call</Select.Option>
                      <Select.Option value="chat">Chat</Select.Option>
                      <Select.Option value="meeting">Meeting</Select.Option>
                    </Select>
                    <DatePicker.RangePicker style={{ borderRadius: "8px" }} />
                  </div>

                  {/* Timeline */}
                  <Timeline mode="left">
                    {filteredCommunications.map((comm) => (
                      <Timeline.Item
                        key={comm.id}
                        dot={
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              background: "#F8FAFC",
                              border: `2px solid ${getDirectionColor(
                                comm.direction
                              )}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {getTypeIcon(comm.type)}
                          </div>
                        }
                        color="transparent"
                      >
                        <Card
                          size="small"
                          style={{
                            marginLeft: "16px",
                            borderRadius: "12px",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }}
                          bodyStyle={{ padding: "16px" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "12px",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  marginBottom: "4px",
                                }}
                              >
                                <Text
                                  style={{ fontWeight: 600, fontSize: "14px" }}
                                >
                                  {comm.subject}
                                </Text>
                                <Tag color={getStatusColor(comm.status)}>
                                  {comm.status}
                                </Tag>
                              </div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {comm.customer} • {comm.company}
                              </Text>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <Text
                                style={{ fontSize: "12px", color: "#6B7280" }}
                              >
                                {dayjs(comm.timestamp).format("MMM DD, HH:mm")}
                              </Text>
                              <div style={{ marginTop: "4px" }}>
                                <Avatar
                                  size={24}
                                  style={{ backgroundColor: "#4F46E5" }}
                                >
                                  {comm.agent
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </Avatar>
                              </div>
                            </div>
                          </div>

                          <Paragraph
                            style={{
                              fontSize: "13px",
                              marginBottom: "12px",
                              color: "#374151",
                            }}
                          >
                            {comm.content}
                          </Paragraph>

                          {(comm.duration || comm.attachments) && (
                            <div style={{ marginBottom: "12px" }}>
                              {comm.duration && (
                                <Tag
                                  icon={<ClockCircleOutlined />}
                                  color="blue"
                                >
                                  {comm.duration}
                                </Tag>
                              )}
                              {comm.attachments &&
                                comm.attachments.map((attachment, index) => (
                                  <Tag
                                    key={index}
                                    icon={<PaperClipOutlined />}
                                    color="green"
                                  >
                                    {attachment}
                                  </Tag>
                                ))}
                            </div>
                          )}

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              {comm.tags.map((tag, index) => (
                                <Tag key={index} style={{ marginRight: "4px" }}>
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                            <Space size="small">
                              <Tooltip title="View Details">
                                <Button
                                  type="text"
                                  icon={<EyeOutlined />}
                                  size="small"
                                />
                              </Tooltip>
                              <Tooltip title="Reply">
                                <Button
                                  type="text"
                                  icon={<SendOutlined />}
                                  size="small"
                                />
                              </Tooltip>
                            </Space>
                          </div>
                        </Card>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </div>
              ),
            },
            {
              key: "analytics",
              label: (
                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <BarChartOutlined />
                  Analytics
                </span>
              ),
              children: (
                <div>
                  <Row gutter={[24, 24]}>
                    <Col span={12}>
                      <Card
                        title="Communication Volume by Type"
                        style={{ borderRadius: "12px" }}
                      >
                        <div style={{ padding: "20px 0" }}>
                          {Object.entries(communicationStats)
                            .filter(([key]) => key !== "total")
                            .map(([type, count]) => (
                              <div key={type} style={{ marginBottom: "16px" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "8px",
                                  }}
                                >
                                  <span
                                    style={{
                                      textTransform: "capitalize",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {type}
                                  </span>
                                  <span>{count}</span>
                                </div>
                                <div
                                  style={{
                                    width: "100%",
                                    height: "8px",
                                    backgroundColor: "#F1F5F9",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${
                                        (count / communicationStats.total) * 100
                                      }%`,
                                      height: "100%",
                                      backgroundColor:
                                        type === "emails"
                                          ? "#4F46E5"
                                          : type === "calls"
                                          ? "#10B981"
                                          : type === "chats"
                                          ? "#F59E0B"
                                          : "#EF4444",
                                      borderRadius: "4px",
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card
                        title="Response Times"
                        style={{ borderRadius: "12px" }}
                      >
                        <div style={{ padding: "20px 0" }}>
                          <div style={{ marginBottom: "20px" }}>
                            <Text type="secondary">Average Response Time</Text>
                            <Title
                              level={2}
                              style={{ margin: "8px 0", color: "#10B981" }}
                            >
                              2.4 hours
                            </Title>
                          </div>
                          <Divider />
                          <div style={{ marginBottom: "16px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Email</Text>
                              <Text style={{ fontWeight: 500 }}>3.2 hours</Text>
                            </div>
                          </div>
                          <div style={{ marginBottom: "16px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Chat</Text>
                              <Text style={{ fontWeight: 500 }}>
                                12 minutes
                              </Text>
                            </div>
                          </div>
                          <div style={{ marginBottom: "16px" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text>Phone</Text>
                              <Text style={{ fontWeight: 500 }}>1.8 hours</Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Communication Modal */}
      <Modal
        title="Log New Communication"
        open={communicationModalVisible}
        onCancel={() => setCommunicationModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form layout="vertical" style={{ marginTop: "24px" }}>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                label="Communication Type"
                rules={[{ required: true }]}
              >
                <Select
                  value={selectedType}
                  onChange={setSelectedType}
                  size="large"
                >
                  <Select.Option value="email">
                    <Space>
                      <MailOutlined />
                      Email
                    </Space>
                  </Select.Option>
                  <Select.Option value="call">
                    <Space>
                      <PhoneOutlined />
                      Phone Call
                    </Space>
                  </Select.Option>
                  <Select.Option value="chat">
                    <Space>
                      <MessageOutlined />
                      Chat/Message
                    </Space>
                  </Select.Option>
                  <Select.Option value="meeting">
                    <Space>
                      <VideoCameraOutlined />
                      Meeting
                    </Space>
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Direction" rules={[{ required: true }]}>
                <Select placeholder="Select direction" size="large">
                  <Select.Option value="inbound">Inbound</Select.Option>
                  <Select.Option value="outbound">Outbound</Select.Option>
                  <Select.Option value="meeting">Meeting</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Customer" rules={[{ required: true }]}>
                <Select placeholder="Select customer" size="large" showSearch>
                  <Select.Option value="john@acme.com">
                    John Doe - Acme Corp
                  </Select.Option>
                  <Select.Option value="mike@techstart.com">
                    Mike Johnson - TechStart Inc
                  </Select.Option>
                  <Select.Option value="lisa@dataflow.com">
                    Lisa Chen - DataFlow Systems
                  </Select.Option>
                  <Select.Option value="robert@innovation.com">
                    Robert Brown - Innovation Labs
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Date & Time" rules={[{ required: true }]}>
                <DatePicker
                  showTime
                  style={{ width: "100%" }}
                  size="large"
                  defaultValue={dayjs()}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Subject/Title" rules={[{ required: true }]}>
            <Input
              placeholder="Enter communication subject or title"
              size="large"
            />
          </Form.Item>

          <Form.Item label="Content/Notes" rules={[{ required: true }]}>
            <TextArea
              rows={4}
              placeholder="Describe the communication details, key points discussed, outcomes, etc."
            />
          </Form.Item>

          {(selectedType === "call" || selectedType === "meeting") && (
            <Form.Item label="Duration">
              <Input placeholder="e.g., 30 minutes, 1 hour" size="large" />
            </Form.Item>
          )}

          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item label="Status">
                <Select placeholder="Select status" size="large">
                  <Select.Option value="completed">Completed</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="scheduled">Scheduled</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Attachments">
                <Upload>
                  <Button icon={<PaperClipOutlined />} size="large">
                    Add Files
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Tags">
            <Select
              mode="tags"
              placeholder="Add tags to categorize this communication"
              size="large"
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: "32px" }}>
            <Space>
              <Button
                onClick={() => setCommunicationModalVisible(false)}
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  message.success("Communication logged successfully");
                  setCommunicationModalVisible(false);
                }}
              >
                Log Communication
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
