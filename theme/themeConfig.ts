import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    // Primary Colors - Modern Blue Gradient
    colorPrimary: "#4F46E5", // Indigo-600
    colorInfo: "#06B6D4", // Cyan-500
    colorSuccess: "#10B981", // Emerald-500
    colorWarning: "#F59E0B", // Amber-500
    colorError: "#EF4444", // Red-500

    // Background Colors
    colorBgBase: "#FFFFFF",
    colorBgContainer: "#FFFFFF",
    colorBgLayout: "#F8FAFC", // Slate-50
    colorBgElevated: "#FFFFFF",

    // Border and Line Colors
    colorBorder: "#E2E8F0", // Slate-200
    colorBorderSecondary: "#F1F5F9", // Slate-100

    // Text Colors
    colorText: "#1E293B", // Slate-800
    colorTextSecondary: "#64748B", // Slate-500
    colorTextTertiary: "#94A3B8", // Slate-400
    colorTextQuaternary: "#CBD5E1", // Slate-300

    // Component specific
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusXS: 4,

    // Shadow
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    boxShadowSecondary:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",

    // Font
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Motion
    motionDurationFast: "0.1s",
    motionDurationMid: "0.2s",
    motionDurationSlow: "0.3s",
  },
  components: {
    // Layout
    Layout: {
      headerBg: "#FFFFFF",
      headerHeight: 64,
      headerPadding: "0 24px",
      siderBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      bodyBg: "#F8FAFC",
    },

    // Menu
    Menu: {
      itemBg: "transparent",
      itemColor: "#FFFFFF",
      itemHoverBg: "rgba(255, 255, 255, 0.1)",
      itemHoverColor: "#FFFFFF",
      itemSelectedBg: "rgba(255, 255, 255, 0.2)",
      itemSelectedColor: "#FFFFFF",
      iconSize: 16,
      fontSize: 14,
      itemHeight: 48,
      collapsedIconSize: 20,
    },

    // Button
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 500,
      primaryShadow: "0 4px 14px 0 rgba(79, 70, 229, 0.3)",
    },

    // Card
    Card: {
      borderRadiusLG: 12,
      headerBg: "transparent",
      paddingLG: 24,
      boxShadowTertiary:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    },

    // Input
    Input: {
      borderRadius: 8,
      controlHeight: 40,
      paddingInline: 12,
      activeBorderColor: "#4F46E5",
      hoverBorderColor: "#A5B4FC",
    },

    // Select
    Select: {
      borderRadius: 8,
      controlHeight: 40,
      optionActiveBg: "#F0F9FF",
      optionSelectedBg: "#EEF2FF",
    },

    // Table
    Table: {
      borderRadius: 8,
      headerBg: "#F8FAFC",
      headerColor: "#374151",
      headerSortActiveBg: "#F1F5F9",
      rowHoverBg: "#F8FAFC",
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
    },

    // Tag
    Tag: {
      borderRadiusSM: 6,
      fontSizeSM: 12,
      fontWeight: 500,
    },

    // Steps
    Steps: {
      titleLineHeight: 1.5,
      customIconSize: 32,
      customIconTop: 0,
      iconSize: 24,
      iconFontSize: 14,
    },

    // Statistic
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 28,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },

    // Typography
    Typography: {
      titleMarginBottom: "0.5em",
      titleMarginTop: "1.2em",
    },

    // Avatar
    Avatar: {
      borderRadius: 8,
      containerSize: 40,
      containerSizeLG: 48,
      containerSizeSM: 32,
    },

    // Badge
    Badge: {
      borderRadius: 10,
      fontWeight: 500,
      fontSize: 12,
    },

    // Progress
    Progress: {
      circleTextFontSize: "1em",
      defaultColor: "#4F46E5",
    },

    // Tabs
    Tabs: {
      borderRadius: 8,
      itemActiveColor: "#4F46E5",
      itemHoverColor: "#6366F1",
      itemSelectedColor: "#4F46E5",
      inkBarColor: "#4F46E5",
      cardBg: "#FFFFFF",
    },

    // Modal
    Modal: {
      borderRadiusLG: 16,
      headerBg: "#FFFFFF",
      contentBg: "#FFFFFF",
      paddingContentHorizontalLG: 32,
      paddingMD: 24,
    },

    // Drawer
    Drawer: {
      borderRadiusLG: 16,
      paddingLG: 24,
    },

    // Form
    Form: {
      labelFontSize: 14,
      labelColor: "#374151",
      itemMarginBottom: 20,
    },

    // DatePicker
    DatePicker: {
      borderRadius: 8,
      controlHeight: 40,
      activeBorderColor: "#4F46E5",
      hoverBorderColor: "#A5B4FC",
    },

    // Upload
    Upload: {
      borderRadius: 8,
    },

    // Switch
    Switch: {
      borderRadius: 100,
      handleSize: 20,
      trackHeight: 24,
      trackMinWidth: 48,
    },

    // Radio & Checkbox
    Radio: {
      borderRadius: 4,
      radioSize: 16,
      dotSize: 8,
    },

    Checkbox: {
      borderRadiusSM: 4,
      controlInteractiveSize: 16,
    },

    // Notification
    Notification: {
      borderRadiusLG: 12,
      paddingMD: 20,
    },

    // Message
    Message: {
      borderRadiusLG: 12,
      paddingMD: 16,
    },
  },
  algorithm: undefined, // Default algorithm for light theme
};

export default themeConfig;
