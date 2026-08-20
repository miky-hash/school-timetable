import { requireWritable } from "@/lib/guard";
import { TASK_TYPES } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase";

const TYPES = TASK_TYPES.map((t) => t.value) as string[];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function POST(request: Request) {
  const denied = await requireWritable();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) return Response.json({ error: "내용을 입력해주세요." }, { status: 400 });

  const type = typeof body?.type === "string" && TYPES.includes(body.type) ? body.type : "homework";
  const subjectId = typeof body?.subject_id === "string" && body.subject_id ? body.subject_id : null;
  const description =
    typeof body?.description === "string" ? body.description.trim() || null : null;
  const createdBy = typeof body?.created_by === "string" ? body.created_by.trim() || null : null;

  let dueDate: string | null = null;
  if (typeof body?.due_date === "string" && body.due_date) {
    if (!DATE_RE.test(body.due_date)) {
      return Response.json({ error: "마감일 형식이 올바르지 않습니다." }, { status: 400 });
    }
    dueDate = body.due_date;
  }

  const { data, error } = await supabaseAdmin()
    .from("tasks")
    .insert({
      type,
      subject_id: subjectId,
      title,
      description,
      due_date: dueDate,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
