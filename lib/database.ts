import { supabase } from "./supabase"

// Clubs
export const clubsService = {
  async getClubs(userId: string) {
    const { data, error } = await supabase.from("clubs").select("*").eq("user_id", userId)
    return { data, error }
  },

  async createClub(clubData: any) {
    const { data, error } = await supabase.from("clubs").insert(clubData).select().single()
    return { data, error }
  },

  async updateClub(id: string, clubData: any) {
    const { data, error } = await supabase.from("clubs").update(clubData).eq("id", id).select().single()
    return { data, error }
  },

  async deleteClub(id: string) {
    const { error } = await supabase.from("clubs").delete().eq("id", id)
    return { error }
  },
}

// Categories
export const categoriesService = {
  async getCategories(clubId: string) {
    const { data, error } = await supabase.from("categories").select("*").eq("club_id", clubId).order("name")
    return { data, error }
  },

  async createCategory(categoryData: any) {
    const { data, error } = await supabase.from("categories").insert(categoryData).select().single()
    return { data, error }
  },

  async updateCategory(id: string, categoryData: any) {
    const { data, error } = await supabase.from("categories").update(categoryData).eq("id", id).select().single()
    return { data, error }
  },

  async deleteCategory(id: string) {
    const { error } = await supabase.from("categories").delete().eq("id", id)
    return { error }
  },
}

// Players
export const playersService = {
  async getPlayers(clubId: string, categoryId?: string) {
    let query = supabase
      .from("players")
      .select(`
        *,
        categories (
          name
        )
      `)
      .eq("club_id", clubId)

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query.order("last_name")
    return { data, error }
  },

  async createPlayer(playerData: any) {
    const { data, error } = await supabase.from("players").insert(playerData).select().single()
    return { data, error }
  },

  async updatePlayer(id: string, playerData: any) {
    const { data, error } = await supabase.from("players").update(playerData).eq("id", id).select().single()
    return { data, error }
  },

  async deletePlayer(id: string) {
    const { error } = await supabase.from("players").delete().eq("id", id)
    return { error }
  },
}

// Exercises
export const exercisesService = {
  async getExercises(clubId: string, categoryId?: string) {
    let query = supabase
      .from("exercises")
      .select(`
        *,
        exercise_categories (
          name,
          color
        )
      `)
      .eq("club_id", clubId)

    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query.order("name")
    return { data, error }
  },

  async createExercise(exerciseData: any) {
    const { data, error } = await supabase.from("exercises").insert(exerciseData).select().single()
    return { data, error }
  },

  async getExerciseCategories(clubId: string) {
    const { data, error } = await supabase.from("exercise_categories").select("*").eq("club_id", clubId).order("name")
    return { data, error }
  },

  async createExerciseCategory(categoryData: any) {
    const { data, error } = await supabase.from("exercise_categories").insert(categoryData).select().single()
    return { data, error }
  },
}

// Matches
export const matchesService = {
  async getMatches(clubId: string, status?: string) {
    let query = supabase
      .from("matches")
      .select(`
        *,
        categories (
          name
        ),
        tournaments (
          name
        )
      `)
      .eq("club_id", clubId)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("match_date")
    return { data, error }
  },

  async createMatch(matchData: any) {
    const { data, error } = await supabase.from("matches").insert(matchData).select().single()
    return { data, error }
  },

  async updateMatch(id: string, matchData: any) {
    const { data, error } = await supabase.from("matches").update(matchData).eq("id", id).select().single()
    return { data, error }
  },

  async getTournaments(clubId: string) {
    const { data, error } = await supabase.from("tournaments").select("*").eq("club_id", clubId).order("name")
    return { data, error }
  },

  async createTournament(tournamentData: any) {
    const { data, error } = await supabase.from("tournaments").insert(tournamentData).select().single()
    return { data, error }
  },
}

// Products
export const productsService = {
  async getProducts(category?: string) {
    let query = supabase.from("products").select("*").eq("is_active", true)

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query.order("name")
    return { data, error }
  },
}

// Orders
export const ordersService = {
  async createOrder(orderData: any) {
    const { data, error } = await supabase.from("orders").insert(orderData).select().single()
    return { data, error }
  },

  async getOrders(userId: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url
          )
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    return { data, error }
  },
}
