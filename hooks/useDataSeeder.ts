import { useCRM } from "../store/useCRM";

export const useDataSeeder = () => {
  const {
    addLead,
    addCustomer,
    addTicket,
    addAutomationRule,
    addActivity,
    addDeal,
    leads,
    customers,
    tickets,
  } = useCRM();

  const seedSampleData = () => {
    // Only seed if no data exists
    if (leads.length > 0 || customers.length > 0 || tickets.length > 0) {
      return;
    }

    // Sample Leads
    const sampleLeads = [
      {
        name: "Alex Johnson",
        email: "alex.johnson@techcorp.com",
        phone: "+1 (555) 111-2222",
        company: "TechCorp Solutions",
        source: "Website",
        status: "new" as const,
        score: 85,
        value: 50000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedTo: "Sarah Wilson",
        tags: ["Enterprise", "Hot Lead"],
        notes: [
          "Interested in enterprise solution",
          "Decision maker confirmed",
        ],
      },
      {
        name: "Maria Rodriguez",
        email: "maria@startupinc.com",
        phone: "+1 (555) 333-4444",
        company: "StartupInc",
        source: "Cold Call",
        status: "contacted" as const,
        score: 65,
        value: 25000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedTo: "Mike Johnson",
        tags: ["Startup", "Software"],
        notes: ["Needs budget approval", "Very interested in features"],
      },
      {
        name: "David Chen",
        email: "david.chen@globaltech.com",
        phone: "+1 (555) 555-6666",
        company: "GlobalTech Ltd",
        source: "Referral",
        status: "qualified" as const,
        score: 92,
        value: 150000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedTo: "Sarah Wilson",
        tags: ["VIP", "Enterprise", "Referral"],
        notes: ["Ready to purchase", "Needs custom integration"],
      },
      {
        name: "Lisa Williams",
        email: "lisa@innovatetech.com",
        phone: "+1 (555) 777-8888",
        company: "InnovateTech",
        source: "Trade Show",
        status: "proposal" as const,
        score: 78,
        value: 75000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(
          Date.now() + 5 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedTo: "John Smith",
        tags: ["Mid-Market"],
        notes: ["Proposal sent", "Waiting for feedback"],
      },
      {
        name: "Robert Brown",
        email: "robert@futuresoft.com",
        phone: "+1 (555) 999-0000",
        company: "FutureSoft",
        source: "Email Campaign",
        status: "negotiation" as const,
        score: 88,
        value: 200000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(
          Date.now() + 1 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedTo: "Sarah Wilson",
        tags: ["Enterprise", "High Value"],
        notes: ["In final negotiations", "Price sensitive"],
      },
    ];

    // Sample Customers
    const sampleCustomers = [
      {
        name: "John Smith",
        email: "john.smith@acme.com",
        phone: "+1 (555) 123-4567",
        company: "Acme Corporation",
        industry: "Technology",
        status: "active" as const,
        totalValue: 125000,
        lastActivity: new Date().toISOString(),
        tags: ["VIP", "Enterprise"],
        assignedTo: "Sarah Wilson",
      },
      {
        name: "Emma Davis",
        email: "emma@digitalwave.com",
        phone: "+1 (555) 234-5678",
        company: "DigitalWave",
        industry: "Marketing",
        status: "active" as const,
        totalValue: 85000,
        lastActivity: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        tags: ["Regular Customer"],
        assignedTo: "Mike Johnson",
      },
      {
        name: "Michael Foster",
        email: "michael@cloudservices.com",
        phone: "+1 (555) 345-6789",
        company: "CloudServices Inc",
        industry: "Cloud Computing",
        status: "active" as const,
        totalValue: 250000,
        lastActivity: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
        tags: ["Enterprise", "High Value"],
        assignedTo: "Sarah Wilson",
      },
    ];

    // Sample Tickets
    const sampleTickets = [
      {
        customerId: "1",
        customerName: "John Smith",
        title: "Login Issues",
        description: "Unable to log into the system after password reset",
        status: "open" as const,
        priority: "high" as const,
        assignedTo: "Support Team",
        category: "Technical",
        tags: ["Login", "Password"],
      },
      {
        customerId: "2",
        customerName: "Emma Davis",
        title: "Feature Request",
        description: "Request for new reporting dashboard features",
        status: "in-progress" as const,
        priority: "medium" as const,
        assignedTo: "Product Team",
        category: "Feature Request",
        tags: ["Enhancement", "Dashboard"],
      },
      {
        customerId: "3",
        customerName: "Michael Foster",
        title: "Integration Support",
        description: "Need help with API integration setup",
        status: "resolved" as const,
        priority: "medium" as const,
        assignedTo: "Technical Support",
        category: "Integration",
        tags: ["API", "Integration"],
      },
    ];

    // Sample Automation Rules
    const sampleAutomationRules = [
      {
        name: "Welcome New Leads",
        trigger: {
          type: "lead_created" as const,
          conditions: {},
        },
        actions: [
          {
            type: "send_email" as const,
            parameters: { template: "welcome_lead" },
          },
        ],
        active: true,
      },
      {
        name: "Follow Up Qualified Leads",
        trigger: {
          type: "lead_status_changed" as const,
          conditions: { status: "qualified" },
        },
        actions: [
          {
            type: "create_follow_up" as const,
            parameters: { days: 1 },
          },
        ],
        active: true,
      },
      {
        name: "High Priority Ticket Alert",
        trigger: {
          type: "ticket_created" as const,
          conditions: { priority: "urgent" },
        },
        actions: [
          {
            type: "send_sms" as const,
            parameters: { message: "Urgent ticket created" },
          },
        ],
        active: true,
      },
    ];

    // Sample Deals
    const sampleDeals = [
      {
        title: "Acme Corp - Enterprise License",
        customerId: "1",
        value: 125000,
        probability: 90,
        stage: "negotiation",
        expectedCloseDate: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedTo: "Sarah Wilson",
        tags: ["Enterprise", "Annual License"],
        notes: ["Final contract review in progress"],
      },
      {
        title: "DigitalWave - Marketing Suite",
        customerId: "2",
        value: 45000,
        probability: 75,
        stage: "proposal",
        expectedCloseDate: new Date(
          Date.now() + 45 * 24 * 60 * 60 * 1000
        ).toISOString(),
        assignedTo: "Mike Johnson",
        tags: ["Marketing", "SaaS"],
        notes: ["Proposal submitted, awaiting response"],
      },
      {
        title: "CloudServices - Infrastructure Deal",
        customerId: "3",
        value: 200000,
        probability: 95,
        stage: "closed-won",
        expectedCloseDate: new Date().toISOString(),
        assignedTo: "Sarah Wilson",
        tags: ["Infrastructure", "Multi-year"],
        notes: ["Deal closed successfully"],
      },
    ];

    // Add sample data
    console.log("Seeding sample CRM data...");

    sampleLeads.forEach((lead) => addLead(lead));
    sampleCustomers.forEach((customer) => addCustomer(customer));
    sampleTickets.forEach((ticket) => addTicket(ticket));
    sampleAutomationRules.forEach((rule) => addAutomationRule(rule));
    sampleDeals.forEach((deal) => addDeal(deal));

    // Add sample activities
    const sampleActivities = [
      {
        type: "email" as const,
        title: "Welcome Email Sent",
        description: "Sent welcome email to new lead Alex Johnson",
        entityType: "lead" as const,
        entityId: "1",
        userId: "1",
        userName: "Sarah Wilson",
      },
      {
        type: "call" as const,
        title: "Follow-up Call",
        description: "Called Maria Rodriguez to discuss requirements",
        entityType: "lead" as const,
        entityId: "2",
        userId: "2",
        userName: "Mike Johnson",
      },
      {
        type: "meeting" as const,
        title: "Demo Scheduled",
        description: "Scheduled product demo with David Chen",
        entityType: "lead" as const,
        entityId: "3",
        userId: "1",
        userName: "Sarah Wilson",
      },
    ];

    sampleActivities.forEach((activity) => addActivity(activity));

    console.log("Sample data seeded successfully!");
  };

  return { seedSampleData };
};
