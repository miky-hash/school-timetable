import { requireWritable } from "@/lib/guard";
import { SUBJECT_COLOR_KEYS } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const denied = await requireWritable();
  if (denied) return denied;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const patch: Record<string, unknown> = {};

  if (typeof body?.name === "string") {
    const name = body.name.trim();
    if (!name) return Response.json({ error: "과목 이름을 입력해주세요." }, { status: 400 });
    patch.name = name;
  }
  if (typeof body?.teacher === "string") patch.teacher = body.teacher.trim() || null;
  if (typeof body?.color === "string" && SUBJECT_COLOR_KEYS.includes(body.color as never)) {
    patch.color = body.color;
  }

  if (Object.keys(patch).length === 0) {
    return Response.json({ error: "변경할 내용이 없습니다." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("subjects")
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
  const { error } = await supabaseAdmin().from("subjects").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
