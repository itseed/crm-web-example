'use client';

import { Button, Table, Select, DatePicker, Space } from 'antd';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Ticket {
  key: string;
  caseId: string;
  customer: string;
  status: string;
  issue: string;
  assignedTo: string;
  createdAt: string;
}

const data: Ticket[] = [
  {
    key: '1',
    caseId: 'C001',
    customer: 'John Brown',
    status: 'Open',
    issue: 'Login issue',
    assignedTo: 'Jane',
    createdAt: '2024-05-01'
  }
];

export default function TicketsPage() {
  const t = useTranslations('tickets');
  const [status, setStatus] = useState<string>();

  const columns = [
    { title: t('caseId'), dataIndex: 'caseId', key: 'caseId' },
    { title: t('customer'), dataIndex: 'customer', key: 'customer' },
    { title: t('status'), dataIndex: 'status', key: 'status' },
    { title: t('issue'), dataIndex: 'issue', key: 'issue' },
    { title: t('assignedTo'), dataIndex: 'assignedTo', key: 'assignedTo' },
    { title: t('createdAt'), dataIndex: 'createdAt', key: 'createdAt' }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder={t('status')}
          allowClear
          value={status}
          onChange={(v) => setStatus(v)}
          options={[
            { value: 'Open', label: 'Open' },
            { value: 'Closed', label: 'Closed' }
          ]}
        />
        <DatePicker placeholder={t('date')} />
        <Link href="/tickets/new">
          <Button type="primary">{t('newTicket')}</Button>
        </Link>
      </Space>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
