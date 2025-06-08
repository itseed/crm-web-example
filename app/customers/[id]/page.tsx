'use client';

import { Card, Tabs } from 'antd';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const t = useTranslations('customers');

  return (
    <div>
      <Card title={`${t('profile')}: ${id}`} style={{ marginBottom: 16 }}>
        <p>Email: example@example.com</p>
        <p>Phone: 0000000000</p>
        <p>Total Spend: $1000</p>
      </Card>
      <Tabs
        items={[
          { key: 'products', label: t('products'), children: <p>Product History</p> },
          { key: 'cases', label: t('cases'), children: <p>Service Cases</p> },
          { key: 'activities', label: t('activities'), children: <p>Activity Log</p> }
        ]}
      />
    </div>
  );
}
