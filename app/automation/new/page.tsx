'use client';

import { Form, Input, Select, Switch, Button } from 'antd';
import { useTranslations } from 'next-intl';

export default function NewAutomationPage() {
  const t = useTranslations('automation');

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
      <Form.Item name="trigger" label={t('trigger')} rules={[{ required: true }]}> 
        <Select options={[{ value: 'close', label: 'After Ticket Closed' }]} />
      </Form.Item>
      <Form.Item name="action" label={t('action')} rules={[{ required: true }]}> 
        <Select options={[{ value: 'email', label: 'Send Email' }]} />
      </Form.Item>
      <Form.Item name="conditions" label={t('conditions')}>
        <Input />
      </Form.Item>
      <Form.Item name="status" label={t('status')} valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">{t('create')}</Button>
      </Form.Item>
    </Form>
  );
}
