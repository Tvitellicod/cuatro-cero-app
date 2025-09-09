import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Trophy, TrendingUp, Dumbbell } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isSupabaseConfigured } from "@/lib/supabase"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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
      type: "match",
      title: "VS Club Atlético River",
      date: "2024-01-15",
      time: "16:00",
      location: "Local",
      path: "/dashboard/torneos/proximos",
    },
    {
      type: "match",
      title: "VS Boca Juniors",
      date: "2024-01-22",
      time: "18:30",
      location: "Visitante",
      path: "/dashboard/torneos/proximos",
    },
  ]

  const recentTrainings = [
    {
      type: "training",
      title: "Entrenamiento Táctico",
      date: "2024-01-10",
      time: "10:00",
      focus: "Ataque Posicional",
      path: "/dashboard/entrenamiento/planificar",
    },
    {
      type: "training",
      title: "Preparación Física",
      date: "2024-01-08",
      time: "15:00",
      focus: "Resistencia",
      path: "/dashboard/entrenamiento/planificar",
    },
  ]

  // Combinar y ordenar eventos
  const allUpcomingEvents = [...upcomingMatches, ...recentTrainings].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const getEventIcon = (type: string) => {
    switch (type) {
      case "match":
        return <Trophy className="h-5 w-5 text-[#f4c11a]" />
      case "training":
        return <Dumbbell className="h-5 w-5 text-[#33d9f6]" />
      default:
        return null
    }
  }

  const getEventBadge = (event: any) => {
    if (event.type === "match") {
      return (
        <Badge
          className={`text-xs font-medium ${
            event.location === "Local" ? "bg-[#25d03f] text-black" : "bg-[#ea3498] text-white"
          }`}
        >
          {event.location}
        </Badge>
      )
    }
    if (event.type === "training") {
      return (
        <Badge className="bg-[#aff606] text-black text-xs font-medium">
          {event.focus}
        </Badge>
      )
    }
    return null
  }

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

      {/* Próximos Eventos */}
      <Card className="bg-[#213041] border-[#305176]">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Próximos Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {allUpcomingEvents.length > 0 ? (
              allUpcomingEvents.map((event, index) => (
                <Link key={index} href={event.path}>
                  <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg hover:bg-[#305176] transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      {getEventIcon(event.type)}
                      <div>
                        <p className="text-white font-medium">{event.title}</p>
                        <p className="text-gray-400 text-sm">
                          {event.date} - {event.time}
                        </p>
                      </div>
                    </div>
                    {getEventBadge(event)}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 text-center">No hay eventos próximos.</p>
            )}
          </div>
        </CardContent>
      </Card>

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
                  <p className="text-white font-medium">{match.title}</p>
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
                    {training.date} - {training.time}
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