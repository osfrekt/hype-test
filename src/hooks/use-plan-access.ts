"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function usePlanAccess(requiredPlan: "starter" | "pro") {
  const [planChecked, setPlanChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user?.email) {
        setIsAuthenticated(true);

        // Admin users get full access to everything
        const adminRes = await fetch("/api/admin/check");
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          if (adminData.isAdmin) {
            setUserPlan("team");
            setHasAccess(true);
            setPlanChecked(true);
            return;
          }
        }

        const { data: profile } = await supabase
          .from("users")
          .select("plan")
          .eq("email", user.email)
          .single();
        const plan = profile?.plan || "free";
        setUserPlan(plan);
        const hasIt =
          requiredPlan === "starter"
            ? ["starter", "pro", "team"].includes(plan)
            : ["pro", "team"].includes(plan);
        setHasAccess(hasIt);
      }
      setPlanChecked(true);
    });
  }, [requiredPlan]);

  return { planChecked, hasAccess, userPlan, isAuthenticated };
}
