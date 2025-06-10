"use client";

import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Typography,
  Space,
  Table,
  Progress,
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
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  UserOutlined,
  AimOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useState, useMemo } from "react";
import { useCRM } from "../../../store/useCRM";
import dayjs, { Dayjs } from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

export default function AnalyticsPage() {
  const {
    leads,
    customers,
    tickets,
    deals,
    activities,
    getLeadsByStatus,
    getConversionRate,
    getTicketsByStatus,
    getDealsByStage,
    getRevenueByMonth,
  } = useCRM();

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Filter data by date range
  const filteredData = useMemo(() => {
    if (!dateRange) return { leads, customers, tickets, deals, activities };

    const [start, end] = dateRange;
    return {
      leads: leads.filter((lead) => {
        const date = dayjs(lead.createdAt);
        return date.isAfter(start) && date.isBefore(end);
      }),
      customers: customers.filter((customer) => {
        const date = dayjs(customer.createdAt);
        return date.isAfter(start) && date.isBefore(end);
      }),
      tickets: tickets.filter((ticket) => {
        const date = dayjs(ticket.createdAt);
        return date.isAfter(start) && date.isBefore(end);
      }),
      deals: deals.filter((deal) => {
        const date = dayjs(deal.createdAt);
        return date.isAfter(start) && date.isBefore(end);
      }),
      activities: activities.filter((activity) => {
        const date = dayjs(activity.createdAt);
        return date.isAfter(start) && date.isBefore(end);
      }),
    };
  }, [leads, customers, tickets, deals, activities, dateRange]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalLeads = filteredData.leads.length;
    const totalCustomers = filteredData.customers.length;
    const conversionRate =
      totalLeads > 0 ? (totalCustomers / totalLeads) * 100 : 0;

    const totalRevenue = filteredData.deals
      .filter((deal) => deal.stage === "closed-won")
      .reduce((sum, deal) => sum + deal.value, 0);

    const pipelineValue = filteredData.deals
      .filter((deal) => !["closed-won", "closed-lost"].includes(deal.stage))
      .reduce((sum, deal) => sum + deal.value, 0);

    const averageDealSize =
      filteredData.deals.length > 0
        ? filteredData.deals.reduce((sum, deal) => sum + deal.value, 0) /
          filteredData.deals.length
        : 0;

    const winRate =
      filteredData.deals.length > 0
        ? (filteredData.deals.filter((deal) => deal.stage === "closed-won")
            .length /
            filteredData.deals.length) *
          100
        : 0;

    return {
      totalLeads,
      totalCustomers,
      conversionRate,
      totalRevenue,
      pipelineValue,
      averageDealSize,
      winRate,
    };
  }, [filteredData]);

  // Lead funnel data
  const leadFunnelData = useMemo(() => {
    const statusCounts = filteredData.leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: "New", value: statusCounts.new || 0, fill: "#8884d8" },
      {
        name: "Contacted",
        value: statusCounts.contacted || 0,
        fill: "#82ca9d",
      },
      {
        name: "Qualified",
        value: statusCounts.qualified || 0,
        fill: "#ffc658",
      },
      { name: "Proposal", value: statusCounts.proposal || 0, fill: "#ff7300" },
      {
        name: "Negotiation",
        value: statusCounts.negotiation || 0,
        fill: "#00ff00",
      },
      {
        name: "Closed Won",
        value: statusCounts["closed-won"] || 0,
        fill: "#0088fe",
      },
    ];
  }, [filteredData.leads]);

  // Revenue trend data
  const revenueTrendData = useMemo(() => {
    const revenueByPeriod: Record<string, number> = {};

    filteredData.deals
      .filter((deal) => deal.stage === "closed-won")
      .forEach((deal) => {
        const date = dayjs(deal.updatedAt);
        const period =
          selectedPeriod === "week"
            ? date.format("YYYY-WW")
            : date.format("YYYY-MM");

        revenueByPeriod[period] = (revenueByPeriod[period] || 0) + deal.value;
      });

    return Object.entries(revenueByPeriod)
      .map(([period, revenue]) => ({
        period,
        revenue,
        formattedPeriod:
          selectedPeriod === "week"
            ? `Week ${period.split("-")[1]}`
            : dayjs(period, "YYYY-MM").format("MMM YYYY"),
      }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }, [filteredData.deals, selectedPeriod]);

  // Activity data
  const activityData = useMemo(() => {
    const activityCounts = filteredData.activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(activityCounts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
    }));
  }, [filteredData.activities]);

  // Sales performance data
  const salesPerformanceData = useMemo(() => {
    const performanceByRep: Record<
      string,
      { deals: number; revenue: number; leads: number }
    > = {};

    filteredData.leads.forEach((lead) => {
      if (!performanceByRep[lead.assignedTo]) {
        performanceByRep[lead.assignedTo] = { deals: 0, revenue: 0, leads: 0 };
      }
      performanceByRep[lead.assignedTo].leads++;
    });

    filteredData.deals.forEach((deal) => {
      if (!performanceByRep[deal.assignedTo]) {
        performanceByRep[deal.assignedTo] = { deals: 0, revenue: 0, leads: 0 };
      }
      performanceByRep[deal.assignedTo].deals++;
      if (deal.stage === "closed-won") {
        performanceByRep[deal.assignedTo].revenue += deal.value;
      }
    });

    return Object.entries(performanceByRep).map(([rep, data]) => ({
      rep,
      ...data,
      conversionRate: data.leads > 0 ? (data.deals / data.leads) * 100 : 0,
    }));
  }, [filteredData.leads, filteredData.deals]);

  const salesPerformanceColumns = [
    {
      title: "Sales Rep",
      dataIndex: "rep",
      key: "rep",
    },
    {
      title: "Leads",
      dataIndex: "leads",
      key: "leads",
    },
    {
      title: "Deals",
      dataIndex: "deals",
      key: "deals",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      title: "Conversion Rate",
      dataIndex: "conversionRate",
      key: "conversionRate",
      render: (value: number) => (
        <div>
          <Progress
            percent={value}
            size="small"
            format={() => `${value.toFixed(1)}%`}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>Analytics & Reports</Title>
        <Space>
          <Select
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            style={{ width: 120 }}
          >
            <Option value="week">Weekly</Option>
            <Option value="month">Monthly</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            format="YYYY-MM-DD"
          />
        </Space>
      </div>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Leads"
              value={metrics.totalLeads}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={metrics.conversionRate}
              precision={1}
              suffix="%"
              prefix={
                metrics.conversionRate > 20 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              valueStyle={{
                color: metrics.conversionRate > 20 ? "#3f8600" : "#cf1322",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={metrics.totalRevenue}
              precision={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pipeline Value"
              value={metrics.pipelineValue}
              precision={0}
              prefix={<AimOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Deal Size"
              value={metrics.averageDealSize}
              precision={0}
              prefix="$"
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Win Rate"
              value={metrics.winRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={metrics.totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#2f54eb" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Open Tickets"
              value={
                filteredData.tickets.filter((t) => t.status === "open").length
              }
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Trend">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedPeriod" />
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
          <Card title="Sales Funnel">
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Funnel dataKey="value" data={leadFunnelData} isAnimationActive>
                  <LabelList position="center" fill="#fff" stroke="none" />
                </Funnel>
                <Tooltip />
              </FunnelChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          <Card title="Activity Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Lead Sources">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredData.leads.reduce((acc, lead) => {
                    const existing = acc.find(
                      (item) => item.name === lead.source
                    );
                    if (existing) {
                      existing.value++;
                    } else {
                      acc.push({ name: lead.source, value: 1 });
                    }
                    return acc;
                  }, [] as Array<{ name: string; value: number }>)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {filteredData.leads.map((_, index) => (
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

      {/* Sales Performance Table */}
      <Row>
        <Col xs={24}>
          <Card title="Sales Representative Performance">
            <Table
              columns={salesPerformanceColumns}
              dataSource={salesPerformanceData}
              rowKey="rep"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
