import { createClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("validation_runs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: "Failed to load validation runs" }, { status: 500 });
  }

  return Response.json({ runs: data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { productName, predictedIntent, actualUnits, actualRevenue, actualConversion, notes } = body;

  if (!productName || predictedIntent == null) {
    return Response.json({ error: "Product name and predicted intent are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("validation_runs")
    .insert({
      id: nanoid(),
      product_name: productName,
      predicted_intent: predictedIntent,
      actual_units: actualUnits || null,
      actual_revenue: actualRevenue || null,
      actual_conversion: actualConversion || null,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: "Failed to save validation run" }, { status: 500 });
  }

  return Response.json({ run: data });
}
