-- Create the blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  category text,
  author text,
  thumbnail_url text,
  seo_title text,
  seo_description text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.blogs FOR SELECT
  USING (status = 'published');

-- Policies for authenticated admins
CREATE POLICY "Admins can manage all blogs"
  ON public.blogs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_modtime
BEFORE UPDATE ON public.blogs
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
