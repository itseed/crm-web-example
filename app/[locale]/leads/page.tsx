"use client";

import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  Card,
  Progress,
  Badge,
  Typography,
  Tabs,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCRM, Lead } from "../../../store/useCRM";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

export default function LeadsPage() {
  const t = useTranslations("leads");
  const { leads, updateLead, deleteLead, convertLeadToCustomer, addActivity } =
    useCRM();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("table");

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = !statusFilter || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Kanban board organization
  const kanbanColumns = {
    new: leads.filter((lead) => lead.status === "new"),
    contacted: leads.filter((lead) => lead.status === "contacted"),
    qualified: leads.filter((lead) => lead.status === "qualified"),
    proposal: leads.filter((lead) => lead.status === "proposal"),
    negotiation: leads.filter((lead) => lead.status === "negotiation"),
    "closed-won": leads.filter((lead) => lead.status === "closed-won"),
    "closed-lost": leads.filter((lead) => lead.status === "closed-lost"),
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#52c41a";
    if (score >= 60) return "#faad14";
    if (score >= 40) return "#ff7a45";
    return "#ff4d4f";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: "blue",
      contacted: "cyan",
      qualified: "green",
      proposal: "gold",
      negotiation: "orange",
      "closed-won": "success",
      "closed-lost": "error",
    };
    return colors[status] || "default";
  };

  const handleConvert = (leadId: string) => {
    Modal.confirm({
      title: "Convert Lead to Customer",
      content: "Are you sure you want to convert this lead to a customer?",
      onOk: () => {
        convertLeadToCustomer(leadId);
        addActivity({
          type: "deal_won",
          title: "Lead Converted",
          description: `Lead converted to customer`,
          entityType: "lead",
          entityId: leadId,
          userId: "1",
          userName: "User",
        });
      },
    });
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    updateLead(leadId, { status: newStatus as any });
    addActivity({
      type: "note",
      title: "Status Updated",
      description: `Lead status changed to ${newStatus}`,
      entityType: "lead",
      entityId: leadId,
      userId: "1",
      userName: "User",
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStatus = result.destination.droppableId;

    handleStatusChange(leadId, newStatus);
  };

  const columns: ColumnsType<Lead> = [
    {
      title: "Lead Score",
      dataIndex: "score",
      key: "score",
      width: 120,
      render: (score: number) => (
        <div style={{ textAlign: "center" }}>
          <Progress
            type="circle"
            size={50}
            percent={score}
            strokeColor={getScoreColor(score)}
            format={() => score}
          />
        </div>
      ),
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Lead) => (
        <div>
          <strong>{name}</strong>
          <div style={{ fontSize: "12px", color: "#666" }}>{record.email}</div>
        </div>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
      render: (company: string, record: Lead) => (
        <div>
          <div>{company}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Lead) => (
        <Select
          value={status}
          size="small"
          style={{ width: 120 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Option value="new">New</Option>
          <Option value="contacted">Contacted</Option>
          <Option value="qualified">Qualified</Option>
          <Option value="proposal">Proposal</Option>
          <Option value="negotiation">Negotiation</Option>
          <Option value="closed-won">Closed Won</Option>
          <Option value="closed-lost">Closed Lost</Option>
        </Select>
      ),
      filters: [
        { text: "New", value: "new" },
        { text: "Contacted", value: "contacted" },
        { text: "Qualified", value: "qualified" },
        { text: "Proposal", value: "proposal" },
        { text: "Negotiation", value: "negotiation" },
        { text: "Closed Won", value: "closed-won" },
        { text: "Closed Lost", value: "closed-lost" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value: number) => `$${value.toLocaleString()}`,
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (source: string) => <Tag color="blue">{source}</Tag>,
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
      title: "Next Follow-up",
      dataIndex: "nextFollowUp",
      key: "nextFollowUp",
      render: (date: string) => {
        if (!date) return "-";
        const followUpDate = new Date(date);
        const isOverdue = followUpDate < new Date();
        return (
          <span style={{ color: isOverdue ? "#ff4d4f" : "#666" }}>
            {followUpDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Lead) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedLead(record);
              setModalVisible(true);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              // Edit functionality
            }}
          />
          {record.status === "qualified" && (
            <Button
              type="text"
              style={{ color: "#52c41a" }}
              onClick={() => handleConvert(record.id)}
            >
              Convert
            </Button>
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Delete Lead",
                content: "Are you sure you want to delete this lead?",
                onOk: () => deleteLead(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const KanbanBoard = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          padding: "16px 0",
        }}
      >
        {Object.entries(kanbanColumns).map(([status, statusLeads]) => (
          <div
            key={status}
            style={{
              minWidth: "280px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
              <Title level={5}>
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace("-", " ")}
              </Title>
              <Badge
                count={statusLeads.length}
                style={{ backgroundColor: getStatusColor(status) }}
              />
            </div>
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minHeight: "400px",
                    backgroundColor: snapshot.isDraggingOver
                      ? "#e6f7ff"
                      : "transparent",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                >
                  {statusLeads.map((lead, index) => (
                    <Draggable
                      key={lead.id}
                      draggableId={lead.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: "8px",
                          }}
                        >
                          <Card
                            size="small"
                            style={{
                              cursor: "move",
                              backgroundColor: snapshot.isDragging
                                ? "#fff7e6"
                                : "white",
                              border: snapshot.isDragging
                                ? "2px solid #1890ff"
                                : "1px solid #d9d9d9",
                            }}
                            actions={[
                              <EyeOutlined
                                key="view"
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setModalVisible(true);
                                }}
                              />,
                              <EditOutlined key="edit" />,
                              lead.status === "qualified" && (
                                <Button
                                  key="convert"
                                  type="link"
                                  size="small"
                                  onClick={() => handleConvert(lead.id)}
                                >
                                  Convert
                                </Button>
                              ),
                            ].filter(Boolean)}
                          >
                            <div>
                              <strong>{lead.name}</strong>
                              <div style={{ fontSize: "12px", color: "#666" }}>
                                {lead.company}
                              </div>
                              <div style={{ margin: "8px 0" }}>
                                <Progress
                                  percent={lead.score}
                                  size="small"
                                  strokeColor={getScoreColor(lead.score)}
                                  format={() => `${lead.score}%`}
                                />
                              </div>
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                  color: "#1890ff",
                                }}
                              >
                                ${lead.value.toLocaleString()}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#666",
                                  marginTop: "4px",
                                }}
                              >
                                {lead.source}
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>Lead Management</Title>
        <Link href="/leads/new">
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Lead
          </Button>
        </Link>
      </div>

      <Card style={{ marginBottom: "16px" }}>
        <Space size="middle" wrap>
          <Input
            placeholder="Search leads..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
            allowClear
          >
            <Option value="new">New</Option>
            <Option value="contacted">Contacted</Option>
            <Option value="qualified">Qualified</Option>
            <Option value="proposal">Proposal</Option>
            <Option value="negotiation">Negotiation</Option>
            <Option value="closed-won">Closed Won</Option>
            <Option value="closed-lost">Closed Lost</Option>
          </Select>
        </Space>
      </Card>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Table View" key="table">
          <Table
            columns={columns}
            dataSource={filteredLeads}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} leads`,
            }}
            scroll={{ x: 1200 }}
          />
        </TabPane>
        <TabPane tab="Kanban Board" key="kanban">
          <KanbanBoard />
        </TabPane>
      </Tabs>

      <Modal
        title="Lead Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedLead && (
          <div>
            <Card title="Contact Information" style={{ marginBottom: "16px" }}>
              <p>
                <strong>Name:</strong> {selectedLead.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedLead.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedLead.phone}
              </p>
              <p>
                <strong>Company:</strong> {selectedLead.company}
              </p>
            </Card>

            <Card title="Lead Details" style={{ marginBottom: "16px" }}>
              <p>
                <strong>Score:</strong>
                <Progress
                  percent={selectedLead.score}
                  strokeColor={getScoreColor(selectedLead.score)}
                  style={{ width: 100, marginLeft: 8 }}
                />
              </p>
              <p>
                <strong>Status:</strong>
                <Tag
                  color={getStatusColor(selectedLead.status)}
                  style={{ marginLeft: 8 }}
                >
                  {selectedLead.status}
                </Tag>
              </p>
              <p>
                <strong>Value:</strong> ${selectedLead.value.toLocaleString()}
              </p>
              <p>
                <strong>Source:</strong> {selectedLead.source}
              </p>
              <p>
                <strong>Assigned To:</strong> {selectedLead.assignedTo}
              </p>
            </Card>

            {selectedLead.notes && selectedLead.notes.length > 0 && (
              <Card title="Notes">
                {selectedLead.notes.map((note, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "8px",
                      padding: "8px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "4px",
                    }}
                  >
                    {note}
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
