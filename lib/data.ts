import "server-only";

import { supabaseAdmin } from "./supabase";
import type { Subject, Task, TimetableSlot } from "./types";

export async function getSubjects(): Promise<Subject[]> {
  const { data, error } = await supabaseAdmin()
    .from("subjects")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Subject[];
}

export async function getSlots(): Promise<TimetableSlot[]> {
  const { data, error } = await supabaseAdmin()
    .from("timetable_slots")
    .select("*")
    .order("day", { ascending: true })
    .order("period", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as TimetableSlot[];
}

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabaseAdmin()
    .from("tasks")
    .select("*")
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Task[];
}
