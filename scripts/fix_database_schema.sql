-- Ensure all necessary columns are present in the tables
-- Add nickname and address columns to homes table if they don't exist
ALTER TABLE public.homes ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE public.homes ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.homes ADD COLUMN IF NOT EXISTS image_url TEXT; -- Ensure image_url is also present

-- Add mileage column to vehicles table if it doesn't exist
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS mileage BIGINT; -- Use BIGINT for mileage
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS image_url TEXT; -- Ensure image_url is also present

-- Add address column to service_providers table if it doesn't exist
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.service_providers ADD COLUMN IF NOT EXISTS image_url TEXT; -- Ensure image_url is also present

-- Ensure other tables have image_url if needed
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.outside_items ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.purchases ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.maintenances ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.improvements ADD COLUMN IF NOT EXISTS image_url TEXT;
-- Use singular table name consistently
ALTER TABLE public.vehicle_maintenance ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.vehicle_repairs ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Enable RLS on all tables (important for security)
ALTER TABLE public.homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outside_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_repairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts when recreating)
DROP POLICY IF EXISTS "Users can view own homes" ON public.homes;
DROP POLICY IF EXISTS "Users can insert own homes" ON public.homes;
DROP POLICY IF EXISTS "Users can update own homes" ON public.homes;
DROP POLICY IF EXISTS "Users can delete own homes" ON public.homes;

DROP POLICY IF EXISTS "Users can view own rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can insert own rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can update own rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can delete own rooms" ON public.rooms;

DROP POLICY IF EXISTS "Users can view own outside_items" ON public.outside_items;
DROP POLICY IF EXISTS "Users can insert own outside_items" ON public.outside_items;
DROP POLICY IF EXISTS "Users can update own outside_items" ON public.outside_items;
DROP POLICY IF EXISTS "Users can delete own outside_items" ON public.outside_items;

DROP POLICY IF EXISTS "Users can view own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can insert own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can update own purchases" ON public.purchases;
DROP POLICY IF EXISTS "Users can delete own purchases" ON public.purchases;

DROP POLICY IF EXISTS "Users can view own maintenances" ON public.maintenances;
DROP POLICY IF EXISTS "Users can insert own maintenances" ON public.maintenances;
DROP POLICY IF EXISTS "Users can update own maintenances" ON public.maintenances;
DROP POLICY IF EXISTS "Users can delete own maintenances" ON public.maintenances;

DROP POLICY IF EXISTS "Users can view own improvements" ON public.improvements;
DROP POLICY IF EXISTS "Users can insert own improvements" ON public.improvements;
DROP POLICY IF EXISTS "Users can update own improvements" ON public.improvements;
DROP POLICY IF EXISTS "Users can delete own improvements" ON public.improvements;

DROP POLICY IF EXISTS "Users can view own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can insert own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can update own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Users can delete own vehicles" ON public.vehicles;

DROP POLICY IF EXISTS "Users can view own vehicle_maintenance" ON public.vehicle_maintenance;
DROP POLICY IF EXISTS "Users can insert own vehicle_maintenance" ON public.vehicle_maintenance;
DROP POLICY IF EXISTS "Users can update own vehicle_maintenance" ON public.vehicle_maintenance;
DROP POLICY IF EXISTS "Users can delete own vehicle_maintenance" ON public.vehicle_maintenance;

DROP POLICY IF EXISTS "Users can view own vehicle_repairs" ON public.vehicle_repairs;
DROP POLICY IF EXISTS "Users can insert own vehicle_repairs" ON public.vehicle_repairs;
DROP POLICY IF EXISTS "Users can update own vehicle_repairs" ON public.vehicle_repairs;
DROP POLICY IF EXISTS "Users can delete own vehicle_repairs" ON public.vehicle_repairs;

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

DROP POLICY IF EXISTS "All users can view service_providers" ON public.service_providers;
DROP POLICY IF EXISTS "Users can insert own service_providers" ON public.service_providers;
DROP POLICY IF EXISTS "Users can update own service_providers" ON public.service_providers;
DROP POLICY IF EXISTS "Users can delete own service_providers" ON public.service_providers;

DROP POLICY IF EXISTS "All users can view posts" ON public.posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

-- Create RLS policies for user-scoped tables
CREATE POLICY "Users can view own homes" ON public.homes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own homes" ON public.homes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own homes" ON public.homes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own homes" ON public.homes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own rooms" ON public.rooms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rooms" ON public.rooms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own rooms" ON public.rooms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own rooms" ON public.rooms FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own outside_items" ON public.outside_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own outside_items" ON public.outside_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own outside_items" ON public.outside_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own outside_items" ON public.outside_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own purchases" ON public.purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON public.purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own purchases" ON public.purchases FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own purchases" ON public.purchases FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own maintenances" ON public.maintenances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own maintenances" ON public.maintenances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own maintenances" ON public.maintenances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own maintenances" ON public.maintenances FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own improvements" ON public.improvements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own improvements" ON public.improvements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own improvements" ON public.improvements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own improvements" ON public.improvements FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own vehicles" ON public.vehicles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vehicles" ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vehicles" ON public.vehicles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vehicles" ON public.vehicles FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own vehicle_maintenance" ON public.vehicle_maintenance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vehicle_maintenance" ON public.vehicle_maintenance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vehicle_maintenance" ON public.vehicle_maintenance FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vehicle_maintenance" ON public.vehicle_maintenance FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own vehicle_repairs" ON public.vehicle_repairs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own vehicle_repairs" ON public.vehicle_repairs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vehicle_repairs" ON public.vehicle_repairs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own vehicle_repairs" ON public.vehicle_repairs FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for global tables (service_providers and posts)
CREATE POLICY "All users can view service_providers" ON public.service_providers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own service_providers" ON public.service_providers FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own service_providers" ON public.service_providers FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own service_providers" ON public.service_providers FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "All users can view posts" ON public.posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own posts" ON public.posts FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = created_by);

-- Recreate the summaries function to ensure it works with RLS
CREATE OR REPLACE FUNCTION public.summaries()
RETURNS TABLE (
  homes_count bigint,
  vehicles_count bigint,
  unread_notifications_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.homes WHERE user_id = auth.uid()),
    (SELECT COUNT(*) FROM public.vehicles WHERE user_id = auth.uid()),
    (SELECT COUNT(*) FROM public.notifications WHERE user_id = auth.uid() AND is_read = false);
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.summaries() TO authenticated;

-- Create triggers for notifications (recreate them to ensure they work)
DROP TRIGGER IF EXISTS maintenance_notification_trigger ON public.maintenances;
DROP TRIGGER IF EXISTS vehicle_maintenance_notification_trigger ON public.vehicle_maintenance;

CREATE OR REPLACE FUNCTION create_maintenance_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.due_date IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, entity_id, message, due_date)
    VALUES (
      NEW.user_id,
      'maintenance',
      NEW.id,
      'Maintenance due: ' || COALESCE(NEW.task_name, 'Unnamed task'),
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
      NEW.id,
      'Vehicle service due: ' || COALESCE(NEW.service_type, 'Service'),
      NEW.next_service_date
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER maintenance_notification_trigger
  AFTER INSERT ON public.maintenances
  FOR EACH ROW
  EXECUTE FUNCTION create_maintenance_notification();

CREATE TRIGGER vehicle_maintenance_notification_trigger
  AFTER INSERT ON public.vehicle_maintenance
  FOR EACH ROW
  EXECUTE FUNCTION create_vehicle_maintenance_notification();
