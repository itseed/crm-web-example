"use client";

import {
  Table,
  Switch,
  Button,
  Card,
  Space,
  Modal,
  Form,
  Select,
  Input,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Timeline,
} from "antd";
import {
  PlusOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCRM, AutomationRule } from "../../../store/useCRM";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

export default function AutomationPage() {
  const t = useTranslations("automation");
  const {
    automationRules,
    addAutomationRule,
    updateAutomationRule,
    deleteAutomationRule,
    activities,
  } = useCRM();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [form] = Form.useForm();

  const handleToggleRule = (id: string, active: boolean) => {
    updateAutomationRule(id, { active });
  };

  const handleCreateRule = (values: any) => {
    const ruleData = {
      name: values.name,
      trigger: {
        type: values.triggerType,
        conditions: values.conditions || {},
      },
      actions: [
        {
          type: values.actionType,
          parameters: values.actionParameters || {},
        },
      ],
      active: true,
    };

    if (editingRule) {
      updateAutomationRule(editingRule.id, ruleData);
    } else {
      addAutomationRule(ruleData);
    }

    setModalVisible(false);
    setEditingRule(null);
    form.resetFields();
  };

  const handleEditRule = (rule: AutomationRule) => {
    setEditingRule(rule);
    form.setFieldsValue({
      name: rule.name,
      triggerType: rule.trigger.type,
      conditions: rule.trigger.conditions,
      actionType: rule.actions[0]?.type,
      actionParameters: rule.actions[0]?.parameters,
    });
    setModalVisible(true);
  };

  const handleDeleteRule = (id: string) => {
    Modal.confirm({
      title: "Delete Automation Rule",
      content: "Are you sure you want to delete this automation rule?",
      onOk: () => deleteAutomationRule(id),
    });
  };

  const triggerTypes = [
    { value: "lead_created", label: "New Lead Created" },
    { value: "lead_status_changed", label: "Lead Status Changed" },
    { value: "customer_inactive", label: "Customer Inactive" },
    { value: "ticket_created", label: "New Ticket Created" },
    { value: "deal_won", label: "Deal Won" },
    { value: "deal_lost", label: "Deal Lost" },
    { value: "time_based", label: "Time-based Trigger" },
  ];

  const actionTypes = [
    { value: "send_email", label: "Send Email" },
    { value: "create_task", label: "Create Task" },
    { value: "update_lead_score", label: "Update Lead Score" },
    { value: "assign_to", label: "Assign To User" },
    { value: "add_tag", label: "Add Tag" },
    { value: "send_sms", label: "Send SMS" },
    { value: "create_follow_up", label: "Create Follow-up" },
  ];

  const columns = [
    {
      title: "Rule Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: AutomationRule) => (
        <div>
          <strong>{name}</strong>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Created: {new Date(record.createdAt).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      title: "Trigger",
      key: "trigger",
      render: (_, record: AutomationRule) => {
        const trigger = triggerTypes.find(
          (t) => t.value === record.trigger.type
        );
        return (
          <Tag color="blue" icon={<ThunderboltOutlined />}>
            {trigger?.label || record.trigger.type}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: AutomationRule) => (
        <div>
          {record.actions.map((action, index) => {
            const actionType = actionTypes.find((a) => a.value === action.type);
            return (
              <Tag key={index} color="green">
                {actionType?.label || action.type}
              </Tag>
            );
          })}
        </div>
      ),
    },
    {
      title: "Run Count",
      dataIndex: "runCount",
      key: "runCount",
      render: (count: number) => (
        <Statistic value={count} valueStyle={{ fontSize: "14px" }} />
      ),
    },
    {
      title: "Last Run",
      dataIndex: "lastRun",
      key: "lastRun",
      render: (lastRun: string) =>
        lastRun ? new Date(lastRun).toLocaleDateString() : "Never",
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "status",
      render: (active: boolean, record: AutomationRule) => (
        <Switch
          checked={active}
          onChange={(checked) => handleToggleRule(record.id, checked)}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: AutomationRule) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditRule(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRule(record.id)}
          />
        </Space>
      ),
    },
  ];

  const automationStats = {
    totalRules: automationRules.length,
    activeRules: automationRules.filter((rule) => rule.active).length,
    totalRuns: automationRules.reduce((sum, rule) => sum + rule.runCount, 0),
    recentActivity: activities.filter(
      (activity) => activity.type === "email" || activity.type === "task"
    ).length,
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
        <Title level={2}>Sales Automation</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
        >
          Create Automation Rule
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Rules"
              value={automationStats.totalRules}
              prefix={<SettingOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Rules"
              value={automationStats.activeRules}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Executions"
              value={automationStats.totalRuns}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Recent Activity"
              value={automationStats.recentActivity}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Automation Rules Table */}
      <Card title="Automation Rules">
        <Table
          columns={columns}
          dataSource={automationRules}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} rules`,
          }}
        />
      </Card>

      {/* Create/Edit Rule Modal */}
      <Modal
        title={editingRule ? "Edit Automation Rule" : "Create Automation Rule"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingRule(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateRule}>
          <Form.Item
            name="name"
            label="Rule Name"
            rules={[{ required: true, message: "Please enter a rule name" }]}
          >
            <Input placeholder="Enter descriptive rule name" />
          </Form.Item>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="triggerType"
                label="Trigger Event"
                rules={[{ required: true, message: "Please select a trigger" }]}
              >
                <Select placeholder="Select trigger event">
                  {triggerTypes.map((trigger) => (
                    <Option key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="actionType"
                label="Action to Take"
                rules={[{ required: true, message: "Please select an action" }]}
              >
                <Select placeholder="Select action">
                  {actionTypes.map((action) => (
                    <Option key={action.value} value={action.value}>
                      {action.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="conditions" label="Trigger Conditions (JSON)">
            <TextArea
              rows={3}
              placeholder='{"status": "qualified", "score": ">80"}'
            />
          </Form.Item>

          <Form.Item name="actionParameters" label="Action Parameters (JSON)">
            <TextArea
              rows={3}
              placeholder='{"template": "welcome_email", "assignTo": "sales_team"}'
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingRule(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingRule ? "Update Rule" : "Create Rule"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
