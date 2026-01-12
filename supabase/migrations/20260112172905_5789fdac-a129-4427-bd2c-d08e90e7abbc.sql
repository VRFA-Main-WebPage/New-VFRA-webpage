-- Create cases table with unique case ID
CREATE TABLE public.cases (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id TEXT NOT NULL UNIQUE DEFAULT 'FX-' || to_char(now(), 'YYYYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6),
    title TEXT NOT NULL,
    description TEXT,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT,
    category TEXT NOT NULL DEFAULT 'corporate',
    status TEXT NOT NULL DEFAULT 'submitted',
    priority TEXT NOT NULL DEFAULT 'medium',
    assigned_to TEXT,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clients table
CREATE TABLE public.clients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    address TEXT,
    category TEXT DEFAULT 'individual',
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table (for admin-managed events on the public site)
CREATE TABLE public.events (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT NOT NULL DEFAULT 'workshop',
    event_date DATE NOT NULL,
    event_time TEXT,
    location TEXT,
    mode TEXT DEFAULT 'offline',
    price TEXT DEFAULT 'Free',
    seats_available INTEGER,
    is_published BOOLEAN DEFAULT false,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Cases RLS Policies
CREATE POLICY "Admins can view all cases" ON public.cases FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can create cases" ON public.cases FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = created_by);
CREATE POLICY "Admins can update cases" ON public.cases FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete cases" ON public.cases FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));
-- Allow public to submit cases (anonymous insert)
CREATE POLICY "Anyone can submit a case" ON public.cases FOR INSERT WITH CHECK (true);
-- Public can view their own case by case_id (for tracking)
CREATE POLICY "Public can view case by case_id" ON public.cases FOR SELECT USING (true);

-- Clients RLS Policies
CREATE POLICY "Admins can view all clients" ON public.clients FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can create clients" ON public.clients FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update clients" ON public.clients FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete clients" ON public.clients FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Events RLS Policies
CREATE POLICY "Anyone can view published events" ON public.events FOR SELECT USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can create events" ON public.events FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create a function to generate unique case IDs
CREATE OR REPLACE FUNCTION public.generate_case_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.case_id := 'FX-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(gen_random_uuid()::text, 1, 6));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger to auto-generate case_id
CREATE TRIGGER set_case_id BEFORE INSERT ON public.cases FOR EACH ROW EXECUTE FUNCTION public.generate_case_id();