"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AiChatPage from "@/components/pages/AiChatPage";

export default function Page() {
  return (
    <ProtectedRoute>
      <AiChatPage />
    </ProtectedRoute>
  );
}
