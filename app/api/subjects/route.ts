import { requireWritable } from "@/lib/guard";
import { SUBJECT_COLOR_KEYS } from "@/lib/constants";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const denied = await requireWritable();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return Response.json({ error: "과목 이름을 입력해주세요." }, { status: 400 });

  const teacher = typeof body?.teacher === "string" ? body.teacher.trim() || null : null;
  const color =
    typeof body?.color === "string" && SUBJECT_COLOR_KEYS.includes(body.color as never)
      ? body.color
      : "slate";

  const { data, error } = await supabaseAdmin()
    .from("subjects")
    .insert({ name, teacher, color })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}
