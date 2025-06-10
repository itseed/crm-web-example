import { NextIntlClientProvider } from "next-intl";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { ReactNode } from "react";
import { getMessages } from "next-intl/server";
import ClientLayout from "../components/ClientLayout";

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AntdRegistry>
        <ClientLayout>{children}</ClientLayout>
      </AntdRegistry>
    </NextIntlClientProvider>
  );
}
