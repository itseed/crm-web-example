"use client";

import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  DatePicker,
  Select,
  Space,
  Table,
  Progress,
  Typography,
  Divider,
  Tag,
  Tabs,
  Avatar,
  List,
} from "antd";
import {
  DownloadOutlined,
  FilterOutlined,
  TrophyOutlined,
  TeamOutlined,
  DollarOutlined,
  PhoneOutlined,
  MailOutlined,
  AreaChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  CalendarOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [selectedPeriod, setSelectedPeriod] = useState("30days");

  // Sample data
  const salesData = [
    { month: "Jan", sales: 12000, leads: 45, deals: 8, revenue: 85000 },
    { month: "Feb", sales: 19000, leads: 67, deals: 12, revenue: 120000 },
    { month: "Mar", sales: 15000, leads: 52, deals: 10, revenue: 95000 },
    { month: "Apr", sales: 22000, leads: 78, deals: 15, revenue: 140000 },
    { month: "May", sales: 18000, leads: 61, deals: 11, revenue: 110000 },
    { month: "Jun", sales: 25000, leads: 89, deals: 18, revenue: 165000 },
  ];

  const pieData = [
    { name: "New Leads", value: 35, color: "#4F46E5" },
    { name: "Contacted", value: 25, color: "#06B6D4" },
    { name: "Qualified", value: 20, color: "#10B981" },
    { name: "Closed Won", value: 15, color: "#F59E0B" },
    { name: "Closed Lost", value: 5, color: "#EF4444" },
  ];

  const topSalesReps = [
    { name: "Sarah Wilson", deals: 18, revenue: 45000, growth: 12 },
    { name: "Mike Johnson", deals: 15, revenue: 38000, growth: 8 },
    { name: "Emily Davis", deals: 12, revenue: 32000, growth: 15 },
    { name: "John Smith", deals: 10, revenue: 28000, growth: -3 },
    { name: "Lisa Brown", deals: 8, revenue: 22000, growth: 6 },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "deal_won",
      description: "Deal closed with Acme Corp",
      amount: "$25,000",
      user: "Sarah Wilson",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "lead_created",
      description: "New lead from website form",
      amount: "Potential: $12,000",
      user: "System",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "call_made",
      description: "Follow-up call with TechStart Inc",
      amount: "Proposal sent",
      user: "Mike Johnson",
      time: "6 hours ago",
    },
    {
      id: 4,
      type: "email_sent",
      description: "Welcome email automation triggered",
      amount: "5 recipients",
      user: "Automation",
      time: "8 hours ago",
    },
  ];

  const conversionFunnel = [
    { stage: "Visitors", count: 10000, percentage: 100 },
    { stage: "Leads", count: 500, percentage: 5 },
    { stage: "Qualified", count: 150, percentage: 1.5 },
    { stage: "Proposals", count: 50, percentage: 0.5 },
    { stage: "Closed Won", count: 15, percentage: 0.15 },
  ];

  const handleExport = (format: string) => {
    console.log(`Exporting in ${format} format`);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "deal_won":
        return <TrophyOutlined style={{ color: "#10B981" }} />;
      case "lead_created":
        return <TeamOutlined style={{ color: "#4F46E5" }} />;
      case "call_made":
        return <PhoneOutlined style={{ color: "#F59E0B" }} />;
      case "email_sent":
        return <MailOutlined style={{ color: "#06B6D4" }} />;
      default:
        return <CalendarOutlined />;
    }
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
            Advanced Reports & Analytics
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Comprehensive insights into your sales performance and business
            metrics
          </Text>
        </div>

        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            style={{ borderRadius: "8px" }}
          />
          <Select
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            style={{ width: 120, borderRadius: "8px" }}
          >
            <Select.Option value="7days">Last 7 days</Select.Option>
            <Select.Option value="30days">Last 30 days</Select.Option>
            <Select.Option value="90days">Last 90 days</Select.Option>
            <Select.Option value="1year">Last year</Select.Option>
          </Select>
          <Button icon={<FilterOutlined />} style={{ borderRadius: "8px" }}>
            Filters
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            style={{ borderRadius: "8px" }}
          >
            Export Report
          </Button>
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        items={[
          {
            key: "overview",
            label: (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <AreaChartOutlined />
                Overview
              </span>
            ),
            children: (
              <div>
                {/* KPI Cards */}
                <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
                  <Col xs={24} sm={12} lg={6}>
                    <Card
                      style={{
                        borderRadius: "16px",
                        border: "none",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: "rgba(255,255,255,0.8)" }}>
                            Total Revenue
                          </span>
                        }
                        value={715000}
                        precision={0}
                        prefix="$"
                        valueStyle={{
                          color: "#fff",
                          fontSize: "28px",
                          fontWeight: "600",
                        }}
                        suffix={
                          <span
                            style={{
                              fontSize: "14px",
                              color: "rgba(255,255,255,0.7)",
                            }}
                          >
                            +12.3%
                          </span>
                        }
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card
                      style={{
                        borderRadius: "16px",
                        border: "none",
                        background:
                          "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                      }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: "rgba(255,255,255,0.8)" }}>
                            Deals Closed
                          </span>
                        }
                        value={74}
                        valueStyle={{
                          color: "#fff",
                          fontSize: "28px",
                          fontWeight: "600",
                        }}
                        suffix={
                          <span
                            style={{
                              fontSize: "14px",
                              color: "rgba(255,255,255,0.7)",
                            }}
                          >
                            +8.1%
                          </span>
                        }
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card
                      style={{
                        borderRadius: "16px",
                        border: "none",
                        background:
                          "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: "rgba(255,255,255,0.8)" }}>
                            Conversion Rate
                          </span>
                        }
                        value={18.5}
                        precision={1}
                        suffix="%"
                        valueStyle={{
                          color: "#fff",
                          fontSize: "28px",
                          fontWeight: "600",
                        }}
                        suffix={
                          <span
                            style={{
                              fontSize: "14px",
                              color: "rgba(255,255,255,0.7)",
                            }}
                          >
                            +3.2%
                          </span>
                        }
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card
                      style={{
                        borderRadius: "16px",
                        border: "none",
                        background:
                          "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                      }}
                    >
                      <Statistic
                        title={
                          <span style={{ color: "rgba(255,255,255,0.8)" }}>
                            Avg Deal Size
                          </span>
                        }
                        value={9662}
                        precision={0}
                        prefix="$"
                        valueStyle={{
                          color: "#fff",
                          fontSize: "28px",
                          fontWeight: "600",
                        }}
                        suffix={
                          <span
                            style={{
                              fontSize: "14px",
                              color: "rgba(255,255,255,0.7)",
                            }}
                          >
                            +5.7%
                          </span>
                        }
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Charts Row */}
                <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
                  <Col xs={24} lg={16}>
                    <Card
                      title="Revenue & Deals Trend"
                      style={{ borderRadius: "16px", height: "400px" }}
                      extra={
                        <Space>
                          <Button
                            size="small"
                            type="text"
                            icon={<LineChartOutlined />}
                          />
                          <Button
                            size="small"
                            type="text"
                            icon={<BarChartOutlined />}
                          />
                        </Space>
                      }
                    >
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                          />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="revenue"
                            fill="#4F46E5"
                            name="Revenue ($)"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="deals"
                            stroke="#10B981"
                            strokeWidth={3}
                            name="Deals Closed"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card
                      title="Lead Distribution"
                      style={{ borderRadius: "16px", height: "400px" }}
                      extra={
                        <Button
                          size="small"
                          type="text"
                          icon={<PieChartOutlined />}
                        />
                      }
                    >
                      <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ marginTop: "16px" }}>
                        {pieData.map((item, index) => (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "8px",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <div
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  backgroundColor: item.color,
                                }}
                              />
                              {item.name}
                            </span>
                            <span style={{ fontWeight: "500" }}>
                              {item.value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Bottom Row */}
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Top Sales Representatives"
                      style={{ borderRadius: "16px" }}
                    >
                      {topSalesReps.map((rep, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px 0",
                            borderBottom:
                              index < topSalesReps.length - 1
                                ? "1px solid #f0f0f0"
                                : "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <Avatar
                              size={40}
                              style={{ backgroundColor: "#4F46E5" }}
                            >
                              {rep.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </Avatar>
                            <div>
                              <div style={{ fontWeight: "500" }}>
                                {rep.name}
                              </div>
                              <Text
                                type="secondary"
                                style={{ fontSize: "12px" }}
                              >
                                {rep.deals} deals closed
                              </Text>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{ fontWeight: "600", color: "#1E293B" }}
                            >
                              ${rep.revenue.toLocaleString()}
                            </div>
                            <Tag
                              color={rep.growth > 0 ? "green" : "red"}
                              style={{ fontSize: "11px" }}
                            >
                              {rep.growth > 0 ? "+" : ""}
                              {rep.growth}%
                            </Tag>
                          </div>
                        </div>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Recent Activities"
                      style={{ borderRadius: "16px" }}
                    >
                      <List
                        dataSource={recentActivities}
                        renderItem={(item) => (
                          <List.Item
                            style={{ border: "none", padding: "12px 0" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                width: "100%",
                              }}
                            >
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "8px",
                                  background: "#F8FAFC",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {getActivityIcon(item.type)}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: "500",
                                    marginBottom: "2px",
                                  }}
                                >
                                  {item.description}
                                </div>
                                <Text
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {item.user} • {item.time}
                                </Text>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <Text
                                  style={{
                                    fontSize: "12px",
                                    color: "#10B981",
                                    fontWeight: "500",
                                  }}
                                >
                                  {item.amount}
                                </Text>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: "funnel",
            label: (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <BarChartOutlined />
                Conversion Funnel
              </span>
            ),
            children: (
              <div>
                <Card
                  title="Sales Conversion Funnel"
                  style={{ borderRadius: "16px", marginBottom: "24px" }}
                >
                  {conversionFunnel.map((stage, index) => (
                    <div key={index} style={{ marginBottom: "24px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <Text style={{ fontWeight: "500" }}>{stage.stage}</Text>
                        <Space>
                          <Text>{stage.count.toLocaleString()}</Text>
                          <Text type="secondary">({stage.percentage}%)</Text>
                        </Space>
                      </div>
                      <Progress
                        percent={stage.percentage * 20}
                        showInfo={false}
                        strokeColor={{
                          "0%": "#4F46E5",
                          "100%": "#06B6D4",
                        }}
                        style={{ marginBottom: "8px" }}
                      />
                      {index < conversionFunnel.length - 1 && (
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Drop-off:{" "}
                          {(
                            ((conversionFunnel[index].count -
                              conversionFunnel[index + 1].count) /
                              conversionFunnel[index].count) *
                            100
                          ).toFixed(1)}
                          %
                        </Text>
                      )}
                    </div>
                  ))}
                </Card>

                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Card
                      title="Funnel Performance by Source"
                      style={{ borderRadius: "16px" }}
                    >
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="leads"
                            fill="#4F46E5"
                            name="Leads Generated"
                          />
                          <Bar
                            dataKey="deals"
                            fill="#10B981"
                            name="Deals Closed"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: "export",
            label: (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <DownloadOutlined />
                Export & Share
              </span>
            ),
            children: (
              <div>
                <Row gutter={[24, 24]}>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Export Options"
                      style={{ borderRadius: "16px", height: "100%" }}
                    >
                      <Text
                        type="secondary"
                        style={{ display: "block", marginBottom: "24px" }}
                      >
                        Export your reports in various formats for sharing or
                        further analysis.
                      </Text>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Button
                          block
                          size="large"
                          icon={<FileExcelOutlined />}
                          onClick={() => handleExport("excel")}
                          style={{
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            height: "48px",
                          }}
                        >
                          Export to Excel (.xlsx)
                        </Button>
                        <Button
                          block
                          size="large"
                          icon={<FilePdfOutlined />}
                          onClick={() => handleExport("pdf")}
                          style={{
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            height: "48px",
                          }}
                        >
                          Export to PDF
                        </Button>
                        <Button
                          block
                          size="large"
                          icon={<DownloadOutlined />}
                          onClick={() => handleExport("csv")}
                          style={{
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            height: "48px",
                          }}
                        >
                          Export to CSV
                        </Button>
                        <Button
                          block
                          size="large"
                          icon={<PrinterOutlined />}
                          onClick={() => window.print()}
                          style={{
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            height: "48px",
                          }}
                        >
                          Print Report
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card
                      title="Scheduled Reports"
                      style={{ borderRadius: "16px", height: "100%" }}
                    >
                      <Text
                        type="secondary"
                        style={{ display: "block", marginBottom: "24px" }}
                      >
                        Set up automated report delivery to stakeholders.
                      </Text>
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <div
                          style={{
                            padding: "16px",
                            border: "1px solid #E2E8F0",
                            borderRadius: "8px",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            Weekly Sales Summary
                          </div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Every Monday at 9:00 AM • To: management@company.com
                          </Text>
                          <div style={{ marginTop: "8px" }}>
                            <Button
                              size="small"
                              type="link"
                              style={{ padding: 0 }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              type="link"
                              style={{ padding: 0, marginLeft: "12px" }}
                            >
                              Disable
                            </Button>
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "16px",
                            border: "1px solid #E2E8F0",
                            borderRadius: "8px",
                            marginBottom: "12px",
                          }}
                        >
                          <div
                            style={{ fontWeight: "500", marginBottom: "8px" }}
                          >
                            Monthly Performance Report
                          </div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            1st of every month • To: sales-team@company.com
                          </Text>
                          <div style={{ marginTop: "8px" }}>
                            <Button
                              size="small"
                              type="link"
                              style={{ padding: 0 }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              type="link"
                              style={{ padding: 0, marginLeft: "12px" }}
                            >
                              Disable
                            </Button>
                          </div>
                        </div>
                        <Button
                          block
                          type="dashed"
                          style={{
                            borderRadius: "8px",
                            height: "48px",
                            marginTop: "16px",
                          }}
                        >
                          + Create New Schedule
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
