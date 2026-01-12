-- Create storage bucket for certificate assets (logos, signatures)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-assets', 'certificate-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for certificate-assets bucket
CREATE POLICY "Authenticated users can upload certificate assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificate-assets');

CREATE POLICY "Anyone can view certificate assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'certificate-assets');

CREATE POLICY "Users can update own certificate assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'certificate-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can delete certificate assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'certificate-assets' AND has_role(auth.uid(), 'admin'::app_role));

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number TEXT NOT NULL UNIQUE,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT,
  certificate_type TEXT NOT NULL DEFAULT 'completion',
  course_name TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  signing_authority_name TEXT NOT NULL,
  signing_authority_designation TEXT,
  logo_url TEXT,
  signature_url TEXT,
  additional_details JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'revoked')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for certificates
CREATE POLICY "Users can view own or all if admin"
ON public.certificates
FOR SELECT
TO authenticated
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can create certificates"
ON public.certificates
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own certificates or admin can update all"
ON public.certificates
FOR UPDATE
TO authenticated
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete certificates"
ON public.certificates
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_certificates_number ON public.certificates(certificate_number);
CREATE INDEX idx_certificates_created_by ON public.certificates(created_by);