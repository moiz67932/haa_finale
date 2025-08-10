-- Create the images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Set up RLS policies for the images bucket
CREATE POLICY "Images are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images" ON storage.objects
FOR UPDATE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own images" ON storage.objects
FOR DELETE USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
