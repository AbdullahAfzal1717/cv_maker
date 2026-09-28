"use client";

import WithGuest from "@/components/auth/WithGuest";
import SignUpPage from "@/components/pages/SignUpPage";

export default function Page() {
  return (
    <WithGuest>
      <SignUpPage />
    </WithGuest>
  );
}
