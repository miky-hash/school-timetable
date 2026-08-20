import { requireWritable } from "@/lib/guard";
import { PERIOD_COUNT } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase";

/** 시간표 한 칸을 저장합니다. 과목도 메모도 없으면 칸을 비웁니다. */
export async function PUT(request: Request) {
  const denied = await requireWritable();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const day = Number(body?.day);
  const period = Number(body?.period);

  if (!Number.isInteger(day) || day < 1 || day > 7) {
    return Response.json({ error: "요일이 올바르지 않습니다." }, { status: 400 });
  }
  if (!Number.isInteger(period) || period < 1 || period > PERIOD_COUNT) {
    return Response.json({ error: "교시가 올바르지 않습니다." }, { status: 400 });
  }

  const subjectId = typeof body?.subject_id === "string" && body.subject_id ? body.subject_id : null;
  const note = typeof body?.note === "string" ? body.note.trim() || null : null;

  const db = supabaseAdmin();

  if (!subjectId && !note) {
    const { error } = await db.from("timetable_slots").delete().eq("day", day).eq("period", period);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ ok: true, cleared: true });
  }

  const { data, error } = await db
    .from("timetable_slots")
    .upsert({ day, period, subject_id: subjectId, note }, { onConflict: "day,period" })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
