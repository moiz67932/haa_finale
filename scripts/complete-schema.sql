-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create community_posts table (global)
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  image_url TEXT,
  social_link_url TEXT,
  upvotes INTEGER DEFAULT 0
);

-- Update notifications table structure (keeping existing user_id as UUID)
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS entity_id TEXT; -- Changed to TEXT to handle both bigint and uuid
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS due_date DATE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Create missing tables if they don't exist (using BIGINT to match existing structure)
CREATE TABLE IF NOT EXISTS public.rooms (
  id BIGSERIAL PRIMARY KEY,
  home_id BIGINT REFERENCES public.homes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  paint_color TEXT,
  flooring TEXT,
  installer TEXT,
  purchase_from TEXT,
  warranty_json JSONB,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.outside_items (
  id BIGSERIAL PRIMARY KEY,
  home_id BIGINT REFERENCES public.homes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  type TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.purchases (
  id BIGSERIAL PRIMARY KEY,
  home_id BIGINT REFERENCES public.homes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_name TEXT,
  cost DECIMAL,
  purchase_date DATE,
  warranty_end_date DATE,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.home_maintenance (
  id BIGSERIAL PRIMARY KEY,
  home_id BIGINT REFERENCES public.homes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_name TEXT,
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.home_improvements (
  id BIGSERIAL PRIMARY KEY,
  home_id BIGINT REFERENCES public.homes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT,
  completion_date DATE,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vehicle_maintenance (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id BIGINT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT,
  service_date DATE,
  mileage INTEGER,
  cost DECIMAL,
  notes TEXT,
  image_url TEXT,
  next_service_mileage INTEGER,
  next_service_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vehicle_repairs (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id BIGINT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  repair_type TEXT,
  service_date DATE,
  mileage INTEGER,
  cost DECIMAL,
  notes TEXT,
  image_url TEXT,
  part_warranty DATE,
  labor_warranty DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outside_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_repairs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can create posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.community_posts;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for community_posts (global)
CREATE POLICY "Anyone can view posts" ON public.community_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for notifications (user-scoped)
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user-scoped tables
DROP POLICY "Users can view own rooms" ON public.rooms;
DROP POLICY "Users can insert own rooms" ON public.rooms;
DROP POLICY "Users can update own rooms" ON public.rooms;
DROP POLICY "Users can delete own rooms" ON public.rooms;

CREATE POLICY "Users can view own rooms" ON public.rooms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rooms" ON public.rooms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rooms" ON public.rooms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rooms" ON public.rooms FOR DELETE USING (auth.uid() = user_id);

-- outside_items
DROP POLICY IF EXISTS "Users can view own outside_items" ON public.outside_items;
CREATE POLICY "Users can view own outside_items" ON public.outside_items FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own outside_items" ON public.outside_items;
CREATE POLICY "Users can insert own outside_items" ON public.outside_items FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own outside_items" ON public.outside_items;
CREATE POLICY "Users can update own outside_items" ON public.outside_items FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own outside_items" ON public.outside_items;
CREATE POLICY "Users can delete own outside_items" ON public.outside_items FOR DELETE USING (auth.uid() = user_id);


-- purchases
DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;
CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own purchases" ON public.purchases;
CREATE POLICY "Users can insert own purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own purchases" ON public.purchases;
CREATE POLICY "Users can update own purchases" ON public.purchases FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own purchases" ON public.purchases;
CREATE POLICY "Users can delete own purchases" ON public.purchases FOR DELETE USING (auth.uid() = user_id);


-- home_maintenance
DROP POLICY IF EXISTS "Users can view own home_maintenance" ON public.home_maintenance;
CREATE POLICY "Users can view own home_maintenance" ON public.home_maintenance FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own home_maintenance" ON public.home_maintenance;
CREATE POLICY "Users can insert own home_maintenance" ON public.home_maintenance FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own home_maintenance" ON public.home_maintenance;
CREATE POLICY "Users can update own home_maintenance" ON public.home_maintenance FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own home_maintenance" ON public.home_maintenance;
CREATE POLICY "Users can delete own home_maintenance" ON public.home_maintenance FOR DELETE USING (auth.uid() = user_id);


-- home_improvements
DROP POLICY IF EXISTS "Users can view own home_improvements" ON public.home_improvements;
CREATE POLICY "Users can view own home_improvements" ON public.home_improvements FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own home_improvements" ON public.home_improvements;
CREATE POLICY "Users can insert own home_improvements" ON public.home_improvements FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own home_improvements" ON public.home_improvements;
CREATE POLICY "Users can update own home_improvements" ON public.home_improvements FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own home_improvements" ON public.home_improvements;
CREATE POLICY "Users can delete own home_improvements" ON public.home_improvements FOR DELETE USING (auth.uid() = user_id);


-- vehicle_maintenance
DROP POLICY IF EXISTS "Users can view own vehicle_maintenance" ON public.vehicle_maintenance;
CREATE POLICY "Users can view own vehicle_maintenance" ON public.vehicle_maintenance FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicle_maintenance" ON public.vehicle_maintenance;
CREATE POLICY "Users can insert own vehicle_maintenance" ON public.vehicle_maintenance FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicle_maintenance" ON public.vehicle_maintenance;
CREATE POLICY "Users can update own vehicle_maintenance" ON public.vehicle_maintenance FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicle_maintenance" ON public.vehicle_maintenance;
CREATE POLICY "Users can delete own vehicle_maintenance" ON public.vehicle_maintenance FOR DELETE USING (auth.uid() = user_id);


-- vehicle_repairs
DROP POLICY IF EXISTS "Users can view own vehicle_repairs" ON public.vehicle_repairs;
CREATE POLICY "Users can view own vehicle_repairs" ON public.vehicle_repairs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicle_repairs" ON public.vehicle_repairs;
CREATE POLICY "Users can insert own vehicle_repairs" ON public.vehicle_repairs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicle_repairs" ON public.vehicle_repairs;
CREATE POLICY "Users can update own vehicle_repairs" ON public.vehicle_repairs FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicle_repairs" ON public.vehicle_repairs;
CREATE POLICY "Users can delete own vehicle_repairs" ON public.vehicle_repairs FOR DELETE USING (auth.uid() = user_id);


-- Create triggers for notifications
CREATE OR REPLACE FUNCTION create_home_maintenance_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.due_date IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, entity_id, message, due_date)
    VALUES (
      NEW.user_id,
      'home_maintenance',
      NEW.id::TEXT,
      'Home maintenance due: ' || COALESCE(NEW.task_name, 'Unnamed task'),
      NEW.due_date
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_vehicle_maintenance_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.next_service_date IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, entity_id, message, due_date)
    VALUES (
      NEW.user_id,
      'vehicle_maintenance',
      NEW.id::TEXT,
      'Vehicle service due: ' || COALESCE(NEW.service_type, 'Service'),
      NEW.next_service_date
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers
DROP TRIGGER IF EXISTS home_maintenance_notification_trigger ON public.home_maintenance;
DROP TRIGGER IF EXISTS vehicle_maintenance_notification_trigger ON public.vehicle_maintenance;

-- Create triggers
CREATE TRIGGER home_maintenance_notification_trigger
  AFTER INSERT ON public.home_maintenance
  FOR EACH ROW
  EXECUTE FUNCTION create_home_maintenance_notification();

CREATE TRIGGER vehicle_maintenance_notification_trigger
  AFTER INSERT ON public.vehicle_maintenance
  FOR EACH ROW
  EXECUTE FUNCTION create_vehicle_maintenance_notification();

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public uploads are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

CREATE POLICY "Public uploads are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);
