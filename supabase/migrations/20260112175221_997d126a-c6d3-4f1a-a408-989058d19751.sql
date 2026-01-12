-- Create website_content table for all editable sections
CREATE TABLE public.website_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view content (public website)
CREATE POLICY "Public can view website content" ON public.website_content
  FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage website content" ON public.website_content
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_website_content_updated_at
  BEFORE UPDATE ON public.website_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  organization TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active testimonials" ON public.testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active partners" ON public.partners
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage partners" ON public.partners
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create services table for editable services
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Shield',
  image_url TEXT,
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  href TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active services" ON public.services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services" ON public.services
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create case_studies table for showcase
CREATE TABLE public.case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  outcome TEXT,
  impact TEXT,
  services TEXT[] DEFAULT ARRAY[]::TEXT[],
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active case studies" ON public.case_studies
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage case studies" ON public.case_studies
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for website assets
INSERT INTO storage.buckets (id, name, public) VALUES ('website-assets', 'website-assets', true);

-- Storage policies for website assets
CREATE POLICY "Public can view website assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'website-assets');

CREATE POLICY "Admins can upload website assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'website-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update website assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'website-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete website assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'website-assets' AND public.has_role(auth.uid(), 'admin'));

-- Seed initial website content
INSERT INTO public.website_content (section_key, content) VALUES
  ('hero', '{"title": "Digital Forensics & Cybercrime Investigation", "subtitle": "India''s Premier Forensic Laboratory", "description": "Expert analysis and investigation services for digital evidence, cybercrime cases, and electronic discovery."}'::jsonb),
  ('cta', '{"title": "Ready to Solve Your Case?", "description": "Get expert forensic analysis and investigation services. Contact us today for a consultation.", "buttonText": "Contact Us", "buttonLink": "/contact"}'::jsonb);