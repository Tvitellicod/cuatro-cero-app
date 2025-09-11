"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Trophy, TrendingUp, Dumbbell } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { isSupabaseConfigured } from "@/lib/supabase"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { matchesService, trainingSessionsService } from "@/lib/database"
import { useAuth } from "@/hooks/use-auth"

export function DashboardHome() {
  const { user } = useAuth()
  const [allUpcomingEvents, setAllUpcomingEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  // Fetch upcoming events from Supabase
  useEffect(() => {
    async function fetchUpcomingEvents() {
      setLoading(true)

      if (!isSupabaseConfigured()) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Mock Data for Demo Mode
        const upcomingMatches = [
          {
            type: "match",
            title: "VS Club Atlético River",
            date: today.toISOString().split("T")[0],
            time: "16:00",
            location: "Local",
            path: "/dashboard/torneos/proximos",
          },
          {
            type: "match",
            title: "VS Boca Juniors",
            date: tomorrow.toISOString().split("T")[0],
            time: "18:30",
            location: "Visitante",
            path: "/dashboard/torneos/proximos",
          },
        ];
        const recentTrainings = [
          {
            type: "training",
            title: "Entrenamiento Táctico",
            date: today.toISOString().split("T")[0],
            time: "10:00",
            focus: "Ataque Posicional",
            path: "/dashboard/entrenamiento/planificar",
          },
          {
            type: "training",
            title: "Preparación Física",
            date: tomorrow.toISOString().split("T")[0],
            time: "15:00",
            focus: "Resistencia",
            path: "/dashboard/entrenamiento/planificar",
          },
        ];

        const combinedEvents = [...upcomingMatches, ...recentTrainings].sort(
          (a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()
        );

        setAllUpcomingEvents(combinedEvents);
        setLoading(false);
        return;
      }

      if (!user?.club_id) {
        setLoading(false)
        return
      }

      try {
        const [{ data: matchesData }, { data: trainingsData }] = await Promise.all([
          matchesService.getUpcomingMatches(user.club_id),
          trainingSessionsService.getUpcomingTrainingSessions(user.club_id),
        ])

        const combinedEvents = []
        if (matchesData) {
          combinedEvents.push(...matchesData.map(match => ({
            type: "match",
            title: `VS ${match.opponent_name}`,
            date: match.match_date ? new Date(match.match_date).toISOString().split("T")[0] : "",
            time: match.match_date ? new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
            location: match.location,
            path: "/dashboard/torneos/proximos",
            tournament: match.tournaments?.name,
          })))
        }

        if (trainingsData) {
          combinedEvents.push(...trainingsData.map(training => ({
            type: "training",
            title: training.name,
            date: training.date,
            time: "N/A",
            focus: "Planificado",
            path: "/dashboard/entrenamiento/planificar",
          })))
        }

        const sortedEvents = combinedEvents.sort(
          (a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()
        )
        setAllUpcomingEvents(sortedEvents)
      } catch (error) {
        console.error("Error fetching upcoming events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingEvents()
  }, [user?.club_id])

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
  
  // Helper function to format the date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const [year, month, day] = dateString.split('-')
    return `${day} - ${month} - ${year}`
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
          {loading ? (
            <p className="text-gray-400 text-center">Cargando eventos...</p>
          ) : allUpcomingEvents.length > 0 ? (
            <div className="flex flex-col gap-4">
              {allUpcomingEvents.map((event, index) => (
                <Link key={index} href={event.path}>
                  <div className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg hover:bg-[#305176] transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      {getEventIcon(event.type)}
                      <div>
                        <p className="text-white font-medium">{event.title}</p>
                        <p className="text-gray-400 text-sm">
                          {formatDate(event.date)} - {event.time}
                        </p>
                      </div>
                    </div>
                    {getEventBadge(event)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">No hay eventos próximos.</p>
          )}
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
            {allUpcomingEvents.filter(e => e.type === "match").length > 0 ? (
              allUpcomingEvents.filter(e => e.type === "match").map((match, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                  <div>
                    <p className="text-white font-medium">{match.title}</p>
                    <p className="text-gray-400 text-sm">
                      {formatDate(match.date)} - {match.time}
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
              ))
            ) : (
              <p className="text-gray-400 text-center">No hay partidos próximos.</p>
            )}
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
            {allUpcomingEvents.filter(e => e.type === "training").length > 0 ? (
              allUpcomingEvents.filter(e => e.type === "training").map((training, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                  <div>
                    <p className="text-white font-medium">{training.title}</p>
                    <p className="text-gray-400 text-sm">
                      {formatDate(training.date)} - {training.time}
                    </p>
                  </div>
                  <div className="px-2 py-1 bg-[#aff606] text-black rounded text-xs font-medium">{training.focus}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No hay entrenamientos próximos.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}