export type ColumnId = 'todo' | 'doing' | 'review' | 'done' | 'rework';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: ColumnId;
  priority: 'low' | 'medium' | 'high';
  label: string;
  subtasks: Subtask[];
  createdAt: string;
}

export interface Column {
  id: ColumnId;
  title: string;
  color: string;
}

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: '#6c757d' },
  { id: 'doing', title: 'Doing', color: '#0d6efd' },
  { id: 'review', title: 'Review', color: '#fd7e14' },
  { id: 'done', title: 'Done', color: '#198754' },
  { id: 'rework', title: 'Rework', color: '#dc3545' },
];
