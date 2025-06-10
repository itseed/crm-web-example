"use client";

import {
  Card,
  Typography,
  Statistic,
  Row,
  Col,
  Tag,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
} from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useCRM, Deal } from "../../../store/useCRM";

const { Title, Text } = Typography;
const { Option } = Select;

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  deals: Deal[];
}

export default function PipelinePage() {
  const { deals, updateDeal, addDeal, pipelines, customers } = useCRM();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [form] = Form.useForm();

  // Organize deals by stage
  const pipelineStages: PipelineStage[] = [
    {
      id: "lead",
      name: "Lead",
      color: "#2db7f5",
      deals: deals.filter((deal) => deal.stage === "lead"),
    },
    {
      id: "qualified",
      name: "Qualified",
      color: "#87d068",
      deals: deals.filter((deal) => deal.stage === "qualified"),
    },
    {
      id: "proposal",
      name: "Proposal",
      color: "#f50",
      deals: deals.filter((deal) => deal.stage === "proposal"),
    },
    {
      id: "negotiation",
      name: "Negotiation",
      color: "#fa8c16",
      deals: deals.filter((deal) => deal.stage === "negotiation"),
    },
    {
      id: "closed-won",
      name: "Closed Won",
      color: "#52c41a",
      deals: deals.filter((deal) => deal.stage === "closed-won"),
    },
    {
      id: "closed-lost",
      name: "Closed Lost",
      color: "#ff4d4f",
      deals: deals.filter((deal) => deal.stage === "closed-lost"),
    },
  ];

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const dealId = draggableId;
    const newStage = destination.droppableId;

    updateDeal(dealId, { stage: newStage });
  };

  const handleCreateDeal = (values: any) => {
    const dealData = {
      ...values,
      stage: "lead",
      expectedCloseDate: values.expectedCloseDate?.toISOString() || "",
      notes: [],
      tags: values.tags || [],
    };

    if (editingDeal) {
      updateDeal(editingDeal.id, dealData);
    } else {
      addDeal(dealData);
    }

    setModalVisible(false);
    setEditingDeal(null);
    form.resetFields();
  };

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    form.setFieldsValue({
      ...deal,
      expectedCloseDate: deal.expectedCloseDate
        ? new Date(deal.expectedCloseDate)
        : null,
    });
    setModalVisible(true);
  };

  // Calculate pipeline metrics
  const totalPipelineValue = deals
    .filter((deal) => !["closed-won", "closed-lost"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.value, 0);

  const totalWonValue = deals
    .filter((deal) => deal.stage === "closed-won")
    .reduce((sum, deal) => sum + deal.value, 0);

  const winRate =
    deals.length > 0
      ? (deals.filter((deal) => deal.stage === "closed-won").length /
          deals.length) *
        100
      : 0;

  const avgDealSize =
    deals.length > 0
      ? deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length
      : 0;

  const DealCard = ({ deal, index }: { deal: Deal; index: number }) => (
    <Draggable draggableId={deal.id} index={index}>
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
              backgroundColor: snapshot.isDragging ? "#fff7e6" : "white",
              border: snapshot.isDragging
                ? "2px solid #1890ff"
                : "1px solid #d9d9d9",
              borderRadius: "8px",
            }}
            bodyStyle={{ padding: "12px" }}
            actions={[
              <EditOutlined key="edit" onClick={() => handleEditDeal(deal)} />,
              <DeleteOutlined key="delete" />,
            ]}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "8px",
                }}
              >
                <Text strong style={{ fontSize: "14px" }}>
                  {deal.title}
                </Text>
                <Text style={{ fontSize: "12px", color: "#666" }}>
                  {deal.probability}%
                </Text>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#52c41a",
                  }}
                >
                  ${deal.value.toLocaleString()}
                </Text>
              </div>

              <div style={{ marginBottom: "8px" }}>
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  style={{ marginRight: "6px" }}
                />
                <Text style={{ fontSize: "12px" }}>{deal.assignedTo}</Text>
              </div>

              {deal.expectedCloseDate && (
                <div style={{ marginBottom: "8px" }}>
                  <CalendarOutlined
                    style={{ marginRight: "4px", color: "#666" }}
                  />
                  <Text style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(deal.expectedCloseDate).toLocaleDateString()}
                  </Text>
                </div>
              )}

              {deal.tags && deal.tags.length > 0 && (
                <div>
                  {deal.tags.slice(0, 2).map((tag) => (
                    <Tag key={tag} size="small" style={{ fontSize: "10px" }}>
                      {tag}
                    </Tag>
                  ))}
                  {deal.tags.length > 2 && (
                    <Tag size="small" style={{ fontSize: "10px" }}>
                      +{deal.tags.length - 2}
                    </Tag>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );

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
        <Title level={2}>Sales Pipeline</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Add Deal
        </Button>
      </div>

      {/* Pipeline Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pipeline Value"
              value={totalPipelineValue}
              precision={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Won Deals"
              value={totalWonValue}
              precision={0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Win Rate"
              value={winRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Deal Size"
              value={avgDealSize}
              precision={0}
              prefix="$"
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Pipeline Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            paddingBottom: "16px",
            minHeight: "600px",
          }}
        >
          {pipelineStages.map((stage) => (
            <div
              key={stage.id}
              style={{
                minWidth: "300px",
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <div style={{ marginBottom: "16px", textAlign: "center" }}>
                <Title level={5} style={{ margin: 0, color: stage.color }}>
                  {stage.name}
                </Title>
                <Text style={{ fontSize: "12px", color: "#666" }}>
                  {stage.deals.length} deals • $
                  {stage.deals
                    .reduce((sum, deal) => sum + deal.value, 0)
                    .toLocaleString()}
                </Text>
              </div>

              <Droppable droppableId={stage.id}>
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
                    {stage.deals.map((deal, index) => (
                      <DealCard key={deal.id} deal={deal} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Add/Edit Deal Modal */}
      <Modal
        title={editingDeal ? "Edit Deal" : "Add New Deal"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingDeal(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateDeal}
          initialValues={{
            probability: 50,
            assignedTo: "Sarah Wilson",
          }}
        >
          <Form.Item
            name="title"
            label="Deal Title"
            rules={[{ required: true, message: "Please enter deal title" }]}
          >
            <Input placeholder="Enter deal title" />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="value"
                label="Deal Value ($)"
                rules={[{ required: true, message: "Please enter deal value" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  step={1000}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="probability"
                label="Probability (%)"
                rules={[
                  { required: true, message: "Please enter probability" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={100}
                  placeholder="50"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="assignedTo"
                label="Assigned To"
                rules={[
                  { required: true, message: "Please assign to someone" },
                ]}
              >
                <Select placeholder="Select sales rep">
                  <Option value="Sarah Wilson">Sarah Wilson</Option>
                  <Option value="Mike Johnson">Mike Johnson</Option>
                  <Option value="John Smith">John Smith</Option>
                  <Option value="David Brown">David Brown</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="customerId" label="Customer">
                <Select placeholder="Select customer" allowClear>
                  {customers.map((customer) => (
                    <Option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.company}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingDeal(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingDeal ? "Update Deal" : "Create Deal"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
