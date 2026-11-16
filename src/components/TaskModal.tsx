import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonList,
  IonCheckbox,
  IonIcon,
  IonBadge,
  IonProgressBar,
} from '@ionic/react';
import { addOutline, trashOutline, closeOutline } from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';
import { Task, ColumnId, Subtask, COLUMNS } from '../types/kanban';
import './TaskModal.css';

interface Props {
  isOpen: boolean;
  task: Task | null;
  defaultColumnId?: ColumnId;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onDelete?: (id: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

const TaskModal: React.FC<Props> = ({
  isOpen,
  task,
  defaultColumnId = 'todo',
  onClose,
  onSave,
  onDelete,
  onToggleSubtask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState<ColumnId>(defaultColumnId);
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [label, setLabel] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [viewMode, setViewMode] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setColumnId(task.columnId);
      setPriority(task.priority);
      setLabel(task.label);
      setSubtasks(task.subtasks);
      setViewMode(true);
    } else {
      setTitle('');
      setDescription('');
      setColumnId(defaultColumnId);
      setPriority('medium');
      setLabel('');
      setSubtasks([]);
      setViewMode(false);
    }
  }, [task, defaultColumnId, isOpen]);

  const completedCount = subtasks.filter((s) => s.completed).length;
  const progress = subtasks.length > 0 ? completedCount / subtasks.length : 0;

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      { id: uuidv4(), title: newSubtask.trim(), completed: false },
    ]);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSubtask = (subtaskId: string) => {
    if (task && onToggleSubtask) {
      onToggleSubtask(task.id, subtaskId);
      setSubtasks((prev) =>
        prev.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s))
      );
    } else {
      setSubtasks((prev) =>
        prev.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s))
      );
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description, columnId, priority, label, subtasks });
    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="task-modal">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>{task ? (viewMode ? 'Task Detail' : 'Edit Task') : 'New Task'}</IonTitle>
          <IonButtons slot="end">
            {task && viewMode && (
              <IonButton onClick={() => setViewMode(false)}>Edit</IonButton>
            )}
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {viewMode && task ? (
          /* ── View Mode ── */
          <div className="task-view">
            <div className="task-view-header">
              <h2>{task.title}</h2>
              <div className="task-view-meta">
                <IonBadge color={PRIORITY_COLORS[task.priority]}>{task.priority}</IonBadge>
                {task.label && <IonBadge color="medium">{task.label}</IonBadge>}
              </div>
            </div>

            {task.description && (
              <p className="task-view-desc">{task.description}</p>
            )}

            <div className="task-column-info">
              <span>Column:</span>
              <strong>{COLUMNS.find((c) => c.id === task.columnId)?.title}</strong>
            </div>

            {subtasks.length > 0 && (
              <div className="subtask-section">
                <div className="subtask-header">
                  <span>Subtasks</span>
                  <span>{completedCount}/{subtasks.length}</span>
                </div>
                <IonProgressBar value={progress} color="primary" />
                <IonList lines="none" className="subtask-list">
                  {subtasks.map((s) => (
                    <IonItem key={s.id} className="subtask-item">
                      <IonCheckbox
                        slot="start"
                        checked={s.completed}
                        onIonChange={() => handleToggleSubtask(s.id)}
                      />
                      <IonLabel className={s.completed ? 'subtask-done' : ''}>
                        {s.title}
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </div>
            )}

            {onDelete && (
              <IonButton
                expand="block"
                color="danger"
                fill="outline"
                className="ion-margin-top"
                onClick={handleDelete}
              >
                <IonIcon icon={trashOutline} slot="start" />
                Delete Task
              </IonButton>
            )}
          </div>
        ) : (
          /* ── Edit / Create Mode ── */
          <div className="task-form">
            <IonList lines="none">
              <IonItem className="form-item">
                <IonLabel position="stacked">Title *</IonLabel>
                <IonInput
                  value={title}
                  onIonInput={(e) => setTitle(e.detail.value ?? '')}
                  placeholder="Task title"
                  clearInput
                />
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea
                  value={description}
                  onIonInput={(e) => setDescription(e.detail.value ?? '')}
                  placeholder="Optional description"
                  autoGrow
                  rows={3}
                />
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked">Column</IonLabel>
                <IonSelect
                  value={columnId}
                  onIonChange={(e) => setColumnId(e.detail.value)}
                >
                  {COLUMNS.map((c) => (
                    <IonSelectOption key={c.id} value={c.id}>{c.title}</IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked">Priority</IonLabel>
                <IonSelect
                  value={priority}
                  onIonChange={(e) => setPriority(e.detail.value)}
                >
                  <IonSelectOption value="low">Low</IonSelectOption>
                  <IonSelectOption value="medium">Medium</IonSelectOption>
                  <IonSelectOption value="high">High</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem className="form-item">
                <IonLabel position="stacked">Label</IonLabel>
                <IonInput
                  value={label}
                  onIonInput={(e) => setLabel(e.detail.value ?? '')}
                  placeholder="e.g. Feature, Bug, Design"
                  clearInput
                />
              </IonItem>
            </IonList>

            {/* Subtasks */}
            <div className="subtask-editor">
              <div className="subtask-editor-title">Subtasks</div>
              {subtasks.length > 0 && (
                <>
                  <IonProgressBar value={progress} color="primary" className="subtask-progress" />
                  <p className="subtask-count">{completedCount}/{subtasks.length} completed</p>
                </>
              )}
              <IonList lines="none" className="subtask-list">
                {subtasks.map((s) => (
                  <IonItem key={s.id} className="subtask-item">
                    <IonCheckbox
                      slot="start"
                      checked={s.completed}
                      onIonChange={() => handleToggleSubtask(s.id)}
                    />
                    <IonLabel className={s.completed ? 'subtask-done' : ''}>{s.title}</IonLabel>
                    <IonButton
                      fill="clear"
                      color="danger"
                      slot="end"
                      size="small"
                      onClick={() => handleRemoveSubtask(s.id)}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
              <div className="subtask-add-row">
                <IonInput
                  value={newSubtask}
                  onIonInput={(e) => setNewSubtask(e.detail.value ?? '')}
                  placeholder="Add subtask..."
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  className="subtask-input"
                />
                <IonButton onClick={handleAddSubtask} fill="solid" color="primary" size="small">
                  <IonIcon icon={addOutline} />
                </IonButton>
              </div>
            </div>

            <div className="form-actions">
              <IonButton expand="block" color="primary" onClick={handleSave} disabled={!title.trim()}>
                {task ? 'Update Task' : 'Create Task'}
              </IonButton>
              {task && onDelete && (
                <IonButton expand="block" color="danger" fill="outline" onClick={handleDelete}>
                  <IonIcon icon={trashOutline} slot="start" />
                  Delete Task
                </IonButton>
              )}
            </div>
          </div>
        )}
      </IonContent>
    </IonModal>
  );
};

export default TaskModal;
