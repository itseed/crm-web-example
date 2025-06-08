'use client';

import { Form, Input, Button, Select, Upload } from 'antd';
import { useTranslations } from 'next-intl';

export default function NewTicketPage() {
  const t = useTranslations('tickets');

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <Form layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
      <Form.Item name="customer" label={t('customer')} rules={[{ required: true }]}> 
        <Select options={[{ value: '1', label: 'John Brown' }]} />
      </Form.Item>
      <Form.Item name="issue" label={t('issue')} rules={[{ required: true }]}> 
        <Input />
      </Form.Item>
      <Form.Item name="description" label={t('description')}> 
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item name="file" label={t('attachment')} valuePropName="fileList">
        <Upload beforeUpload={() => false}>
          <Button>{t('upload')}</Button>
        </Upload>
      </Form.Item>
      <Form.Item name="assignedTo" label={t('assignedTo')}> 
        <Select options={[{ value: 'Jane', label: 'Jane' }]} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t('create')}
        </Button>
      </Form.Item>
    </Form>
  );
}
