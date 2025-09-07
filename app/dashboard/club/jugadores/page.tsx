import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PlayersManagement } from "@/components/dashboard/players-management"

export default function PlayersPage() {
  return (
    <DashboardLayout>
      <PlayersManagement />
    </DashboardLayout>
  )
}
