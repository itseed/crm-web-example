import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal"
    | "negotiation"
    | "closed-won"
    | "closed-lost";
  score: number;
  value: number;
  lastContact: string;
  nextFollowUp: string;
  assignedTo: string;
  tags: string[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: "active" | "inactive" | "prospect";
  totalValue: number;
  lastActivity: string;
  tags: string[];
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type:
      | "lead_created"
      | "lead_status_changed"
      | "customer_inactive"
      | "ticket_created"
      | "deal_won"
      | "deal_lost"
      | "time_based";
    conditions: Record<string, any>;
  };
  actions: {
    type:
      | "send_email"
      | "create_task"
      | "update_lead_score"
      | "assign_to"
      | "add_tag"
      | "send_sms"
      | "create_follow_up";
    parameters: Record<string, any>;
  }[];
  active: boolean;
  createdAt: string;
  lastRun?: string;
  runCount: number;
}

export interface Activity {
  id: string;
  type:
    | "email"
    | "call"
    | "meeting"
    | "note"
    | "task"
    | "deal_created"
    | "deal_won"
    | "ticket_created";
  title: string;
  description: string;
  entityType: "lead" | "customer" | "ticket";
  entityId: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: {
    id: string;
    name: string;
    order: number;
    probability: number;
  }[];
  deals: Deal[];
}

export interface Deal {
  id: string;
  title: string;
  leadId?: string;
  customerId?: string;
  value: number;
  probability: number;
  stage: string;
  expectedCloseDate: string;
  assignedTo: string;
  tags: string[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

interface CRMStore {
  // Data
  leads: Lead[];
  customers: Customer[];
  tickets: Ticket[];
  automationRules: AutomationRule[];
  activities: Activity[];
  pipelines: Pipeline[];
  deals: Deal[];

  // Lead management
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "updatedAt">) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  updateLeadScore: (id: string, score: number) => void;
  convertLeadToCustomer: (leadId: string) => void;

  // Customer management
  addCustomer: (
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Ticket management
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;

  // Automation
  addAutomationRule: (
    rule: Omit<AutomationRule, "id" | "createdAt" | "runCount">
  ) => void;
  updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => void;
  deleteAutomationRule: (id: string) => void;
  triggerAutomation: (triggerId: string, data: any) => void;

  // Activity tracking
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => void;

  // Pipeline management
  addPipeline: (pipeline: Omit<Pipeline, "id">) => void;
  updatePipeline: (id: string, updates: Partial<Pipeline>) => void;
  addDeal: (deal: Omit<Deal, "id" | "createdAt" | "updatedAt">) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  moveDealToStage: (dealId: string, stageId: string) => void;

  // Analytics
  getLeadsByStatus: () => Record<string, number>;
  getConversionRate: () => number;
  getAverageLeadScore: () => number;
  getTicketsByStatus: () => Record<string, number>;
  getDealsByStage: () => Record<string, number>;
  getRevenueByMonth: () => { month: string; revenue: number }[];
}

export const useCRM = create<CRMStore>()(
  persist(
    (set, get) => ({
      // Initial data
      leads: [],
      customers: [],
      tickets: [],
      automationRules: [],
      activities: [],
      pipelines: [
        {
          id: "1",
          name: "Sales Pipeline",
          stages: [
            { id: "lead", name: "Lead", order: 1, probability: 10 },
            { id: "qualified", name: "Qualified", order: 2, probability: 25 },
            { id: "proposal", name: "Proposal", order: 3, probability: 50 },
            {
              id: "negotiation",
              name: "Negotiation",
              order: 4,
              probability: 75,
            },
            {
              id: "closed-won",
              name: "Closed Won",
              order: 5,
              probability: 100,
            },
            {
              id: "closed-lost",
              name: "Closed Lost",
              order: 6,
              probability: 0,
            },
          ],
          deals: [],
        },
      ],
      deals: [],

      // Lead management
      addLead: (lead) => {
        const newLead: Lead = {
          ...lead,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          leads: [...state.leads, newLead],
        }));

        // Add activity
        get().addActivity({
          type: "deal_created",
          title: "New lead created",
          description: `Lead ${newLead.name} was created`,
          entityType: "lead",
          entityId: newLead.id,
          userId: "1",
          userName: "System",
        });

        // Trigger automation
        get().triggerAutomation("lead_created", newLead);
      },

      updateLead: (id, updates) => {
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id
              ? { ...lead, ...updates, updatedAt: new Date().toISOString() }
              : lead
          ),
        }));

        if (updates.status) {
          get().triggerAutomation("lead_status_changed", { id, ...updates });
        }
      },

      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        }));
      },

      updateLeadScore: (id, score) => {
        get().updateLead(id, { score });
      },

      convertLeadToCustomer: (leadId) => {
        const lead = get().leads.find((l) => l.id === leadId);
        if (lead) {
          const customer: Omit<Customer, "id" | "createdAt" | "updatedAt"> = {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            company: lead.company,
            industry: "General",
            status: "active",
            totalValue: lead.value,
            lastActivity: new Date().toISOString(),
            tags: lead.tags,
            assignedTo: lead.assignedTo,
          };
          get().addCustomer(customer);
          get().deleteLead(leadId);
        }
      },

      // Customer management
      addCustomer: (customer) => {
        const newCustomer: Customer = {
          ...customer,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          customers: [...state.customers, newCustomer],
        }));
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
              : customer
          ),
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        }));
      },

      // Ticket management
      addTicket: (ticket) => {
        const newTicket: Ticket = {
          ...ticket,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          tickets: [...state.tickets, newTicket],
        }));

        get().triggerAutomation("ticket_created", newTicket);
      },

      updateTicket: (id, updates) => {
        set((state) => ({
          tickets: state.tickets.map((ticket) =>
            ticket.id === id
              ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
              : ticket
          ),
        }));
      },

      deleteTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.filter((ticket) => ticket.id !== id),
        }));
      },

      // Automation
      addAutomationRule: (rule) => {
        const newRule: AutomationRule = {
          ...rule,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          runCount: 0,
        };
        set((state) => ({
          automationRules: [...state.automationRules, newRule],
        }));
      },

      updateAutomationRule: (id, updates) => {
        set((state) => ({
          automationRules: state.automationRules.map((rule) =>
            rule.id === id ? { ...rule, ...updates } : rule
          ),
        }));
      },

      deleteAutomationRule: (id) => {
        set((state) => ({
          automationRules: state.automationRules.filter(
            (rule) => rule.id !== id
          ),
        }));
      },

      triggerAutomation: (triggerId, data) => {
        const rules = get().automationRules.filter(
          (rule) => rule.active && rule.trigger.type === triggerId
        );

        rules.forEach((rule) => {
          // Execute automation actions
          rule.actions.forEach((action) => {
            switch (action.type) {
              case "send_email":
                console.log("Sending email:", action.parameters);
                break;
              case "update_lead_score":
                if (data.id) {
                  get().updateLeadScore(data.id, action.parameters.score);
                }
                break;
              case "add_tag":
                // Implementation for adding tags
                break;
            }
          });

          // Update rule run count
          get().updateAutomationRule(rule.id, {
            runCount: rule.runCount + 1,
            lastRun: new Date().toISOString(),
          });
        });
      },

      // Activity tracking
      addActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          activities: [...state.activities, newActivity],
        }));
      },

      // Pipeline management
      addPipeline: (pipeline) => {
        const newPipeline: Pipeline = {
          ...pipeline,
          id: Date.now().toString(),
        };
        set((state) => ({
          pipelines: [...state.pipelines, newPipeline],
        }));
      },

      updatePipeline: (id, updates) => {
        set((state) => ({
          pipelines: state.pipelines.map((pipeline) =>
            pipeline.id === id ? { ...pipeline, ...updates } : pipeline
          ),
        }));
      },

      addDeal: (deal) => {
        const newDeal: Deal = {
          ...deal,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          deals: [...state.deals, newDeal],
        }));
      },

      updateDeal: (id, updates) => {
        set((state) => ({
          deals: state.deals.map((deal) =>
            deal.id === id
              ? { ...deal, ...updates, updatedAt: new Date().toISOString() }
              : deal
          ),
        }));
      },

      moveDealToStage: (dealId, stageId) => {
        get().updateDeal(dealId, { stage: stageId });
      },

      // Analytics
      getLeadsByStatus: () => {
        const leads = get().leads;
        return leads.reduce((acc, lead) => {
          acc[lead.status] = (acc[lead.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      },

      getConversionRate: () => {
        const leads = get().leads;
        const customers = get().customers;
        const totalLeads = leads.length;
        const convertedLeads = customers.length;
        return totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      },

      getAverageLeadScore: () => {
        const leads = get().leads;
        if (leads.length === 0) return 0;
        const totalScore = leads.reduce((sum, lead) => sum + lead.score, 0);
        return totalScore / leads.length;
      },

      getTicketsByStatus: () => {
        const tickets = get().tickets;
        return tickets.reduce((acc, ticket) => {
          acc[ticket.status] = (acc[ticket.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      },

      getDealsByStage: () => {
        const deals = get().deals;
        return deals.reduce((acc, deal) => {
          acc[deal.stage] = (acc[deal.stage] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      },

      getRevenueByMonth: () => {
        const deals = get().deals.filter((deal) => deal.stage === "closed-won");
        const revenueByMonth: Record<string, number> = {};

        deals.forEach((deal) => {
          const month = new Date(deal.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          });
          revenueByMonth[month] = (revenueByMonth[month] || 0) + deal.value;
        });

        return Object.entries(revenueByMonth).map(([month, revenue]) => ({
          month,
          revenue,
        }));
      },
    }),
    {
      name: "crm-storage",
    }
  )
);
