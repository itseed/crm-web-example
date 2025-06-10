"use client";

import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  Card,
  Steps,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  message,
  Alert,
  InputNumber,
  DatePicker,
  Checkbox,
} from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  PlayCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  BellOutlined,
  UserAddOutlined,
  TagOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useCRM } from "../../../../store/useCRM";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Step } = Steps;

export default function NewAutomationPage() {
  const t = useTranslations("automation");
  const { addAutomationRule } = useCRM();
  const router = useRouter();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const triggerOptions = [
    {
      value: "lead_created",
      label: "New Lead Created",
      description: "Triggers when a new lead is added to the system",
      icon: <UserAddOutlined />,
    },
    {
      value: "lead_status_changed",
      label: "Lead Status Changed",
      description:
        "Triggers when a lead status changes (e.g., qualified, lost)",
      icon: <PlayCircleOutlined />,
    },
    {
      value: "ticket_created",
      label: "Support Ticket Created",
      description: "Triggers when a new support ticket is created",
      icon: <BellOutlined />,
    },
    {
      value: "deal_won",
      label: "Deal Won",
      description: "Triggers when a deal is marked as won",
      icon: <PlayCircleOutlined />,
    },
    {
      value: "deal_lost",
      label: "Deal Lost",
      description: "Triggers when a deal is marked as lost",
      icon: <PlayCircleOutlined />,
    },
    {
      value: "customer_inactive",
      label: "Customer Inactive",
      description:
        "Triggers when a customer has been inactive for specified period",
      icon: <BellOutlined />,
    },
    {
      value: "time_based",
      label: "Time-based",
      description: "Triggers at specific times or intervals",
      icon: <PlayCircleOutlined />,
    },
  ];

  const actionOptions = [
    {
      value: "send_email",
      label: "Send Email",
      description: "Send automated email to customer or team member",
      icon: <MailOutlined />,
    },
    {
      value: "send_sms",
      label: "Send SMS",
      description: "Send SMS notification",
      icon: <PhoneOutlined />,
    },
    {
      value: "create_task",
      label: "Create Task",
      description: "Create a task for team member",
      icon: <BellOutlined />,
    },
    {
      value: "update_lead_score",
      label: "Update Lead Score",
      description: "Automatically adjust lead scoring",
      icon: <PlayCircleOutlined />,
    },
    {
      value: "assign_to",
      label: "Assign To User",
      description: "Automatically assign to specific team member",
      icon: <UserAddOutlined />,
    },
    {
      value: "add_tag",
      label: "Add Tag",
      description: "Add tags to leads or customers",
      icon: <TagOutlined />,
    },
    {
      value: "create_follow_up",
      label: "Create Follow-up",
      description: "Schedule automatic follow-up reminders",
      icon: <BellOutlined />,
    },
  ];

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const ruleData = {
        name: values.name,
        trigger: {
          type: selectedTrigger as
            | "lead_created"
            | "lead_status_changed"
            | "ticket_created"
            | "deal_won"
            | "deal_lost"
            | "customer_inactive"
            | "time_based",
          conditions: values.conditions || {},
        },
        actions: selectedActions.map((actionType) => ({
          type: actionType as
            | "send_email"
            | "create_task"
            | "update_lead_score"
            | "assign_to"
            | "add_tag"
            | "send_sms"
            | "create_follow_up",
          parameters: values[`${actionType}_params`] || {},
        })),
        active: values.active ?? true,
      };

      addAutomationRule(ruleData);
      message.success("Automation rule created successfully!");
      router.push("../automation");
    } catch (error) {
      message.error("Failed to create automation rule");
    } finally {
      setLoading(false);
    }
  };

  const renderTriggerStep = () => (
    <div>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <PlayCircleOutlined style={{ color: "white", fontSize: "28px" }} />
        </div>
        <Title level={3} style={{ marginBottom: "8px" }}>
          Select Trigger Event
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Choose what event will activate this automation workflow
        </Text>
      </div>

      <div style={{ marginTop: "32px" }}>
        <Form.Item
          name="triggerType"
          rules={[{ required: true, message: "Please select a trigger" }]}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {triggerOptions.map((option) => (
              <Card
                key={option.value}
                style={{
                  cursor: "pointer",
                  border:
                    selectedTrigger === option.value
                      ? "2px solid #4F46E5"
                      : "1px solid #E2E8F0",
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  background:
                    selectedTrigger === option.value ? "#F8FAFF" : "white",
                }}
                bodyStyle={{ padding: "20px" }}
                onClick={() => setSelectedTrigger(option.value)}
                hoverable
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background:
                        selectedTrigger === option.value
                          ? "#4F46E5"
                          : "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        color:
                          selectedTrigger === option.value
                            ? "white"
                            : "#64748B",
                        fontSize: "20px",
                      }}
                    >
                      {option.icon}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title
                      level={5}
                      style={{
                        marginBottom: "4px",
                        color:
                          selectedTrigger === option.value
                            ? "#4F46E5"
                            : "#1E293B",
                      }}
                    >
                      {option.label}
                    </Title>
                    <Text
                      type="secondary"
                      style={{ fontSize: "14px", lineHeight: "1.5" }}
                    >
                      {option.description}
                    </Text>
                  </div>
                  {selectedTrigger === option.value && (
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#4F46E5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "white",
                        }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Form.Item>

        {selectedTrigger === "customer_inactive" && (
          <Form.Item
            name={["conditions", "inactiveDays"]}
            label="Inactive for (days)"
          >
            <InputNumber min={1} max={365} placeholder="30" />
          </Form.Item>
        )}

        {selectedTrigger === "lead_status_changed" && (
          <Form.Item name={["conditions", "fromStatus"]} label="From Status">
            <Select placeholder="Select status">
              <Select.Option value="new">New</Select.Option>
              <Select.Option value="contacted">Contacted</Select.Option>
              <Select.Option value="qualified">Qualified</Select.Option>
              <Select.Option value="proposal">Proposal</Select.Option>
            </Select>
          </Form.Item>
        )}

        {selectedTrigger === "time_based" && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name={["conditions", "frequency"]} label="Frequency">
                <Select placeholder="Select frequency">
                  <Select.Option value="daily">Daily</Select.Option>
                  <Select.Option value="weekly">Weekly</Select.Option>
                  <Select.Option value="monthly">Monthly</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={["conditions", "time"]} label="Time">
                <DatePicker.TimePicker format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );

  const renderActionsStep = () => (
    <div>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <ThunderboltOutlined style={{ color: "white", fontSize: "28px" }} />
        </div>
        <Title level={3} style={{ marginBottom: "8px" }}>
          Choose Actions
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Select what happens when the trigger event occurs
        </Text>
      </div>

      <div style={{ marginTop: "32px" }}>
        <Form.Item
          name="actions"
          rules={[
            { required: true, message: "Please select at least one action" },
          ]}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {actionOptions.map((option) => (
              <Card
                key={option.value}
                style={{
                  cursor: "pointer",
                  border: selectedActions.includes(option.value)
                    ? "2px solid #10B981"
                    : "1px solid #E2E8F0",
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  background: selectedActions.includes(option.value)
                    ? "#F0FDF4"
                    : "white",
                }}
                bodyStyle={{ padding: "20px" }}
                onClick={() => {
                  if (selectedActions.includes(option.value)) {
                    setSelectedActions(
                      selectedActions.filter((a) => a !== option.value)
                    );
                  } else {
                    setSelectedActions([...selectedActions, option.value]);
                  }
                }}
                hoverable
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: selectedActions.includes(option.value)
                        ? "#10B981"
                        : "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        color: selectedActions.includes(option.value)
                          ? "white"
                          : "#64748B",
                        fontSize: "20px",
                      }}
                    >
                      {option.icon}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Title
                      level={5}
                      style={{
                        marginBottom: "4px",
                        color: selectedActions.includes(option.value)
                          ? "#10B981"
                          : "#1E293B",
                      }}
                    >
                      {option.label}
                    </Title>
                    <Text
                      type="secondary"
                      style={{ fontSize: "14px", lineHeight: "1.5" }}
                    >
                      {option.description}
                    </Text>
                  </div>
                  {selectedActions.includes(option.value) && (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "6px",
                        background: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "8px",
                          borderLeft: "2px solid white",
                          borderBottom: "2px solid white",
                          transform: "rotate(-45deg)",
                          marginTop: "-2px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Form.Item>

        {/* Action Parameters */}
        {selectedActions.includes("send_email") && (
          <Card
            title="Email Settings"
            size="small"
            style={{ marginTop: "16px" }}
          >
            <Form.Item
              name={["send_email_params", "template"]}
              label="Email Template"
            >
              <Select placeholder="Select template">
                <Select.Option value="welcome">Welcome Email</Select.Option>
                <Select.Option value="follow_up">Follow Up</Select.Option>
                <Select.Option value="thank_you">Thank You</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={["send_email_params", "recipient"]}
              label="Recipient"
            >
              <Select placeholder="Select recipient">
                <Select.Option value="customer">Customer</Select.Option>
                <Select.Option value="assigned_user">
                  Assigned User
                </Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
              </Select>
            </Form.Item>
          </Card>
        )}

        {selectedActions.includes("create_task") && (
          <Card
            title="Task Settings"
            size="small"
            style={{ marginTop: "16px" }}
          >
            <Form.Item
              name={["create_task_params", "title"]}
              label="Task Title"
            >
              <Input placeholder="Task title" />
            </Form.Item>
            <Form.Item
              name={["create_task_params", "assignTo"]}
              label="Assign To"
            >
              <Select placeholder="Select team member">
                <Select.Option value="sarah">Sarah Wilson</Select.Option>
                <Select.Option value="mike">Mike Johnson</Select.Option>
                <Select.Option value="john">John Smith</Select.Option>
              </Select>
            </Form.Item>
          </Card>
        )}

        {selectedActions.includes("add_tag") && (
          <Card title="Tag Settings" size="small" style={{ marginTop: "16px" }}>
            <Form.Item name={["add_tag_params", "tags"]} label="Tags to Add">
              <Select mode="tags" placeholder="Enter tags">
                <Select.Option value="hot_lead">Hot Lead</Select.Option>
                <Select.Option value="vip">VIP</Select.Option>
                <Select.Option value="follow_up">Follow Up</Select.Option>
              </Select>
            </Form.Item>
          </Card>
        )}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <SaveOutlined style={{ color: "white", fontSize: "28px" }} />
        </div>
        <Title level={3} style={{ marginBottom: "8px" }}>
          Rule Configuration
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Finalize your automation rule with a name and description
        </Text>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item
              name="name"
              label={
                <Text style={{ fontSize: "16px", fontWeight: "500" }}>
                  Rule Name
                </Text>
              }
              rules={[{ required: true, message: "Please enter rule name" }]}
            >
              <Input
                placeholder="Enter a descriptive name for this rule"
                size="large"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label={
                <Text style={{ fontSize: "16px", fontWeight: "500" }}>
                  Description
                </Text>
              }
            >
              <TextArea
                rows={4}
                placeholder="Describe what this automation rule does and when to use it"
                style={{ borderRadius: "8px" }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="active"
              valuePropName="checked"
              initialValue={true}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <Switch size="default" />
                <div>
                  <Text
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      display: "block",
                    }}
                  >
                    Activate Rule
                  </Text>
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    Enable this rule to start processing automation
                  </Text>
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Card
          style={{
            marginTop: "32px",
            background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
            border: "1px solid #C7D2FE",
            borderRadius: "12px",
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <PlayCircleOutlined
                style={{ color: "white", fontSize: "18px" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Title
                level={5}
                style={{ marginBottom: "8px", color: "#4F46E5" }}
              >
                Automation Summary
              </Title>
              <div style={{ marginBottom: "8px" }}>
                <Text style={{ fontWeight: "500" }}>Trigger: </Text>
                <Text>
                  {triggerOptions.find((t) => t.value === selectedTrigger)
                    ?.label || "Not selected"}
                </Text>
              </div>
              <div>
                <Text style={{ fontWeight: "500" }}>Actions: </Text>
                <Text>
                  {selectedActions.length > 0
                    ? selectedActions
                        .map(
                          (a) =>
                            actionOptions.find((opt) => opt.value === a)?.label
                        )
                        .join(", ")
                    : "None selected"}
                </Text>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const steps = [
    {
      title: "Trigger",
      content: renderTriggerStep(),
    },
    {
      title: "Actions",
      content: renderActionsStep(),
    },
    {
      title: "Details",
      content: renderDetailsStep(),
    },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{
            marginBottom: "24px",
            color: "#64748B",
            fontWeight: "500",
          }}
        >
          Back to Automation
        </Button>
        <Title
          level={2}
          style={{
            marginBottom: "8px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Create Automation Rule
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Build powerful automation workflows to streamline your business
          processes
        </Text>
      </div>

      {/* Main Card */}
      <Card
        style={{
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
        }}
        bodyStyle={{ padding: "40px" }}
      >
        {/* Progress Steps */}
        <Steps
          current={currentStep}
          style={{ marginBottom: "40px" }}
          items={[
            {
              title: <span style={{ fontWeight: "500" }}>Trigger</span>,
              description: "When to activate",
            },
            {
              title: <span style={{ fontWeight: "500" }}>Actions</span>,
              description: "What to do",
            },
            {
              title: <span style={{ fontWeight: "500" }}>Details</span>,
              description: "Final configuration",
            },
          ]}
        />

        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Step Content */}
          <div style={{ minHeight: "400px", marginBottom: "32px" }}>
            {steps[currentStep].content}
          </div>

          <Divider style={{ margin: "32px 0" }} />

          {/* Navigation Buttons */}
          <div style={{ textAlign: "right" }}>
            <Space size="middle">
              {currentStep > 0 && (
                <Button
                  size="large"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  style={{
                    borderRadius: "8px",
                    height: "48px",
                    paddingLeft: "24px",
                    paddingRight: "24px",
                    fontWeight: "500",
                  }}
                >
                  Previous
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 0 && !selectedTrigger) ||
                    (currentStep === 1 && selectedActions.length === 0)
                  }
                  style={{
                    borderRadius: "8px",
                    height: "48px",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                    fontWeight: "600",
                    boxShadow: "0 4px 16px rgba(79, 70, 229, 0.3)",
                  }}
                >
                  Next Step
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  style={{
                    borderRadius: "8px",
                    height: "48px",
                    paddingLeft: "32px",
                    paddingRight: "32px",
                    fontWeight: "600",
                    boxShadow: "0 4px 16px rgba(79, 70, 229, 0.3)",
                  }}
                >
                  Create Rule
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}
