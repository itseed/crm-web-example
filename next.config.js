/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const path = require("path");

const nextConfig = {
  env: {
    _next_intl_trailing_slash: "false",
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/public": path.resolve(__dirname, "public"),
    };
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
