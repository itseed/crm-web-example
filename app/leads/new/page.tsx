'use client';

import { Form, Input, Button, Select } from 'antd';
import { useTranslations } from 'next-intl';

export default function NewLeadPage() {
  const t = useTranslations('leads');

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
      <Form.Item name="name" label={t('name')} rules={[{ required: true }]}> 
        <Input />
      </Form.Item>
      <Form.Item name="contact" label={t('contact')}> 
        <Input />
      </Form.Item>
      <Form.Item name="source" label={t('source')}> 
        <Select options={[{ value: 'web', label: 'Website' }]} />
      </Form.Item>
      <Form.Item name="assignedTo" label={t('assigned')}> 
        <Select options={[{ value: 'Jane', label: 'Jane' }]} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">{t('create')}</Button>
      </Form.Item>
    </Form>
  );
}
