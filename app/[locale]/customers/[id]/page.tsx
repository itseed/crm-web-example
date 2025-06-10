"use client";

import {
  Card,
  Tabs,
  Row,
  Col,
  Statistic,
  Avatar,
  Tag,
  Typography,
  Table,
  Timeline,
  Progress,
  Descriptions,
  Button,
  Space,
  Badge,
} from "antd";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  EditOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useCRM } from "../../../../store/useCRM";
import { useMemo } from "react";

const { Title, Text } = Typography;

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const t = useTranslations("customers");
  const { customers, tickets, activities, deals } = useCRM();

  const customer = useMemo(() => {
    return customers.find((c) => c.id === id);
  }, [customers, id]);

  const customerTickets = useMemo(() => {
    return tickets.filter((ticket) => ticket.customerId === id);
  }, [tickets, id]);

  const customerActivities = useMemo(() => {
    return activities.filter((activity) => activity.relatedTo === id);
  }, [activities, id]);

  const customerDeals = useMemo(() => {
    return deals.filter((deal) => deal.customerId === id);
  }, [deals, id]);

  if (!customer) {
    return (
      <Card>
        <Text>Customer not found</Text>
      </Card>
    );
  }

  const ticketColumns = [
    {
      title: "Ticket ID",
      dataIndex: "id",
      key: "id",
      render: (id: string) => <Text code>{id.slice(0, 8)}</Text>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "open"
              ? "blue"
              : status === "in-progress"
              ? "orange"
              : status === "resolved"
              ? "green"
              : "default"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag
          color={
            priority === "high"
              ? "red"
              : priority === "medium"
              ? "orange"
              : "green"
          }
        >
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const dealColumns = [
    {
      title: "Deal Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage: string) => (
        <Tag color="blue">{stage.replace("-", " ").toUpperCase()}</Tag>
      ),
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      render: (probability: number) => (
        <Progress
          percent={probability}
          size="small"
          status={probability > 70 ? "active" : "normal"}
        />
      ),
    },
  ];

  const openTickets = customerTickets.filter((t) => t.status === "open").length;
  const totalTickets = customerTickets.length;
  const totalDealsValue = customerDeals.reduce(
    (sum, deal) => sum + deal.value,
    0
  );

  return (
    <div style={{ padding: "24px" }}>
      {/* Customer Header */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={[24, 24]}>
          <Col span={6}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{ marginBottom: "16px" }}
              />
              <Title level={3} style={{ margin: 0 }}>
                {customer.name}
              </Title>
              <Text type="secondary">{customer.company}</Text>
              <div style={{ marginTop: "16px" }}>
                <Tag color={customer.status === "active" ? "green" : "orange"}>
                  {customer.status.toUpperCase()}
                </Tag>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <Descriptions column={1} size="small">
              <Descriptions.Item
                label={
                  <Space>
                    <MailOutlined />
                    Email
                  </Space>
                }
              >
                {customer.email}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <PhoneOutlined />
                    Phone
                  </Space>
                }
              >
                {customer.phone}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <TeamOutlined />
                    Industry
                  </Space>
                }
              >
                {customer.industry}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Space>
                    <UserOutlined />
                    Assigned To
                  </Space>
                }
              >
                {customer.assignedTo}
              </Descriptions.Item>
              <Descriptions.Item label="Tags">
                {customer.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={6}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button type="primary" icon={<EditOutlined />} block>
                Edit Customer
              </Button>
              <Button icon={<CalendarOutlined />} block>
                Schedule Meeting
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Value"
              value={customer.totalValue}
              prefix={<DollarOutlined />}
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Open Tickets"
              value={openTickets}
              suffix={`/ ${totalTickets}`}
              valueStyle={{ color: openTickets > 0 ? "#ff4d4f" : "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Deals"
              value={
                customerDeals.filter(
                  (d) => !["closed-won", "closed-lost"].includes(d.stage)
                ).length
              }
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pipeline Value"
              value={totalDealsValue}
              prefix={<DollarOutlined />}
              formatter={(value) => `$${Number(value).toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Detailed Information Tabs */}
      <Card>
        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: "overview",
              label: "Overview",
              children: (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="Recent Activities" size="small">
                      <Timeline
                        items={customerActivities
                          .slice(0, 5)
                          .map((activity) => ({
                            children: (
                              <div>
                                <Text strong>{activity.type}</Text>
                                <br />
                                <Text type="secondary">
                                  {activity.description}
                                </Text>
                                <br />
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {new Date(
                                    activity.createdAt
                                  ).toLocaleDateString()}
                                </Text>
                              </div>
                            ),
                          }))}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Customer Health Score" size="small">
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        <Progress
                          type="circle"
                          percent={75}
                          format={() => "75/100"}
                          strokeColor={{
                            "0%": "#108ee9",
                            "100%": "#87d068",
                          }}
                        />
                        <div style={{ marginTop: "16px" }}>
                          <Text type="secondary">
                            Based on activity, engagement, and support
                            interactions
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: "tickets",
              label: `Support Tickets ${
                totalTickets > 0 ? `(${totalTickets})` : ""
              }`,
              children: (
                <Table
                  columns={ticketColumns}
                  dataSource={customerTickets}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  locale={{ emptyText: "No support tickets found" }}
                />
              ),
            },
            {
              key: "deals",
              label: `Deals (${customerDeals.length})`,
              children: (
                <Table
                  columns={dealColumns}
                  dataSource={customerDeals}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  locale={{ emptyText: "No deals found" }}
                />
              ),
            },
            {
              key: "activities",
              label: `Activities (${customerActivities.length})`,
              children: (
                <div>
                  <Timeline
                    items={customerActivities.map((activity) => ({
                      children: (
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <Text strong>{activity.type}</Text>
                              <Badge
                                count={activity.type}
                                style={{ marginLeft: "8px" }}
                                color={
                                  activity.type === "email"
                                    ? "blue"
                                    : activity.type === "call"
                                    ? "green"
                                    : activity.type === "meeting"
                                    ? "purple"
                                    : "default"
                                }
                              />
                            </div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {new Date(
                                activity.createdAt
                              ).toLocaleDateString()}
                            </Text>
                          </div>
                          <div style={{ marginTop: "8px" }}>
                            <Text>{activity.description}</Text>
                          </div>
                          {activity.metadata && (
                            <div style={{ marginTop: "4px" }}>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                Duration: {activity.metadata.duration || "N/A"}
                              </Text>
                            </div>
                          )}
                        </div>
                      ),
                    }))}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
