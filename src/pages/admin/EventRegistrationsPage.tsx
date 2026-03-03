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
    <div className="container mx-auto px-4 py-8">

      <Button
        variant="outline"
        className="mb-6"
        onClick={() => navigate("/admin/events")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {eventData?.title ?? "Event Registrations"}
          </CardTitle>
          <CardDescription>
            {registrations?.length ?? 0} Total Registrations
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : registrations?.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No registrations for this event.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Phone</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Payment Status</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg: any) => (
                    <tr key={reg.id} className="border-b">
                      <td className="py-2">{reg.name}</td>
                      <td className="py-2">{reg.email}</td>
                      <td className="py-2">{reg.phone ?? "-"}</td>
                      <td className="py-2">₹{reg.amount}</td>
                      <td className="py-2 capitalize">
                        {reg.payment_status}
                      </td>
                      <td className="py-2">
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