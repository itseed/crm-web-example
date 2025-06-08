import { ConfigProvider, Layout, Menu, Avatar, Space } from 'antd';
import Link from 'next/link';
import { NextIntlClientProvider, useMessages, useLocale, useTranslations } from 'next-intl';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { ReactNode } from 'react';
import themeConfig from '../theme/themeConfig';
import LanguageSwitcher from './components/LanguageSwitcher';
import '../globals.css';

const { Header, Sider, Content } = Layout;

export default function RootLayout({ children }: { children: ReactNode }) {
  const messages = useMessages();
  const locale = useLocale();
  const t = useTranslations('menu');

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AntdRegistry>
            <ConfigProvider theme={themeConfig}>
              <Layout style={{ minHeight: '100vh' }}>
                <Sider breakpoint="lg" collapsedWidth="0">
                  <div style={{ color: '#fff', padding: 16, fontWeight: 'bold' }}>CRM</div>
                  <Menu theme="dark" mode="inline">
                    <Menu.Item key="dashboard">
                      <Link href="/">{t('dashboard')}</Link>
                    </Menu.Item>
                    <Menu.Item key="customers">
                      <Link href="/customers">{t('customers')}</Link>
                    </Menu.Item>
                    <Menu.Item key="tickets">
                      <Link href="/tickets">{t('tickets')}</Link>
                    </Menu.Item>
                    <Menu.Item key="automation">
                      <Link href="/automation">{t('automation')}</Link>
                    </Menu.Item>
                    <Menu.Item key="leads">
                      <Link href="/leads">{t('leads')}</Link>
                    </Menu.Item>
                  </Menu>
                </Sider>
                <Layout>
                  <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div />
                    <Space>
                      <LanguageSwitcher />
                      <Avatar size="small">A</Avatar>
                    </Space>
                  </Header>
                  <Content style={{ margin: 16 }}>
                    {children}
                  </Content>
                </Layout>
              </Layout>
            </ConfigProvider>
          </AntdRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
