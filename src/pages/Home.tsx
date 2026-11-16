import React, { useState, useMemo } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
} from '@ionic/react';
import {
  addOutline,
} from 'ionicons/icons';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';

import { COLUMNS, ColumnId, Task } from '../types/kanban';
import { useKanban } from '../hooks/useKanban';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import './Home.css';

type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

const Home: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, moveTask, toggleSubtask, reorderTasks } = useKanban();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultColumn, setDefaultColumn] = useState<ColumnId>('todo');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } })
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.label.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      return matchSearch && matchPriority;
    });
  }, [tasks, search, priorityFilter]);

  const getColumnTasks = (columnId: ColumnId) =>
    filteredTasks.filter((t) => t.columnId === columnId);

  const handleAddTask = (columnId: string) => {
    setDefaultColumn(columnId as ColumnId);
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Dropped over a column
    const overColumn = COLUMNS.find((c) => c.id === overId);
    if (overColumn && activeTask.columnId !== overColumn.id) {
      moveTask(activeId, overColumn.id);
      return;
    }

    // Dropped over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.columnId !== overTask.columnId) {
      moveTask(activeId, overTask.columnId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Dropped over a column
    const overColumn = COLUMNS.find((c) => c.id === overId);
    if (overColumn) {
      moveTask(activeId, overColumn.id);
      return;
    }

    // Dropped over another task — reorder
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      reorderTasks(activeId, overId, overTask.columnId);
    }
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.columnId === 'done').length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <div className="header-title">
              <span>🗂️ Kanban Board</span>
              <span className="header-subtitle">{doneTasks}/{totalTasks} done</span>
            </div>
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => handleAddTask('todo')}>
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonToolbar>
          <IonSearchbar
            value={search}
            onIonInput={(e) => setSearch(e.detail.value ?? '')}
            placeholder="Search tasks..."
            animated
            className="board-searchbar"
          />
        </IonToolbar>

        <IonToolbar className="filter-bar">
          <IonSegment
            value={priorityFilter}
            onIonChange={(e) => setPriorityFilter(e.detail.value as PriorityFilter)}
          >
            <IonSegmentButton value="all">
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="high">
              <IonLabel>🔴 High</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="medium">
              <IonLabel>🟡 Medium</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="low">
              <IonLabel>🟢 Low</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="board-content" scrollX={true} scrollY={false}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="board-container">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={getColumnTasks(column.id)}
                onAddTask={handleAddTask}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="drag-overlay-card">
                <TaskCard task={activeTask} onClick={() => {}} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </IonContent>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton color="primary" onClick={() => handleAddTask('todo')}>
          <IonIcon icon={addOutline} />
        </IonFabButton>
      </IonFab>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        task={selectedTask}
        defaultColumnId={defaultColumn}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={deleteTask}
        onToggleSubtask={toggleSubtask}
      />
    </IonPage>
  );
};

export default Home;
