-- Create function to update timestamps first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create enum for offer letter types
CREATE TYPE public.offer_letter_type AS ENUM ('client_proposal', 'employment_offer', 'partnership_contract');

-- Create enum for offer letter status
CREATE TYPE public.offer_letter_status AS ENUM ('draft', 'sent', 'accepted', 'declined', 'expired');

-- Create offer_letters table
CREATE TABLE public.offer_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    letter_type offer_letter_type NOT NULL,
    status offer_letter_status NOT NULL DEFAULT 'draft',
    recipient_name TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_company TEXT,
    recipient_designation TEXT,
    subject TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    sent_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.offer_letters ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view offer letters"
ON public.offer_letters FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create offer letters"
ON public.offer_letters FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update own offer letters"
ON public.offer_letters FOR UPDATE TO authenticated
USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete offer letters"
ON public.offer_letters FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_offer_letters_updated_at
BEFORE UPDATE ON public.offer_letters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();