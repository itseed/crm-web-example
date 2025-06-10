"use client";

import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Tag,
  Avatar,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Badge,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useCRM, Customer } from "../../../store/useCRM";

const { Title } = Typography;

export default function CustomersPage() {
  const t = useTranslations("customers");
  const { customers, tickets, deals, deleteCustomer } = useCRM();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  // Sample data if no customers exist
  const sampleCustomers: Customer[] =
    customers.length === 0
      ? [
          {
            id: "1",
            name: "John Smith",
            email: "john.smith@acme.com",
            phone: "+1 (555) 123-4567",
            company: "Acme Corporation",
            industry: "Technology",
            status: "active",
            totalValue: 125000,
            lastActivity: new Date().toISOString(),
            tags: ["VIP", "Enterprise"],
            assignedTo: "Sarah Wilson",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Maria Garcia",
            email: "maria@techstart.com",
            phone: "+1 (555) 234-5678",
            company: "TechStart Inc",
            industry: "Software",
            status: "active",
            totalValue: 75000,
            lastActivity: new Date().toISOString(),
            tags: ["Startup"],
            assignedTo: "Mike Johnson",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]
      : customers;

  const filtered = sampleCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors = {
      active: "green",
      inactive: "red",
      prospect: "blue",
    };
    return colors[status as keyof typeof colors] || "default";
  };

  const getCustomerTickets = (customerId: string) => {
    return tickets.filter((ticket) => ticket.customerId === customerId);
  };

  const getCustomerDeals = (customerId: string) => {
    return deals.filter((deal) => deal.customerId === customerId);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    Modal.confirm({
      title: "Delete Customer",
      content:
        "Are you sure you want to delete this customer? This action cannot be undone.",
      onOk: () => deleteCustomer(customerId),
    });
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "Customer",
      key: "customer",
      render: (_, record: Customer) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          >
            {record.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </Avatar>
          <div>
            <strong>{record.name}</strong>
            <div style={{ fontSize: "12px", color: "#666" }}>
              <MailOutlined style={{ marginRight: "4px" }} />
              {record.email}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              <PhoneOutlined style={{ marginRight: "4px" }} />
              {record.phone}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Company",
      key: "company",
      render: (_, record: Customer) => (
        <div>
          <div style={{ fontWeight: "bold" }}>{record.company}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.industry}
          </div>
        </div>
      ),
      sorter: (a, b) => a.company.localeCompare(b.company),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
        { text: "Prospect", value: "prospect" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (value: number) => (
        <span style={{ fontWeight: "bold", color: "#52c41a" }}>
          ${value.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <div>
          {tags.map((tag) => (
            <Tag key={tag} color="blue" style={{ marginBottom: "2px" }}>
              {tag}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Assigned To",
      dataIndex: "assignedTo",
      key: "assignedTo",
      render: (assignedTo: string) => (
        <Badge status="processing" text={assignedTo} />
      ),
    },
    {
      title: "Last Activity",
      dataIndex: "lastActivity",
      key: "lastActivity",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) =>
        new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Customer) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewCustomer(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              // Edit functionality
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteCustomer(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Calculate customer statistics
  const customerStats = {
    total: sampleCustomers.length,
    active: sampleCustomers.filter((c) => c.status === "active").length,
    totalValue: sampleCustomers.reduce((sum, c) => sum + c.totalValue, 0),
    avgValue:
      sampleCustomers.length > 0
        ? sampleCustomers.reduce((sum, c) => sum + c.totalValue, 0) /
          sampleCustomers.length
        : 0,
  };

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
        <Title level={2}>Customer Management</Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Add New Customer
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={customerStats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Customers"
              value={customerStats.active}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Customer Value"
              value={customerStats.totalValue}
              precision={0}
              prefix="$"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Customer Value"
              value={customerStats.avgValue}
              precision={0}
              prefix="$"
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Card style={{ marginBottom: "16px" }}>
        <Input.Search
          placeholder="Search customers by name, email, or company..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
          size="large"
        />
      </Card>

      {/* Customers Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} customers`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Customer Details Modal */}
      <Modal
        title="Customer Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCustomer && (
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Contact Information" size="small">
                  <p>
                    <strong>Name:</strong> {selectedCustomer.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedCustomer.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedCustomer.phone}
                  </p>
                  <p>
                    <strong>Company:</strong> {selectedCustomer.company}
                  </p>
                  <p>
                    <strong>Industry:</strong> {selectedCustomer.industry}
                  </p>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Business Information" size="small">
                  <p>
                    <strong>Status:</strong>
                    <Tag
                      color={getStatusColor(selectedCustomer.status)}
                      style={{ marginLeft: 8 }}
                    >
                      {selectedCustomer.status}
                    </Tag>
                  </p>
                  <p>
                    <strong>Total Value:</strong> $
                    {selectedCustomer.totalValue.toLocaleString()}
                  </p>
                  <p>
                    <strong>Assigned To:</strong> {selectedCustomer.assignedTo}
                  </p>
                  <p>
                    <strong>Last Activity:</strong>{" "}
                    {new Date(
                      selectedCustomer.lastActivity
                    ).toLocaleDateString()}
                  </p>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col xs={24} md={12}>
                <Card title="Recent Tickets" size="small">
                  {getCustomerTickets(selectedCustomer.id).length > 0 ? (
                    getCustomerTickets(selectedCustomer.id)
                      .slice(0, 3)
                      .map((ticket) => (
                        <div
                          key={ticket.id}
                          style={{
                            marginBottom: "8px",
                            padding: "8px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                          }}
                        >
                          <strong>{ticket.title}</strong>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            Status: {ticket.status} | Priority:{" "}
                            {ticket.priority}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p style={{ color: "#666" }}>No recent tickets</p>
                  )}
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Recent Deals" size="small">
                  {getCustomerDeals(selectedCustomer.id).length > 0 ? (
                    getCustomerDeals(selectedCustomer.id)
                      .slice(0, 3)
                      .map((deal) => (
                        <div
                          key={deal.id}
                          style={{
                            marginBottom: "8px",
                            padding: "8px",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                          }}
                        >
                          <strong>{deal.title}</strong>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            Value: ${deal.value.toLocaleString()} | Stage:{" "}
                            {deal.stage}
                          </div>
                        </div>
                      ))
                  ) : (
                    <p style={{ color: "#666" }}>No recent deals</p>
                  )}
                </Card>
              </Col>
            </Row>

            {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
              <Card title="Tags" size="small" style={{ marginTop: "16px" }}>
                {selectedCustomer.tags.map((tag) => (
                  <Tag key={tag} color="blue" style={{ marginBottom: "4px" }}>
                    {tag}
                  </Tag>
                ))}
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
