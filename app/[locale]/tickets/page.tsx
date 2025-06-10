"use client";

import {
  Button,
  Table,
  Select,
  DatePicker,
  Space,
  Card,
  Tag,
  Input,
  Statistic,
  Row,
  Col,
  Badge,
  Avatar,
  Typography,
  Tooltip,
  Dropdown,
  MenuProps,
} from "antd";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useCRM } from "../../../store/useCRM";

const { Search } = Input;
const { Title } = Typography;

export default function TicketsPage() {
  const t = useTranslations("tickets");
  const { tickets, customers, activities, getTicketsByStatus, updateTicket } =
    useCRM();
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let filtered = tickets;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter(
        (ticket) => ticket.priority === priorityFilter
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.customerId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, statusFilter, priorityFilter, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "blue";
      case "in_progress":
        return "orange";
      case "resolved":
        return "green";
      case "closed":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : "Unknown Customer";
  };

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicket(ticketId, { status: newStatus });
  };

  const actionMenu = (ticketId: string): MenuProps => ({
    items: [
      {
        key: "open",
        label: "Mark as Open",
        onClick: () => handleStatusChange(ticketId, "open"),
      },
      {
        key: "in_progress",
        label: "Mark as In Progress",
        onClick: () => handleStatusChange(ticketId, "in_progress"),
      },
      {
        key: "resolved",
        label: "Mark as Resolved",
        onClick: () => handleStatusChange(ticketId, "resolved"),
      },
      {
        key: "closed",
        label: "Mark as Closed",
        onClick: () => handleStatusChange(ticketId, "closed"),
      },
    ],
  });

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id: string) => (
        <Typography.Text code>{id.slice(0, 8)}</Typography.Text>
      ),
    },
    {
      title: "Subject",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: any) => (
        <div>
          <Typography.Text strong>{title}</Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
            {record.description.length > 50
              ? `${record.description.substring(0, 50)}...`
              : record.description}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customerId",
      key: "customer",
      render: (customerId: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {getCustomerName(customerId)}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.replace("_", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: any) => (
        <Dropdown menu={actionMenu(record.id)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Calculate statistics
  const openTickets = tickets.filter((t) => t.status === "open").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "in_progress"
  ).length;
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length;
  const closedTickets = tickets.filter((t) => t.status === "closed").length;

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>Support Tickets</Title>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: "24px" }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Open Tickets"
                value={openTickets}
                prefix={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="In Progress"
                value={inProgressTickets}
                prefix={
                  <ExclamationCircleOutlined style={{ color: "#fa8c16" }} />
                }
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Resolved"
                value={resolvedTickets}
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Closed"
                value={closedTickets}
                valueStyle={{ color: "#666" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters and Actions */}
        <Card>
          <Row gutter={16} style={{ marginBottom: "16px" }}>
            <Col span={6}>
              <Search
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Filter by Status"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "open", label: "Open" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                  { value: "closed", label: "Closed" },
                ]}
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Filter by Priority"
                value={priorityFilter}
                onChange={setPriorityFilter}
                style={{ width: "100%" }}
                options={[
                  { value: "all", label: "All Priority" },
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
              />
            </Col>
            <Col span={4}>
              <DatePicker placeholder="Select Date" style={{ width: "100%" }} />
            </Col>
            <Col span={6}>
              <Space>
                <Link href="/tickets/new">
                  <Button type="primary">Create New Ticket</Button>
                </Link>
                <Button icon={<ExportOutlined />}>Export</Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredTickets}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} tickets`,
          }}
        />
      </Card>
    </div>
  );
}
