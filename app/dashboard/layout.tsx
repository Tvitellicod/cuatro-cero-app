import type React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { ProfileGuard } from "@/components/auth/profile-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <ProfileGuard>{children}</ProfileGuard>
    </ProtectedRoute>
  )
}
