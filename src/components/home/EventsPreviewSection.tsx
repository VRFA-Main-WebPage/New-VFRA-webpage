import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fadeUp, useInView } from "@/lib/motion";

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_type: string;
  location: string | null;
}

export function EventsPreviewSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const { ref, inView } = useInView();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("id, title, event_date, event_type, location")
        .eq("is_published", true)
        .gte("event_date", new Date().toISOString().split("T")[0])
        .order("event_date")
        .limit(3);

      if (data) setEvents(data);
    };
    fetchEvents();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="py-10 md:py-20 lg:py-24 bg-background border-b border-border">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="section-eyebrow">Events & Training</p>
              <h2 className="section-heading">Upcoming Programmes</h2>
            </div>
            <Link to="/events">
              <Button variant="outline" className="btn-outline-gold gap-2">
                View All Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {events.map((event) => (
              <Link
                key={event.id}
                to="/events"
                className="premium-card p-5 block group"
              >
                <div className="flex items-center gap-2 text-xs text-primary mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(event.event_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                  {event.title}
                </h3>
                <p className="text-xs text-muted-foreground capitalize">{event.event_type}</p>
                {event.location && (
                  <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
