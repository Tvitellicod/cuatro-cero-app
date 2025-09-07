-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'institucional', 'cuerpo_tecnico', 'tecnico');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled', 'past_due');
CREATE TYPE player_status AS ENUM ('activo', 'lesionado', 'suspendido', 'inactivo');
CREATE TYPE match_status AS ENUM ('programado', 'en_vivo', 'finalizado', 'cancelado');
CREATE TYPE difficulty_level AS ENUM ('facil', 'medio', 'dificil');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'tecnico',
  subscription_plan TEXT,
  subscription_status subscription_status DEFAULT 'inactive',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clubs table
CREATE TABLE public.clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  abbreviation TEXT,
  logo_url TEXT,
  founded_year INTEGER,
  address TEXT,
  phone TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  age_min INTEGER,
  age_max INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE public.players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  nickname TEXT,
  birth_date DATE,
  position TEXT,
  preferred_foot TEXT,
  status player_status DEFAULT 'activo',
  photo_url TEXT,
  jersey_number INTEGER,
  height DECIMAL,
  weight DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise categories table
CREATE TABLE public.exercise_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#aff606',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table
CREATE TABLE public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.exercise_categories(id) ON DELETE CASCADE,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  objective TEXT,
  duration_minutes INTEGER,
  players_required INTEGER,
  goalkeepers_required INTEGER DEFAULT 0,
  difficulty difficulty_level DEFAULT 'medio',
  materials TEXT,
  diagram_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training sessions table
CREATE TABLE public.training_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  duration_minutes INTEGER,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Training exercises (many-to-many)
CREATE TABLE public.training_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  notes TEXT
);

-- Tournaments table
CREATE TABLE public.tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
  opponent_name TEXT NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_home BOOLEAN DEFAULT true,
  status match_status DEFAULT 'programado',
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  match_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match players (lineup)
CREATE TABLE public.match_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
  is_starter BOOLEAN DEFAULT false,
  position TEXT,
  jersey_number INTEGER,
  minutes_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  substituted_at INTEGER,
  substituted_by UUID REFERENCES public.players(id)
);

-- Match events table
CREATE TABLE public.match_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.players(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'goal', 'assist', 'yellow_card', 'red_card', 'substitution', 'foul'
  minute INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (for store)
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL, -- 'plantilla', 'ebook'
  image_url TEXT,
  file_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  price DECIMAL(10,2) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Clubs policies
CREATE POLICY "Users can view own clubs" ON public.clubs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own clubs" ON public.clubs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clubs" ON public.clubs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clubs" ON public.clubs FOR DELETE USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Users can manage categories of their clubs" ON public.categories FOR ALL USING (
  club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
);

-- Players policies
CREATE POLICY "Users can manage players of their clubs" ON public.players FOR ALL USING (
  club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
);

-- Exercise categories policies
CREATE POLICY "Users can manage exercise categories of their clubs" ON public.exercise_categories FOR ALL USING (
  club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
);

-- Exercises policies
CREATE POLICY "Users can manage exercises of their clubs" ON public.exercises FOR ALL USING (
  club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
);

-- Training sessions policies
CREATE POLICY "Users can manage training sessions of their clubs" ON public.training_sessions FOR ALL USING (
  club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
);

-- Training exercises policies
CREATE POLICY "Users can manage training exercises" ON public.training_exercises FOR ALL USING (
  training_session_id IN (
    SELECT id FROM public.training_sessions 
    WHERE club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
  )
);

-- Tournaments policies
CREATE POLICY "Users can manage tournaments of their clubs" ON public.tournaments FOR ALL USING (
  club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
);

-- Matches policies
CREATE POLICY "Users can manage matches of their clubs" ON public.matches FOR ALL USING (
  club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
);

-- Match players policies
CREATE POLICY "Users can manage match players" ON public.match_players FOR ALL USING (
  match_id IN (
    SELECT id FROM public.matches 
    WHERE club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
  )
);

-- Match events policies
CREATE POLICY "Users can manage match events" ON public.match_events FOR ALL USING (
  match_id IN (
    SELECT id FROM public.matches 
    WHERE club_id IN (SELECT id FROM public.clubs WHERE user_id = auth.uid())
  )
);

-- Products are public for reading
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (is_active = true);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create own order items" ON public.order_items FOR INSERT WITH CHECK (
  order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default products
INSERT INTO public.products (name, description, price, category, image_url) VALUES
('Ejercicios de Ataque Posicional', 'Plantillas completas para mejorar el ataque posicional de tu equipo', 15.99, 'plantilla', '/placeholder.svg?height=200&width=300'),
('Defensa en Zona', 'Estrategias defensivas modernas para organizar tu equipo', 12.99, 'plantilla', '/placeholder.svg?height=200&width=300'),
('Transiciones Ofensivas', 'Ejercicios para mejorar las transiciones rápidas', 18.99, 'plantilla', '/placeholder.svg?height=200&width=300'),
('Jugadas a Balón Parado', 'Colección de jugadas ensayadas para situaciones especiales', 14.99, 'plantilla', '/placeholder.svg?height=200&width=300'),
('Metodología de Entrenamiento Moderno', 'Guía completa sobre las últimas tendencias en entrenamiento', 29.99, 'ebook', '/placeholder.svg?height=200&width=300'),
('Táctica y Estrategia Futbolística', 'Manual avanzado de táctica para entrenadores', 24.99, 'ebook', '/placeholder.svg?height=200&width=300'),
('Preparación Física en el Fútbol', 'Todo sobre acondicionamiento físico específico', 22.99, 'ebook', '/placeholder.svg?height=200&width=300'),
('Psicología Deportiva Aplicada', 'Herramientas psicológicas para el alto rendimiento', 19.99, 'ebook', '/placeholder.svg?height=200&width=300');
