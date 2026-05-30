---
name: Project context
overview: Create a copy-pasteable “project context brief” describing the VFRA Vigilant Forensic app end-to-end (React/Vite frontend + Supabase backend + Edge Functions), plus pointers to the exact files to change for your next fullstack feature.
todos:
  - id: scan-core-entries
    content: Confirm frontend entry/routing and list exact public + admin route paths from `src/App.tsx`.
    status: pending
  - id: map-supabase-schema
    content: Locate and summarize key Supabase tables, policies, and functions from `supabase/migrations` (cases/events/event_registrations/certificates/user_roles/website_content).
    status: pending
  - id: document-payments-flow
    content: Trace the full Razorpay path across `src/pages/Events.tsx`, `src/hooks/useRazorpay.tsx`, and both Edge Functions; confirm `decrement_event_seats` RPC definition.
    status: pending
  - id: produce-chatgpt-brief
    content: Write the final copy-paste context brief + mermaid sequence diagrams for case submission and Razorpay registration.
    status: pending
isProject: false
---

# Project context brief

## Goal
Produce a clear, ChatGPT-ready brief that explains the project’s architecture and the main end-to-end business flows, so you can request further changes accurately.

## What you will receive
1. High-level architecture (frontend stack, backend stack, why Supabase is the API layer).
2. Routing map (public vs admin routes) and where the route logic lives.
3. Data model map (key tables + what they represent) and how RLS/roles protect admin operations.
4. End-to-end flow diagrams (text/mermaid) for:
   - Case submission + tracking
   - Certificate verification
   - Event registration + Razorpay payment (Edge Functions + Postgres RPC)
5. “Where to edit” cheat sheet for implementing your next feature.

## Evidence and anchors (key files)
- Frontend entry + router:
  - [`src/main.tsx`](src/main.tsx)
  - [`src/App.tsx`](src/App.tsx)
- Supabase client + typed schema:
  - [`src/integrations/supabase/client.ts`](src/integrations/supabase/client.ts)
  - [`src/integrations/supabase/types.ts`](src/integrations/supabase/types.ts)
- Auth + role gating (admin protection):
  - [`src/hooks/useAuth.tsx`](src/hooks/useAuth.tsx)
  - [`src/components/admin/ProtectedRoute.tsx`](src/components/admin/ProtectedRoute.tsx)
- Public flows:
  - Case submission: `src/pages/SubmitCase.tsx`
  - Case tracking: `src/pages/TrackCase.tsx`
  - Certificate verification: `src/pages/Verify.tsx`
  - Events & registration: `src/pages/Events.tsx`
- Admin/CMS & management UI:
  - `src/pages/admin/*`
  - `src/components/admin/cms/*`
- Backend (Supabase Edge Functions for payments):
  - [`supabase/functions/create-razorpay-order/index.ts`](supabase/functions/create-razorpay-order/index.ts)
  - [`supabase/functions/verify-razorpay-payment/index.ts`](supabase/functions/verify-razorpay-payment/index.ts)
- Database schema + RLS policies (migrations):
  - `supabase/migrations/*cases*.sql`, `*event_registrations*.sql`, `*events*.sql`
  - `supabase/migrations/*certificates*.sql`
  - `supabase/migrations/*app_role*` and `*user_roles*`
  - `supabase/migrations/*website_content*` (CMS content)

## Implementation steps (no repo changes)
1. Re-scan the repo (read-only) to confirm the exact route list and the exact payment + seat-decrement/RPC behavior.
2. Write the brief in a structured format optimized for copy/paste into ChatGPT prompts.
3. Include 1-2 mermaid sequence diagrams for the highest-risk flow (Razorpay registration) and a shorter one for case submission.

## Assumptions to validate in the brief
- Public `/verify` access depends on a specific Supabase RLS `SELECT` policy for `certificates` (if it’s missing, we’ll explicitly call it out and recommend the likely fix location). 
- The `decrement_event_seats` Postgres RPC should be documented by locating its migration/definition in `supabase/migrations`.
