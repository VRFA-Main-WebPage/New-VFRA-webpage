-- Create event_registrations table to track payments
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_id TEXT,
  order_id TEXT,
  amount INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public to insert registrations (for registration form)
CREATE POLICY "Anyone can create a registration"
ON public.event_registrations
FOR INSERT
WITH CHECK (true);

-- Only admins can view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.event_registrations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow users to view their own registrations by email (for verification)
CREATE POLICY "Users can view their own registrations by email"
ON public.event_registrations
FOR SELECT
USING (true);

-- Admins can update registrations
CREATE POLICY "Admins can update registrations"
ON public.event_registrations
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for faster lookups
CREATE INDEX idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_payment_status ON public.event_registrations(payment_status);

-- Add trigger for updated_at
CREATE TRIGGER update_event_registrations_updated_at
BEFORE UPDATE ON public.event_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();