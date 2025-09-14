import RealTimeMatchManagement from "@/components/dashboard/real-time-match-management";

interface RealTimeMatchPageProps {
  params: {
    id: string;
  };
}

export default function RealTimeMatchPage({ params }: RealTimeMatchPageProps) {
  return (
    <div className="min-h-screen bg-[#1d2834]">
      <RealTimeMatchManagement matchId={params.id} />
    </div>
  );
}