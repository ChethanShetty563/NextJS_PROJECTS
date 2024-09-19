import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export const getSupabaseReqResClient = ({ request }) => {
  let response = {
    value: NextResponse.next({ request: request }),
  };
  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });

          response.value = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.value.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, response };
};
