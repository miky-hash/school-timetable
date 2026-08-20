import SetupNotice from "@/components/SetupNotice";
import TaskListView from "@/components/TaskListView";
import { hasEditAccess } from "@/lib/auth";
import { getSubjects, getTasks } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = { title: "할 일 · 우리 반 시간표" };

export default async function TasksPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const [tasks, subjects, canEdit] = await Promise.all([
    getTasks(),
    getSubjects(),
    hasEditAccess(),
  ]);

  return <TaskListView tasks={tasks} subjects={subjects} canEdit={canEdit} />;
}
