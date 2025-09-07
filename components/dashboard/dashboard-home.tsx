import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Trophy, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isSupabaseConfigured } from "@/lib/supabase"

export function DashboardHome() {
  const stats = [
    {
      title: "Jugadores Activos",
      value: "24",
      icon: Users,
      color: "text-[#aff606]",
    },
    {
      title: "Entrenamientos",
      value: "12",
      icon: Calendar,
      color: "text-[#33d9f6]",
    },
    {
      title: "Partidos Jugados",
      value: "8",
      icon: Trophy,
      color: "text-[#f4c11a]",
    },
    {
      title: "Rendimiento",
      value: "85%",
      icon: TrendingUp,
      color: "text-[#25d03f]",
    },
  ]

  const upcomingMatches = [
    {
      opponent: "Club Atlético River",
      date: "15 Ene 2024",
      time: "16:00",
      location: "Local",
    },
    {
      opponent: "Boca Juniors",
      date: "22 Ene 2024",
      time: "18:30",
      location: "Visitante",
    },
  ]

  const recentTrainings = [
    {
      title: "Entrenamiento Táctico",
      date: "10 Ene 2024",
      duration: "90 min",
      focus: "Ataque Posicional",
    },
    {
      title: "Preparación Física",
      date: "8 Ene 2024",
      duration: "60 min",
      focus: "Resistencia",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Bienvenido de vuelta</h2>
        <p className="text-gray-400">Aquí tienes un resumen de la actividad de tu equipo</p>
      </div>

      {!isSupabaseConfigured() && (
        <Alert className="bg-[#f4c11a] border-[#f4c11a] text-black">
          <AlertDescription>
            <strong>Modo Demo:</strong> Estás viendo datos de ejemplo. Configura Supabase para usar datos reales.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#213041] border-[#305176]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Matches */}
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-[#f4c11a]" />
              Próximos Partidos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingMatches.map((match, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <div>
                  <p className="text-white font-medium">{match.opponent}</p>
                  <p className="text-gray-400 text-sm">
                    {match.date} - {match.time}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    match.location === "Local" ? "bg-[#25d03f] text-black" : "bg-[#ea3498] text-white"
                  }`}
                >
                  {match.location}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Trainings */}
        <Card className="bg-[#213041] border-[#305176]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-[#33d9f6]" />
              Entrenamientos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTrainings.map((training, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                <div>
                  <p className="text-white font-medium">{training.title}</p>
                  <p className="text-gray-400 text-sm">
                    {training.date} - {training.duration}
                  </p>
                </div>
                <div className="px-2 py-1 bg-[#aff606] text-black rounded text-xs font-medium">{training.focus}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
