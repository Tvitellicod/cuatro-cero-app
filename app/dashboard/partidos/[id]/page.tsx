import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { RealTimeMatchManagement } from "@/components/dashboard/real-time-match-management";

interface RealTimeMatchPageProps {
  params: {
    id: string;
  };
}

export default function RealTimeMatchPage({ params }: RealTimeMatchPageProps) {
  return (
    <DashboardLayout>
      <RealTimeMatchManagement matchId={params.id} />
    </DashboardLayout>
  );
}