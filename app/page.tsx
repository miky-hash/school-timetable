import SetupNotice from "@/components/SetupNotice";
import TimetableBoard from "@/components/TimetableBoard";
import UpcomingStrip from "@/components/UpcomingStrip";
import { hasEditAccess } from "@/lib/auth";
import { getSlots, getSubjects, getTasks } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function TimetablePage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const [subjects, slots, tasks, canEdit] = await Promise.all([
    getSubjects(),
    getSlots(),
    getTasks(),
    hasEditAccess(),
  ]);

  return (
    <>
      <UpcomingStrip tasks={tasks} subjects={subjects} />
      <TimetableBoard subjects={subjects} slots={slots} tasks={tasks} canEdit={canEdit} />
    </>
  );
}
