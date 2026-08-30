import type { TaskType } from "./constants";

export type Subject = {
  id: string;
  name: string;
  teacher: string | null;
  color: string;
  created_at: string;
};

export type TimetableSlot = {
  id: string;
  day: number;
  period: number;
  subject_id: string | null;
  note: string | null;
};

export type Task = {
  id: string;
  type: TaskType;
  subject_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  done: boolean;
  created_by: string | null;
  created_at: string;
};
