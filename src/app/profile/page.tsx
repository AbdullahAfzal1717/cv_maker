"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProfileManagementPage from "@/components/pages/ProfileManagementPage";

export default function Page() {
  return (
    <ProtectedRoute>
      <ProfileManagementPage />
    </ProtectedRoute>
  );
}
