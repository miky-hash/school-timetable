import SetupNotice from "@/components/SetupNotice";
import SubjectManager from "@/components/SubjectManager";
import { hasEditAccess } from "@/lib/auth";
import { getSubjects } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = { title: "과목 · 우리 반 시간표" };

export default async function SubjectsPage() {
  if (!isSupabaseConfigured()) return <SetupNotice />;

  const [subjects, canEdit] = await Promise.all([getSubjects(), hasEditAccess()]);

  return <SubjectManager subjects={subjects} canEdit={canEdit} />;
}
