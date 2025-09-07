import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TournamentsOverview } from "@/components/dashboard/tournaments-overview"

export default function TournamentsPage() {
  return (
    <DashboardLayout>
      <TournamentsOverview />
    </DashboardLayout>
  )
}
