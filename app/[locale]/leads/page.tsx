"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card, Typography, Tag, Avatar, message, Button } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useCRM, Lead } from "../../../store/useCRM";

const { Title, Text } = Typography;

const LEAD_STATUSES = [
  { id: "new", label: "New", color: "#1890ff" },
  { id: "contacted", label: "Contacted", color: "#13c2c2" },
  { id: "qualified", label: "Qualified", color: "#52c41a" },
  { id: "proposal", label: "Proposal", color: "#faad14" },
  { id: "negotiation", label: "Negotiation", color: "#fa8c16" },
  { id: "closed-won", label: "Closed Won", color: "#722ed1" },
  { id: "closed-lost", label: "Closed Lost", color: "#ff4d4f" },
];

function getLeadsByStatus(leads: Lead[]) {
  const result: Record<string, Lead[]> = {};
  for (const status of LEAD_STATUSES) {
    result[status.id] = [];
  }
  for (const lead of leads) {
    if (result[lead.status]) {
      result[lead.status].push(lead);
    }
  }
  return result;
}

export default function LeadsKanbanPage() {
  const { leads, updateLead, addLead } = useCRM();

  const leadsByStatus = getLeadsByStatus(leads);

  const addSampleLeads = () => {
    const sampleLeads = [
      {
        name: "John Smith",
        email: "john.smith@company.com",
        phone: "+1-555-0101",
        company: "Tech Solutions Inc",
        source: "Website",
        status: "new" as const,
        score: 85,
        value: 50000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Sarah Wilson",
        tags: ["enterprise", "tech"],
        notes: ["Initial contact made"],
      },
      {
        name: "Jane Doe",
        email: "jane.doe@marketing.com",
        phone: "+1-555-0102",
        company: "Marketing Pro",
        source: "Referral",
        status: "contacted" as const,
        score: 75,
        value: 35000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Mike Johnson",
        tags: ["marketing", "agency"],
        notes: ["Follow-up scheduled"],
      },
      {
        name: "Bob Wilson",
        email: "bob.wilson@consulting.com",
        phone: "+1-555-0103",
        company: "Business Consulting",
        source: "LinkedIn",
        status: "qualified" as const,
        score: 90,
        value: 75000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "John Smith",
        tags: ["consulting", "enterprise"],
        notes: ["Qualified lead, ready for proposal"],
      },
      {
        name: "Alice Brown",
        email: "alice.brown@startup.com",
        phone: "+1-555-0104",
        company: "StartupXYZ",
        source: "Conference",
        status: "proposal" as const,
        score: 80,
        value: 25000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "David Brown",
        tags: ["startup", "tech"],
        notes: ["Proposal sent, waiting for response"],
      },
      {
        name: "Charlie Davis",
        email: "charlie.davis@enterprise.com",
        phone: "+1-555-0105",
        company: "Enterprise Corp",
        source: "Cold Call",
        status: "negotiation" as const,
        score: 95,
        value: 100000,
        lastContact: new Date().toISOString(),
        nextFollowUp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: "Sarah Wilson",
        tags: ["enterprise", "negotiation"],
        notes: ["In final negotiation phase"],
      },
    ];
    sampleLeads.forEach(lead => addLead(lead));
    message.success("เพิ่ม Lead ตัวอย่างสำเร็จ");
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    updateLead(draggableId, { status: destination.droppableId as Lead["status"] });
    message.success("เปลี่ยนสถานะ Lead สำเร็จ");
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Leads Kanban Board</Title>
        <div style={{ display: "flex", gap: 12 }}>
          <Button onClick={addSampleLeads}>Add Sample Leads</Button>
          <Button type="primary" href="#">Add Lead</Button>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: "flex", gap: 20, overflowX: "auto", minHeight: 600 }}>
          {LEAD_STATUSES.map((status) => (
            <Droppable droppableId={status.id} key={status.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minWidth: 320,
                    background: snapshot.isDraggingOver ? "#e6f7ff" : "#fafafa",
                    border: `2px solid ${status.color}`,
                    borderRadius: 12,
                    padding: 16,
                    transition: "background 0.2s",
                    boxShadow: snapshot.isDraggingOver ? "0 4px 16px rgba(24,144,255,0.08)" : undefined,
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <Title level={5} style={{ color: status.color, margin: 0 }}>{status.label}</Title>
                    <Text type="secondary">{leadsByStatus[status.id].length} leads</Text>
                  </div>
                  {leadsByStatus[status.id].map((lead, idx) => (
                    <Draggable 
                      draggableId={lead.id} 
                      index={idx} 
                      key={lead.id}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: 12,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                          }}
                        >
                          <Card
                            size="small"
                            style={{
                              border: `1.5px solid ${status.color}`,
                              borderRadius: 8,
                              background: snapshot.isDragging ? "#fffbe6" : "white",
                              boxShadow: snapshot.isDragging ? "0 4px 8px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.05)",
                              cursor: "grab",
                            }}
                            bodyStyle={{ padding: 12 }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <Avatar size="small" icon={<UserOutlined />} />
                              <Text strong>{lead.name}</Text>
                              <Tag color={status.color} style={{ marginLeft: "auto" }}>{lead.status}</Tag>
                            </div>
                            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                              <MailOutlined /> {lead.email}
                            </div>
                            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
                              <PhoneOutlined /> {lead.phone}
                            </div>
                            <div style={{ fontSize: 12, color: "#888" }}>
                              <b>Company:</b> {lead.company}
                            </div>
                            <div style={{ marginTop: 6 }}>
                              {lead.tags && lead.tags.map((tag) => (
                                <Tag key={tag} color="blue" style={{ fontSize: 10 }}>{tag}</Tag>
                              ))}
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {leadsByStatus[status.id].length === 0 && (
                    <div style={{ color: "#bbb", textAlign: "center", marginTop: 40, fontSize: 13 }}>
                      No leads
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
