import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, ColumnId } from '../types/kanban';

const STORAGE_KEY = 'kanban_tasks';

const DEFAULT_TASKS: Task[] = [
  {
    id: uuidv4(),
    title: 'Setup project repository',
    description: 'Initialize Git repo and push to GitHub',
    columnId: 'done',
    priority: 'high',
    label: 'DevOps',
    subtasks: [
      { id: uuidv4(), title: 'Create GitHub repo', completed: true },
      { id: uuidv4(), title: 'Push initial commit', completed: true },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Design UI mockup',
    description: 'Create wireframes for the Kanban board layout',
    columnId: 'doing',
    priority: 'medium',
    label: 'Design',
    subtasks: [
      { id: uuidv4(), title: 'Sketch board layout', completed: true },
      { id: uuidv4(), title: 'Choose color scheme', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Implement drag and drop',
    description: 'Use @dnd-kit to handle drag between columns',
    columnId: 'todo',
    priority: 'high',
    label: 'Feature',
    subtasks: [
      { id: uuidv4(), title: 'Install dnd-kit', completed: false },
      { id: uuidv4(), title: 'Create DragContext', completed: false },
      { id: uuidv4(), title: 'Test cross-column drag', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Write unit tests',
    description: 'Cover main hooks and components with tests',
    columnId: 'review',
    priority: 'low',
    label: 'Testing',
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Fix mobile responsiveness',
    description: 'Column overflow on small screens needs fix',
    columnId: 'rework',
    priority: 'medium',
    label: 'Bug',
    subtasks: [
      { id: uuidv4(), title: 'Test on iPhone SE', completed: false },
      { id: uuidv4(), title: 'Fix horizontal scroll', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
];

export function useKanban() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTask = (taskId: string, toColumnId: ColumnId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId: toColumnId } : t))
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s
              ),
            }
          : t
      )
    );
  };

  const reorderTasks = (taskId: string, overId: string, overColumnId: ColumnId) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const updatedTasks = prev.map((t) =>
        t.id === taskId ? { ...t, columnId: overColumnId } : t
      );

      const fromIndex = updatedTasks.findIndex((t) => t.id === taskId);
      const toIndex = updatedTasks.findIndex((t) => t.id === overId);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return updatedTasks;

      const result = [...updatedTasks];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  };

  return { tasks, addTask, updateTask, deleteTask, moveTask, toggleSubtask, reorderTasks };
}
