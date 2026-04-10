import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || !EMAIL_RE.test(email) || email.length > 320) {
      return Response.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("waitlist_emails")
      .insert({ email });

    if (error) {
      // Unique constraint violation = already on the list
      if (error.code === "23505") {
        return Response.json({ message: "You're already on the waitlist!" });
      }
      throw error;
    }

    return Response.json({ message: "You're on the waitlist!" });
  } catch (error) {
    console.error("Waitlist error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
