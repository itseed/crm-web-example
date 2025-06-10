"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Select,
  Typography,
  Badge,
  Avatar,
  Space,
  Tabs,
  Tag,
  Table,
  Modal,
  Form,
  Upload,
  Rate,
  Statistic,
  Progress,
  Divider,
} from "antd";
import {
  BookOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOutlined,
  FileTextOutlined,
  TagOutlined,
  TeamOutlined,
  StarOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
  UserOutlined,
  BarChartOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published" | "archived";
  visibility: "public" | "internal" | "restricted";
  views: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  attachments: { name: string; size: string; type: string }[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
  color: string;
}

export default function KnowledgeBasePage() {
  const t = useTranslations("knowledgeBase");

  const [activeTab, setActiveTab] = useState("articles");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);

  // Mock data
  const [articles, setArticles] = useState<Article[]>([
    {
      id: "1",
      title: "Getting Started with CRM",
      content: "Complete guide on how to use our CRM system effectively...",
      excerpt: "Learn the basics of navigating and using the CRM system.",
      category: "User Guide",
      tags: ["beginner", "setup", "tutorial"],
      author: "Sarah Johnson",
      status: "published",
      visibility: "public",
      views: 1234,
      rating: 4.8,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      attachments: [{ name: "setup-guide.pdf", size: "2.3 MB", type: "PDF" }],
    },
    {
      id: "2",
      title: "Advanced Automation Workflows",
      content: "Deep dive into creating complex automation workflows...",
      excerpt: "Master advanced automation techniques for better efficiency.",
      category: "Advanced",
      tags: ["automation", "workflow", "advanced"],
      author: "Mike Chen",
      status: "published",
      visibility: "internal",
      views: 567,
      rating: 4.6,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
      attachments: [],
    },
    {
      id: "3",
      title: "API Integration Best Practices",
      content: "How to properly integrate third-party APIs...",
      excerpt: "Learn best practices for API integrations and troubleshooting.",
      category: "Technical",
      tags: ["api", "integration", "development"],
      author: "David Wilson",
      status: "draft",
      visibility: "restricted",
      views: 89,
      rating: 4.9,
      createdAt: "2024-01-22",
      updatedAt: "2024-01-22",
      attachments: [
        { name: "api-examples.zip", size: "5.7 MB", type: "ZIP" },
        { name: "integration-flowchart.png", size: "1.2 MB", type: "Image" },
      ],
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "User Guide",
      description: "Basic user documentation",
      icon: "📖",
      articleCount: 25,
      color: "blue",
    },
    {
      id: "2",
      name: "Advanced",
      description: "Advanced features and techniques",
      icon: "🚀",
      articleCount: 18,
      color: "purple",
    },
    {
      id: "3",
      name: "Technical",
      description: "Technical documentation and APIs",
      icon: "⚙️",
      articleCount: 12,
      color: "green",
    },
    {
      id: "4",
      name: "Troubleshooting",
      description: "Common issues and solutions",
      icon: "🔧",
      articleCount: 8,
      color: "orange",
    },
  ]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesTag =
      selectedTag === "all" || article.tags.includes(selectedTag);
    const matchesStatus =
      statusFilter === "all" || article.status === statusFilter;

    return matchesSearch && matchesCategory && matchesTag && matchesStatus;
  });

  const allTags = Array.from(
    new Set(articles.flatMap((article) => article.tags))
  );

  const articleColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Article) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.excerpt}
          </Text>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => (
        <Tag color="blue" icon={<FolderOutlined />}>
          {category}
        </Tag>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (author: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {author}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap = {
          published: "green",
          draft: "orange",
          archived: "red",
        };
        return (
          <Badge
            color={colorMap[status as keyof typeof colorMap]}
            text={status}
          />
        );
      },
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      render: (views: number) => (
        <Space>
          <EyeOutlined />
          {views.toLocaleString()}
        </Space>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => (
        <Space>
          <Rate disabled value={rating} style={{ fontSize: "12px" }} />
          <Text>{rating}</Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Article) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => setViewingArticle(record)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingArticle(record);
              setShowArticleModal(true);
            }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setArticles(articles.filter((a) => a.id !== record.id));
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Title
              level={1}
              style={{ color: "white", margin: 0, fontSize: "32px" }}
            >
              📚 Knowledge Base
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}>
              Manage articles, documentation, and knowledge resources
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingArticle(null);
              setShowArticleModal(true);
            }}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            Create Article
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Articles"
              value={articles.length}
              prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Views"
              value={articles.reduce((sum, article) => sum + article.views, 0)}
              prefix={<EyeOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Categories"
              value={categories.length}
              prefix={<FolderOutlined style={{ color: "#722ed1" }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Rating"
              value={
                articles.length > 0
                  ? (
                      articles.reduce(
                        (sum, article) => sum + article.rating,
                        0
                      ) / articles.length
                    ).toFixed(1)
                  : "0"
              }
              prefix={<StarOutlined style={{ color: "#faad14" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "articles",
              label: (
                <span>
                  <FileTextOutlined />
                  Articles
                </span>
              ),
              children: (
                <div>
                  {/* Filters */}
                  <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
                    <Col xs={24} sm={12} md={8}>
                      <Search
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        prefix={<SearchOutlined />}
                      />
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                      <Select
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        style={{ width: "100%" }}
                        placeholder="Category"
                      >
                        <Option value="all">All Categories</Option>
                        {categories.map((category) => (
                          <Option key={category.id} value={category.name}>
                            {category.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                      <Select
                        value={selectedTag}
                        onChange={setSelectedTag}
                        style={{ width: "100%" }}
                        placeholder="Tag"
                      >
                        <Option value="all">All Tags</Option>
                        {allTags.map((tag) => (
                          <Option key={tag} value={tag}>
                            {tag}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={12} md={4}>
                      <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        style={{ width: "100%" }}
                        placeholder="Status"
                      >
                        <Option value="all">All Status</Option>
                        <Option value="published">Published</Option>
                        <Option value="draft">Draft</Option>
                        <Option value="archived">Archived</Option>
                      </Select>
                    </Col>
                  </Row>

                  {/* Articles Table */}
                  <Table
                    columns={articleColumns}
                    dataSource={filteredArticles}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} articles`,
                    }}
                  />
                </div>
              ),
            },
            {
              key: "categories",
              label: (
                <span>
                  <FolderOutlined />
                  Categories
                </span>
              ),
              children: (
                <div>
                  <Row gutter={[24, 24]}>
                    {categories.map((category) => (
                      <Col xs={24} sm={12} lg={8} xl={6} key={category.id}>
                        <Card
                          actions={[
                            <EditOutlined key="edit" />,
                            <DeleteOutlined key="delete" />,
                          ]}
                        >
                          <Card.Meta
                            avatar={
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  borderRadius: "8px",
                                  background: `linear-gradient(135deg, ${
                                    category.color === "blue"
                                      ? "#1890ff"
                                      : category.color === "purple"
                                      ? "#722ed1"
                                      : category.color === "green"
                                      ? "#52c41a"
                                      : "#faad14"
                                  } 0%, ${
                                    category.color === "blue"
                                      ? "#40a9ff"
                                      : category.color === "purple"
                                      ? "#9254de"
                                      : category.color === "green"
                                      ? "#73d13d"
                                      : "#ffc53d"
                                  } 100%)`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "20px",
                                }}
                              >
                                {category.icon}
                              </div>
                            }
                            title={category.name}
                            description={
                              <div>
                                <Text type="secondary">
                                  {category.description}
                                </Text>
                                <br />
                                <Text type="secondary">
                                  {category.articleCount} articles
                                </Text>
                              </div>
                            }
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Article Modal */}
      <Modal
        title={editingArticle ? "Edit Article" : "Create New Article"}
        open={showArticleModal}
        onCancel={() => {
          setShowArticleModal(false);
          setEditingArticle(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setShowArticleModal(false);
              setEditingArticle(null);
            }}
          >
            Cancel
          </Button>,
          <Button key="submit" type="primary">
            {editingArticle ? "Update Article" : "Create Article"}
          </Button>,
        ]}
        width={800}
      >
        <Form layout="vertical">
          <Form.Item label="Title" required>
            <Input
              placeholder="Enter article title"
              defaultValue={editingArticle?.title}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Category" required>
                <Select placeholder="Select category" style={{ width: "100%" }}>
                  {categories.map((category) => (
                    <Option key={category.id} value={category.name}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status" required>
                <Select placeholder="Select status" style={{ width: "100%" }}>
                  <Option value="draft">Draft</Option>
                  <Option value="published">Published</Option>
                  <Option value="archived">Archived</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Excerpt" required>
            <Input.TextArea
              rows={2}
              placeholder="Brief description of the article"
              defaultValue={editingArticle?.excerpt}
            />
          </Form.Item>

          <Form.Item label="Content" required>
            <Input.TextArea
              rows={8}
              placeholder="Article content"
              defaultValue={editingArticle?.content}
            />
          </Form.Item>

          <Form.Item label="Tags">
            <Input
              placeholder="Enter tags separated by commas"
              defaultValue={editingArticle?.tags.join(", ")}
            />
          </Form.Item>

          <Form.Item label="Attachments">
            <Upload.Dragger>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag files to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for PDF, images, and other document formats
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Article Modal */}
      <Modal
        title="Article Details"
        open={!!viewingArticle}
        onCancel={() => setViewingArticle(null)}
        footer={[
          <Button key="close" onClick={() => setViewingArticle(null)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewingArticle && (
          <div>
            <div style={{ marginBottom: "24px" }}>
              <Title level={3}>{viewingArticle.title}</Title>
              <Space split={<Divider type="vertical" />}>
                <Text type="secondary">By {viewingArticle.author}</Text>
                <Text type="secondary">{viewingArticle.category}</Text>
                <Text type="secondary">{viewingArticle.views} views</Text>
                <Space>
                  <Rate
                    disabled
                    value={viewingArticle.rating}
                    style={{ fontSize: "12px" }}
                  />
                  <Text type="secondary">{viewingArticle.rating}</Text>
                </Space>
              </Space>
            </div>

            <Paragraph style={{ fontSize: "16px", color: "#666" }}>
              {viewingArticle.excerpt}
            </Paragraph>

            <Divider />

            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
              {viewingArticle.content}
            </div>

            {viewingArticle.attachments.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <Title level={5}>
                  <DownloadOutlined /> Attachments
                </Title>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {viewingArticle.attachments.map((attachment, index) => (
                    <Card key={index} size="small">
                      <Space>
                        <FileTextOutlined />
                        <div>
                          <Text strong>{attachment.name}</Text>
                          <br />
                          <Text type="secondary">
                            {attachment.type} • {attachment.size}
                          </Text>
                        </div>
                        <Button
                          type="link"
                          icon={<DownloadOutlined />}
                          style={{ marginLeft: "auto" }}
                        >
                          Download
                        </Button>
                      </Space>
                    </Card>
                  ))}
                </Space>
              </div>
            )}

            <div style={{ marginTop: "24px" }}>
              <Text type="secondary">
                <TagOutlined /> Tags:{" "}
              </Text>
              <Space wrap>
                {viewingArticle.tags.map((tag) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
