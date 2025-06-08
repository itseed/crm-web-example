'use client';

import { Table, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import api from '../../utils/api';

interface Customer {
  key: string;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  lastActivity: string;
}

export default function CustomersPage() {
  const t = useTranslations('customers');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<Customer[]>([]);

  useEffect(() => {
    api.get('/api/customers').then((res) => setData(res.data));
  }, []);

  const filtered = data.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const columns: ColumnsType<Customer> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: t('phone'),
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: t('tags'),
      dataIndex: 'tags',
      key: 'tags',
      render: (tags) => tags.join(', ')
    },
    {
      title: t('lastActivity'),
      dataIndex: 'lastActivity',
      key: 'lastActivity'
    },
    {
      title: t('action'),
      key: 'action',
      render: () => <a>{t('view')}</a>
    }
  ];

  return (
    <div>
      <Input.Search
        placeholder={t('name')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table columns={columns} dataSource={filtered} />
    </div>
  );
}
