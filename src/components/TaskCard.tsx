import React from 'react';
import { IonBadge, IonProgressBar, IonIcon } from '@ionic/react';
import { checkboxOutline, alertCircleOutline, timeOutline, reorderThreeOutline } from 'ionicons/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types/kanban';
import './TaskCard.css';

interface Props {
  task: Task;
  onClick: (task: Task) => void;
}

const PRIORITY_COLOR: Record<string, string> = {
  low: '#198754',
  medium: '#fd7e14',
  high: '#dc3545',
};

const PRIORITY_ICON: Record<string, string> = {
  low: timeOutline,
  medium: alertCircleOutline,
  high: alertCircleOutline,
};

const TaskCard: React.FC<Props> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { columnId: task.columnId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const progress = task.subtasks.length > 0 ? completedSubtasks / task.subtasks.length : 0;

  return (
    <div
      ref={setNodeRef}
      style={style as React.CSSProperties}
      className={`task-card-wrapper priority-border-${task.priority}`}
    >
      {/* Drag handle — hanya area ini yang bisa di-drag */}
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
        title="Drag to move"
      >
        <IonIcon icon={reorderThreeOutline} />
      </div>

      {/* Card body — klik untuk buka modal */}
      <div
        className="task-card-body"
        onClick={() => onClick(task)}
      >
        <div className="task-card-title">{task.title}</div>

        <div className="task-card-badges">
          <span
            className="priority-badge"
            style={{ background: PRIORITY_COLOR[task.priority] }}
          >
            <IonIcon icon={PRIORITY_ICON[task.priority]} />
            &nbsp;{task.priority}
          </span>
          {task.label && (
            <span className="label-badge">{task.label}</span>
          )}
        </div>

        {task.description && (
          <p className="task-card-desc">{task.description}</p>
        )}

        {task.subtasks.length > 0 && (
          <div className="task-card-subtasks">
            <div className="subtask-row">
              <IonIcon icon={checkboxOutline} />
              <span>{completedSubtasks}/{task.subtasks.length}</span>
            </div>
            <IonProgressBar value={progress} color="primary" className="card-progress" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
