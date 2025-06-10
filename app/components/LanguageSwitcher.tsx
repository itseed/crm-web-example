"use client";

import { Select } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const onChange = (value: string) => {
    // Remove current locale from pathname and add new locale
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "") || "/";
    router.push(`/${value}${pathWithoutLocale}`);
  };

  return (
    <Select
      value={locale}
      onChange={onChange}
      options={[
        { value: "en", label: "EN" },
        { value: "th", label: "TH" },
      ]}
      style={{ width: 80 }}
      size="small"
    />
  );
}
