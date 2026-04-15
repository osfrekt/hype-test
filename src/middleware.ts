import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SITE_PASSWORD = process.env.SITE_PASSWORD;

export async function middleware(request: NextRequest) {
  // Password protection (set SITE_PASSWORD env var to enable)
  if (SITE_PASSWORD) {
    const isApi = request.nextUrl.pathname.startsWith("/api/");
    const isAuthCallback = request.nextUrl.pathname.startsWith("/auth/");
    const isPasswordPage = request.nextUrl.pathname === "/password";

    if (!isApi && !isAuthCallback && !isPasswordPage) {
      const accessCookie = request.cookies.get("site-access")?.value;
      if (accessCookie !== SITE_PASSWORD) {
        const url = request.nextUrl.clone();
        url.pathname = "/password";
        url.searchParams.set("next", request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth token
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brands/|api/).*)",
  ],
};
