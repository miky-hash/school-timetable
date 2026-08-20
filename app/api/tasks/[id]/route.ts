import { requireWritable } from "@/lib/guard";
import { TASK_TYPES } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase";

const TYPES = TASK_TYPES.map((t) => t.value) as string[];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const denied = await requireWritable();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const patch: Record<string, unknown> = {};

  if (typeof body?.title === "string") {
    const title = body.title.trim();
    if (!title) return Response.json({ error: "내용을 입력해주세요." }, { status: 400 });
    patch.title = title;
  }
  if (typeof body?.type === "string" && TYPES.includes(body.type)) patch.type = body.type;
  if (typeof body?.description === "string") patch.description = body.description.trim() || null;
  if (typeof body?.done === "boolean") patch.done = body.done;
  if ("subject_id" in (body ?? {})) {
    patch.subject_id = typeof body?.subject_id === "string" && body.subject_id ? body.subject_id : null;
  }
  if ("due_date" in (body ?? {})) {
    if (typeof body?.due_date === "string" && body.due_date) {
      if (!DATE_RE.test(body.due_date)) {
        return Response.json({ error: "마감일 형식이 올바르지 않습니다." }, { status: 400 });
      }
      patch.due_date = body.due_date;
    } else {
      patch.due_date = null;
    }
  }

  if (Object.keys(patch).length === 0) {
    return Response.json({ error: "변경할 내용이 없습니다." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("tasks")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(_request: Request, { params }: Context) {
  const denied = await requireWritable();
  if (denied) return denied;

  const { id } = await params;
  const { error } = await supabaseAdmin().from("tasks").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
