import { Card, Col, Row } from 'antd';
import { UserOutlined, MailOutlined, ThunderboltOutlined, DollarOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12} lg={6}>
        <Card title={t('totalCustomers')} extra={<UserOutlined />}>123</Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card title={t('ticketsOpen')} extra={<MailOutlined />}>8</Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card title={t('campaigns')} extra={<ThunderboltOutlined />}>5</Card>
      </Col>
      <Col xs={24} md={12} lg={6}>
        <Card title={t('topSpenders')} extra={<DollarOutlined />}>Acme Corp</Card>
      </Col>
    </Row>
  );
}
