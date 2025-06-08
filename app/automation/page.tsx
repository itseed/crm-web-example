'use client';

import { Table, Switch, Button } from 'antd';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Rule {
  key: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
}

const data: Rule[] = [
  { key: '1', name: 'Follow up', trigger: 'After Ticket Closed', action: 'Send Email', active: true }
];

export default function AutomationPage() {
  const t = useTranslations('automation');

  const columns = [
    { title: t('ruleName'), dataIndex: 'name', key: 'name' },
    { title: t('trigger'), dataIndex: 'trigger', key: 'trigger' },
    { title: t('action'), dataIndex: 'action', key: 'action' },
    {
      title: t('status'),
      dataIndex: 'active',
      key: 'status',
      render: (value: boolean) => <Switch checked={value} />
    }
  ];

  return (
    <div>
      <Link href="/automation/new">
        <Button type="primary" style={{ marginBottom: 16 }}>{t('createRule')}</Button>
      </Link>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
