"use client";

import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Card,
  Row,
  Col,
  message,
  Typography,
  Space,
  Divider,
} from "antd";
import { useTranslations } from "next-intl";
import {
  UploadOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useCRM } from "../../../../store/useCRM";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Title } = Typography;
const { TextArea } = Input;

export default function NewTicketPage() {
  const t = useTranslations("tickets");
  const { customers, addTicket } = useCRM();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const ticketData = {
        title: values.title,
        description: values.description,
        customerId: values.customerId,
        customerName:
          customers.find((c) => c.id === values.customerId)?.name || "",
        priority: values.priority,
        category: values.category,
        assignedTo: values.assignedTo,
        status: "open" as const,
        tags: values.tags || [],
      };

      addTicket(ticketData);
      message.success("Ticket created successfully!");
      router.push("../tickets");
    } catch (error) {
      message.error("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const categoryOptions = [
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing" },
    { value: "feature_request", label: "Feature Request" },
    { value: "bug_report", label: "Bug Report" },
    { value: "account", label: "Account Management" },
    { value: "general", label: "General Inquiry" },
  ];

  const assigneeOptions = [
    { value: "Sarah Wilson", label: "Sarah Wilson" },
    { value: "Mike Johnson", label: "Mike Johnson" },
    { value: "John Smith", label: "John Smith" },
    { value: "David Brown", label: "David Brown" },
    { value: "Lisa Anderson", label: "Lisa Anderson" },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: "16px" }}
        >
          Back to Tickets
        </Button>
        <Title level={2}>Create New Support Ticket</Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            priority: "medium",
            category: "general",
            assignedTo: "Sarah Wilson",
          }}
        >
          <Row gutter={[24, 0]}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Ticket Title"
                rules={[
                  { required: true, message: "Please enter ticket title" },
                ]}
              >
                <Input
                  placeholder="Brief description of the issue"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="customerId"
                label="Customer"
                rules={[
                  { required: true, message: "Please select a customer" },
                ]}
              >
                <Select
                  placeholder="Select customer"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    ((option?.label as string) ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={customers.map((customer) => ({
                    value: customer.id,
                    label: `${customer.name} - ${customer.company}`,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select options={categoryOptions} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: "Please select priority" }]}
              >
                <Select options={priorityOptions} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="assignedTo"
                label="Assign To"
                rules={[
                  { required: true, message: "Please assign to someone" },
                ]}
              >
                <Select options={assigneeOptions} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Add tags"
                  options={[
                    { value: "urgent", label: "Urgent" },
                    { value: "vip", label: "VIP Customer" },
                    { value: "escalated", label: "Escalated" },
                    { value: "follow-up", label: "Follow Up" },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Please provide a detailed description",
                  },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Provide detailed information about the issue, including steps to reproduce, expected behavior, and any relevant context..."
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="attachments"
                label="Attachments"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) return e;
                  return e?.fileList;
                }}
              >
                <Upload.Dragger
                  name="files"
                  multiple
                  beforeUpload={() => false}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag files to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for images, PDFs, and documents. Maximum file size:
                    10MB
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={() => router.back()}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                Create Ticket
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
