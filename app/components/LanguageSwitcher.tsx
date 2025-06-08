'use client';

import { Select } from 'antd';
import { useRouter, usePathname } from 'next-intl/client';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const onChange = (value: string) => {
    router.push(pathname, { locale: value });
  };

  return (
    <Select
      value={locale}
      onChange={onChange}
      options={[
        { value: 'en', label: 'EN' },
        { value: 'th', label: 'TH' }
      ]}
      style={{ width: 80 }}
      size="small"
    />
  );
}
