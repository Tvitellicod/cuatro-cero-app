import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ExerciseManagement } from "@/components/dashboard/exercise-management"

export default function ExercisesPage() {
  return (
    <DashboardLayout>
      <ExerciseManagement />
    </DashboardLayout>
  )
}
