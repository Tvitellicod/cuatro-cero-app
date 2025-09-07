"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Building, ShoppingCart, DollarSign, TrendingUp, Activity } from "lucide-react"
import { supabase } from "@/lib/supabase"

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClubs: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    monthlyGrowth: 0,
  })

  const [recentUsers, setRecentUsers] = useState([])
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })

      // Get total clubs
      const { count: clubsCount } = await supabase.from("clubs").select("*", { count: "exact", head: true })

      // Get total orders
      const { count: ordersCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

      // Get total revenue
      const { data: revenueData } = await supabase.from("orders").select("total_amount").eq("status", "completed")

      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number.parseFloat(order.total_amount), 0) || 0

      // Get active subscriptions
      const { count: activeSubsCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("subscription_status", "active")

      // Get recent users
      const { data: recentUsersData } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      // Get recent orders
      const { data: recentOrdersData } = await supabase
        .from("orders")
        .select(`
          *,
          users (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      setStats({
        totalUsers: usersCount || 0,
        totalClubs: clubsCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        activeSubscriptions: activeSubsCount || 0,
        monthlyGrowth: 12.5, // This would be calculated based on historical data
      })

      setRecentUsers(recentUsersData || [])
      setRecentOrders(recentOrdersData || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    }
  }

  const statsCards = [
    {
      title: "Total Usuarios",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "text-[#aff606]",
      change: "+12%",
    },
    {
      title: "Clubes Registrados",
      value: stats.totalClubs.toString(),
      icon: Building,
      color: "text-[#33d9f6]",
      change: "+8%",
    },
    {
      title: "Pedidos Totales",
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-[#f4c11a]",
      change: "+23%",
    },
    {
      title: "Ingresos Totales",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-[#25d03f]",
      change: "+18%",
    },
    {
      title: "Suscripciones Activas",
      value: stats.activeSubscriptions.toString(),
      icon: Activity,
      color: "text-[#ea3498]",
      change: "+15%",
    },
    {
      title: "Crecimiento Mensual",
      value: `${stats.monthlyGrowth}%`,
      icon: TrendingUp,
      color: "text-[#8a46c5]",
      change: "+2%",
    },
  ]

  return (
    <div className="min-h-screen bg-[#1d2834] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Panel de Administración</h1>
            <p className="text-gray-400">Gestiona toda la plataforma CUATRO CERO</p>
          </div>
          <Button className="bg-[#aff606] text-black hover:bg-[#25d03f]">Generar Reporte</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsCards.map((stat, index) => (
            <Card key={index} className="bg-[#213041] border-[#305176]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  <Badge variant="secondary" className="bg-[#25d03f] text-black text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-[#aff606]" />
                Usuarios Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentUsers.map((user: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                  <div>
                    <p className="text-white font-medium">{user.full_name || "Sin nombre"}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      className={`${
                        user.subscription_status === "active" ? "bg-[#25d03f] text-black" : "bg-gray-500 text-white"
                      }`}
                    >
                      {user.role}
                    </Badge>
                    <p className="text-gray-500 text-xs mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="bg-[#213041] border-[#305176]">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-[#f4c11a]" />
                Pedidos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOrders.map((order: any, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#1d2834] rounded-lg">
                  <div>
                    <p className="text-white font-medium">{order.users?.full_name || "Usuario"}</p>
                    <p className="text-gray-400 text-sm">{order.users?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#aff606] font-bold">${Number.parseFloat(order.total_amount).toFixed(2)}</p>
                    <Badge
                      className={`${
                        order.status === "completed"
                          ? "bg-[#25d03f] text-black"
                          : order.status === "pending"
                            ? "bg-[#f4c11a] text-black"
                            : "bg-red-500 text-white"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
