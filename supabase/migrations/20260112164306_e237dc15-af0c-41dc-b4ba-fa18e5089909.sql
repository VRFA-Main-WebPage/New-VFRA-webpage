-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view offer letters" ON public.offer_letters;

-- Create a secure SELECT policy that restricts access
CREATE POLICY "Users can view own or received offer letters"
ON public.offer_letters
FOR SELECT
TO authenticated
USING (
  created_by = auth.uid() 
  OR has_role(auth.uid(), 'admin'::app_role)
);