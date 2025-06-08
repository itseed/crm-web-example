'use client';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Col, Row } from 'antd';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const initial = {
  new: [{ id: '1', name: 'Acme Corp', value: 5000, rep: 'Jane' }],
  contacted: [],
  quoted: [],
  won: [],
  lost: []
};

export default function LeadsPage() {
  const t = useTranslations('leads');
  const [columns, setColumns] = useState(initial);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const sourceCol = result.source.droppableId as keyof typeof columns;
    const destCol = result.destination.droppableId as keyof typeof columns;
    const item = columns[sourceCol][result.source.index];
    const newSource = Array.from(columns[sourceCol]);
    newSource.splice(result.source.index, 1);
    const newDest = Array.from(columns[destCol]);
    newDest.splice(result.destination.index, 0, item);
    setColumns({ ...columns, [sourceCol]: newSource, [destCol]: newDest });
  };

  const columnOrder: (keyof typeof columns)[] = ['new', 'contacted', 'quoted', 'won', 'lost'];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Row gutter={16}>
        {columnOrder.map((colKey) => (
          <Col key={colKey} span={4} style={{ minWidth: 200 }}>
            <h3>{t(colKey)}</h3>
            <Droppable droppableId={colKey}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: 100 }}>
                  {columns[colKey].map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(dragProvided) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          style={{ marginBottom: 8 }}
                        >
                          <Card size="small" title={lead.name}>
                            <p>{t('value')}: {lead.value}</p>
                            <p>{t('assigned')}: {lead.rep}</p>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Col>
        ))}
      </Row>
    </DragDropContext>
  );
}
