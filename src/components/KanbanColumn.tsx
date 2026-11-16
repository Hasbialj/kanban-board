import React from 'react';
import { IonButton, IonIcon, IonBadge } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Column } from '../types/kanban';
import TaskCard from './TaskCard';
import './KanbanColumn.css';

interface Props {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
}

const KanbanColumn: React.FC<Props> = ({ column, tasks, onAddTask, onTaskClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className={`kanban-column ${isOver ? 'column-over' : ''}`}>
      <div className="column-header" style={{ borderTopColor: column.color }}>
        <div className="column-title-row">
          <span className="column-dot" style={{ background: column.color }} />
          <span className="column-title">{column.title}</span>
          <IonBadge
            className="column-count"
            style={{ background: column.color }}
          >
            {tasks.length}
          </IonBadge>
        </div>
        <IonButton
          fill="clear"
          size="small"
          className="add-task-btn"
          onClick={() => onAddTask(column.id)}
        >
          <IonIcon icon={addOutline} />
        </IonButton>
      </div>

      <div
        ref={setNodeRef}
        className="column-body"
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="empty-column">
            <span>Drop tasks here</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
