# 🧠 Codex Prompt: CRM Frontend System

## 🎯 Goal
Generate a complete frontend codebase for a **multi-BU CRM system** that includes:
- Customer data management
- After-sales service
- Marketing automation
- Lead management
- Multi-language support (Thai/English)

---

## 🛠️ Tech Stack
- **Next.js 14+** (App Router)
- **Ant Design** (Custom theme color: `#E1DD00`)
- **next-intl** (for i18n with Thai/English)
- **Axios** (data fetching)
- **Zustand** (global state for auth/user/BU)

---

## 🗂️ Folder & File Structure

```
crm-frontend/
├── app/
│   ├── layout.tsx                    # Layout with sidebar, topbar, language switcher
│   ├── page.tsx                      # Dashboard page
│   ├── customers/
│   │   ├── page.tsx                  # Customer list
│   │   └── [id]/page.tsx             # Customer detail
│   ├── tickets/
│   │   ├── page.tsx                  # Service tickets
│   │   └── new/page.tsx              # New ticket form
│   ├── automation/
│   │   ├── page.tsx                  # Automation rule list
│   │   └── new/page.tsx              # Create rule
│   ├── leads/
│   │   ├── page.tsx                  # Sales pipeline
│   │   └── new/page.tsx              # Add new lead
├── public/locales/
│   ├── en/common.json
│   └── th/common.json
├── store/useAuth.ts                 # Zustand store
├── utils/api.ts                     # Axios instance
├── theme/themeConfig.ts            # Custom AntD theme
├── middleware.ts                   # Middleware for next-intl
├── next.config.js                  # i18n setup
└── codex-prompt.md                 # (this file)
```

---

## ✅ Requirements per Page

### 1. `/app/page.tsx` – Dashboard
- Ant Design Cards showing: Total Customers, Tickets Open, Campaigns, Top Spenders
- Responsive layout with Grid

### 2. `/app/customers/page.tsx`
- Table with: Name, Phone, Email, Tags, Last Activity, Action (View)
- Search by name/phone
- i18n text using `useTranslations('customers')`

### 3. `/app/customers/[id]/page.tsx`
- Customer Profile: name, contact info, products, service cases
- Tab view: product history, service history, activity log

### 4. `/app/tickets/page.tsx`
- Table of service tickets with filters by status/date/BU
- Action to create new ticket

### 5. `/app/tickets/new/page.tsx`
- Form with: Select customer, issue type, detail, file upload, assign staff

### 6. `/app/automation/page.tsx`
- List automation rules
- Show: Rule Name, Trigger, Action, Status toggle

### 7. `/app/automation/new/page.tsx`
- Rule builder: choose trigger, action, conditions
- Action types: send LINE/Email/Webhook

### 8. `/app/leads/page.tsx`
- Kanban board of leads: New → Contacted → Quoted → Won/Lost
- Card with: lead name, source, assigned, value

### 9. `/app/leads/new/page.tsx`
- Form: name, contact info, source, assign to

---

## 🌍 i18n
- Use `next-intl`
- Translation files:
  - `public/locales/en/common.json`
  - `public/locales/th/common.json`

---

## 💡 Tips for Codex Usage
- Start by scaffolding `layout.tsx` and `page.tsx`
- Use `/** instructions */` in each page for Copilot guidance
- Use `t('customer.name')` or `useTranslations('...')` for labels
