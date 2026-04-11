import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase
    .from("research_results")
    .delete()
    .eq("id", id);

  if (error) {
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }

  return Response.json({ success: true });
}
