import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { email?: string } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Email required for deletion" },
      { status: 400 }
    );
  }

  const email = body.email?.trim();
  if (!email) {
    return Response.json(
      { error: "Email required for deletion" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("platform_ad_results")
    .select("email")
    .eq("id", id)
    .single();

  if (!existing || existing.email !== email) {
    return Response.json(
      { error: "Not found or unauthorized" },
      { status: 404 }
    );
  }

  const { error } = await supabase
    .from("platform_ad_results")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }

  return Response.json({ success: true });
}
