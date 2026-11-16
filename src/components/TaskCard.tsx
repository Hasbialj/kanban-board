import React from 'react';
import { IonCard, IonCardContent, IonBadge, IonProgressBar, IonIcon } from '@ionic/react';
import { checkboxOutline, alertCircleOutline, timeOutline } from 'ionicons/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types/kanban';
import './TaskCard.css';

interface Props {
  task: Task;
  onClick: (task: Task) => void;
}

const PRIORITY_COLOR: Record<string, string> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

const PRIORITY_ICON: Record<string, string> = {
  low: timeOutline,
  medium: alertCircleOutline,
  high: alertCircleOutline,
};

const TaskCard: React.FC<Props> = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id, data: { columnId: task.columnId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const progress = task.subtasks.length > 0 ? completedSubtasks / task.subtasks.length : 0;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <IonCard
        className={`task-card priority-${task.priority}`}
        onClick={() => onClick(task)}
        button
      >
        <div className="drag-handle" {...listeners}>
          <span />
          <span />
          <span />
        </div>
        <IonCardContent className="task-card-content">
          <div className="task-card-top">
            <span className="task-card-title">{task.title}</span>
          </div>

          <div className="task-card-badges">
            <IonBadge color={PRIORITY_COLOR[task.priority]} className="priority-badge">
              <IonIcon icon={PRIORITY_ICON[task.priority]} />
              &nbsp;{task.priority}
            </IonBadge>
            {task.label && (
              <IonBadge color="light" className="label-badge">{task.label}</IonBadge>
            )}
          </div>

          {task.description && (
            <p className="task-card-desc">{task.description}</p>
          )}

          {task.subtasks.length > 0 && (
            <div className="task-card-subtasks">
              <div className="subtask-row">
                <IonIcon icon={checkboxOutline} className="subtask-icon" />
                <span>{completedSubtasks}/{task.subtasks.length}</span>
              </div>
              <IonProgressBar value={progress} color="primary" className="card-progress" />
            </div>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default TaskCard;
