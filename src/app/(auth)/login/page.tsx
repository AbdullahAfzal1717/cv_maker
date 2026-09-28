"use client";

import { Suspense } from "react";
import WithGuest from "@/components/auth/WithGuest";
import SignInPage from "@/components/pages/SignInPage";

export default function Page() {
  return (
    <WithGuest>
      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-slate-400">
                Loading...
              </span>
            </div>
          </div>
        }
      >
        <SignInPage />
      </Suspense>
    </WithGuest>
  );
}
