"use client";

import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Typography,
  List,
  Badge,
  Avatar,
  Space,
  Tag,
  Button,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useTranslations } from "next-intl";
import { useCRM } from "../../store/useCRM";
import {
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Modern color palette
const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"];
const GRADIENT_COLORS = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  success: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  warning: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  info: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const {
    leads,
    customers,
    tickets,
    deals,
    activities,
    getLeadsByStatus,
    getConversionRate,
    getAverageLeadScore,
    getTicketsByStatus,
    getDealsByStage,
    getRevenueByMonth,
  } = useCRM();

  const leadsByStatus = getLeadsByStatus();
  const conversionRate = getConversionRate();
  const averageLeadScore = getAverageLeadScore();
  const ticketsByStatus = getTicketsByStatus();
  const dealsByStage = getDealsByStage();
  const revenueByMonth = getRevenueByMonth();

  const totalRevenue = deals
    .filter((deal) => deal.stage === "closed-won")
    .reduce((sum, deal) => sum + deal.value, 0);

  const pipelineValue = deals
    .filter((deal) => !["closed-won", "closed-lost"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.value, 0);

  const leadStatusData = Object.entries(leadsByStatus).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  const ticketStatusData = Object.entries(ticketsByStatus).map(
    ([status, count]) => ({
      name: status,
      value: count,
    })
  );

  const dealStageData = Object.entries(dealsByStage).map(([stage, count]) => ({
    stage,
    count,
  }));

  const recentActivities = activities
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  const topLeads = leads.sort((a, b) => b.score - a.score).slice(0, 5);

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open"
  ).length;
  const urgentTickets = tickets.filter(
    (ticket) => ticket.priority === "urgent"
  ).length;

  return (
    <div>
      {/* Welcome Section */}
      <div style={{ marginBottom: "32px" }}>
        <Title
          level={2}
          style={{
            marginBottom: "8px",
            background: GRADIENT_COLORS.primary,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Welcome back! 👋
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Here's what's happening with your business today
        </Text>
      </div>

      {/* Key Metrics - Modern Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: GRADIENT_COLORS.primary,
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(79, 70, 229, 0.2)",
            }}
          >
            <div style={{ color: "white" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Total Leads
                  </Text>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      marginTop: "8px",
                    }}
                  >
                    {leads.length}
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <RiseOutlined style={{ color: "#10B981" }} />
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "12px",
                      }}
                    >
                      +12% from last month
                    </Text>
                  </div>
                </div>
                <Avatar
                  size={48}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                  icon={
                    <UserOutlined
                      style={{ color: "white", fontSize: "20px" }}
                    />
                  }
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: GRADIENT_COLORS.success,
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(16, 185, 129, 0.2)",
            }}
          >
            <div style={{ color: "white" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Active Customers
                  </Text>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      marginTop: "8px",
                    }}
                  >
                    {customers.length}
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <RiseOutlined style={{ color: "#34D399" }} />
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "12px",
                      }}
                    >
                      +8% from last month
                    </Text>
                  </div>
                </div>
                <Avatar
                  size={48}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                  icon={
                    <TeamOutlined
                      style={{ color: "white", fontSize: "20px" }}
                    />
                  }
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: GRADIENT_COLORS.warning,
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(245, 87, 108, 0.2)",
            }}
          >
            <div style={{ color: "white" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Total Revenue
                  </Text>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      marginTop: "8px",
                    }}
                  >
                    ${(totalRevenue / 1000).toFixed(0)}K
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <RiseOutlined style={{ color: "#FB7185" }} />
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "12px",
                      }}
                    >
                      +24% from last month
                    </Text>
                  </div>
                </div>
                <Avatar
                  size={48}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                  icon={
                    <DollarOutlined
                      style={{ color: "white", fontSize: "20px" }}
                    />
                  }
                />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              background: GRADIENT_COLORS.info,
              border: "none",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(79, 172, 254, 0.2)",
            }}
          >
            <div style={{ color: "white" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Pipeline Value
                  </Text>
                  <div
                    style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      marginTop: "8px",
                    }}
                  >
                    ${(pipelineValue / 1000).toFixed(0)}K
                  </div>
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <RiseOutlined style={{ color: "#60A5FA" }} />
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "12px",
                      }}
                    >
                      +16% from last month
                    </Text>
                  </div>
                </div>
                <Avatar
                  size={48}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                  }}
                  icon={
                    <TrophyOutlined
                      style={{ color: "white", fontSize: "20px" }}
                    />
                  }
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Secondary Metrics - Minimal Design */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "#EEF2FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <ThunderboltOutlined
                  style={{ color: "#4F46E5", fontSize: "20px" }}
                />
              </div>
              <Text
                type="secondary"
                style={{
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Conversion Rate
              </Text>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                {conversionRate.toFixed(1)}%
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "#F0FDF4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <TrophyOutlined
                  style={{ color: "#10B981", fontSize: "20px" }}
                />
              </div>
              <Text
                type="secondary"
                style={{
                  fontSize: "14px",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Avg Lead Score
              </Text>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#1E293B",
                }}
              >
                {averageLeadScore.toFixed(0)}
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Open Tickets"
              value={openTickets}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: openTickets > 10 ? "#cf1322" : "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Urgent Tickets"
              value={urgentTickets}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: urgentTickets > 0 ? "#cf1322" : "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Leads by Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {leadStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          <Card title="Sales Pipeline">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealStageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Ticket Status Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {ticketStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Tables and Lists */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top Scoring Leads">
            <List
              dataSource={topLeads}
              renderItem={(lead) => (
                <List.Item>
                  <List.Item.Meta
                    title={lead.name}
                    description={`${lead.company} - Score: ${lead.score}`}
                  />
                  <Badge
                    color={
                      lead.status === "new"
                        ? "blue"
                        : lead.status === "qualified"
                        ? "green"
                        : "orange"
                    }
                    text={lead.status}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Recent Activities">
            <List
              dataSource={recentActivities}
              renderItem={(activity) => (
                <List.Item>
                  <List.Item.Meta
                    title={activity.title}
                    description={`${activity.description} - ${new Date(
                      activity.createdAt
                    ).toLocaleDateString()}`}
                  />
                  <Badge
                    color={
                      activity.type === "email"
                        ? "blue"
                        : activity.type === "call"
                        ? "green"
                        : "orange"
                    }
                    text={activity.type}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
