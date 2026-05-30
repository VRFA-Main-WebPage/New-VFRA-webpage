import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

const EventRegistrationsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Fetch Event Details
  const { data: eventData } = useQuery({
    queryKey: ["event-details", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, event_date")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

  // Fetch Registrations
  const { data: registrations, isLoading } = useQuery({
    queryKey: ["event-registrations", eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select(`
          id,
          name,
          email,
          phone,
          amount,
          payment_status,
          created_at
        `)
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!eventId,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {eventData?.title ?? "Event Registrations"}
          </h2>
          <p className="text-muted-foreground">
            {registrations?.length ?? 0} Total Registrations
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : registrations?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-md border border-dashed">
              No registrations for this event.
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Payment Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg: any) => (
                    <tr key={reg.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium">{reg.name}</td>
                      <td className="py-3 px-4">{reg.email}</td>
                      <td className="py-3 px-4">{reg.phone ?? "-"}</td>
                      <td className="py-3 px-4 font-mono">₹{reg.amount}</td>
                      <td className="py-3 px-4 capitalize">
                        {reg.payment_status}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(reg.created_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRegistrationsPage;