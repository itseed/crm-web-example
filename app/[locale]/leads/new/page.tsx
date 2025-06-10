"use client";

import {
  Form,
  Input,
  Select,
  Button,
  Card,
  InputNumber,
  DatePicker,
  Row,
  Col,
  Typography,
  message,
  Space,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCRM } from "../../../../store/useCRM";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

export default function NewLeadPage() {
  const t = useTranslations("leads");
  const router = useRouter();
  const { addLead } = useCRM();
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    const leadData = {
      ...values,
      nextFollowUp: values.nextFollowUp
        ? values.nextFollowUp.toISOString()
        : "",
      tags: values.tags || [],
      notes: values.notes ? [values.notes] : [],
    };

    addLead(leadData);
    message.success("Lead created successfully!");
    router.push("/leads");
  };

  const leadSources = [
    "Website",
    "Social Media",
    "Email Campaign",
    "Cold Call",
    "Referral",
    "Trade Show",
    "Advertisement",
    "Partner",
    "Other",
  ];

  const salesReps = [
    "John Smith",
    "Jane Doe",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>
        <Title level={2} style={{ margin: 0 }}>
          Add New Lead
        </Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: "new",
            score: 50,
            source: "Website",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter the lead name" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter full name"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter email address" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="email@example.com"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="+1 (555) 123-4567"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="company"
                label="Company"
                rules={[
                  { required: true, message: "Please enter company name" },
                ]}
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder="Company name"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="status"
                label="Lead Status"
                rules={[
                  { required: true, message: "Please select lead status" },
                ]}
              >
                <Select size="large" placeholder="Select status">
                  <Option value="new">New</Option>
                  <Option value="contacted">Contacted</Option>
                  <Option value="qualified">Qualified</Option>
                  <Option value="proposal">Proposal</Option>
                  <Option value="negotiation">Negotiation</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="source"
                label="Lead Source"
                rules={[
                  { required: true, message: "Please select lead source" },
                ]}
              >
                <Select size="large" placeholder="Select source">
                  {leadSources.map((source) => (
                    <Option key={source} value={source}>
                      {source}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="assignedTo"
                label="Assigned To"
                rules={[
                  { required: true, message: "Please assign to a sales rep" },
                ]}
              >
                <Select size="large" placeholder="Select sales rep">
                  {salesReps.map((rep) => (
                    <Option key={rep} value={rep}>
                      {rep}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item
                name="value"
                label="Estimated Value ($)"
                rules={[
                  { required: true, message: "Please enter estimated value" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
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
            <Col xs={24} md={8}>
              <Form.Item
                name="score"
                label="Lead Score (0-100)"
                rules={[{ required: true, message: "Please enter lead score" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  min={0}
                  max={100}
                  placeholder="50"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="nextFollowUp" label="Next Follow-up Date">
                <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  placeholder="Select date & time"
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Initial Notes">
            <TextArea
              rows={4}
              placeholder="Enter any initial notes about this lead..."
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => router.back()}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
              >
                Create Lead
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
