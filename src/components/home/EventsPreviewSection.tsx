import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, MapPin, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";
import {
  useWebsiteContent,
  defaultEventsExtendedContent,
  EventsExtendedContent,
} from "@/hooks/useWebsiteContent";

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  event_type: string;
  location: string | null;
  mode: string | null;
  price: string | null;
  seats_available: number | null;
}

export function EventsPreviewSection() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { content: extContent } = useWebsiteContent<EventsExtendedContent>(
    "events_extended",
    defaultEventsExtendedContent
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await supabase
          .from("events")
          .select("id, title, description, event_date, event_time, event_type, location, mode, price, seats_available")
          .eq("is_published", true)
          .order("event_date", { ascending: true })
          .limit(6);

        if (data) {
          const today = new Date().toISOString().split("T")[0];
          const upcoming = data.filter((e) => e.event_date >= today);
          setEvents(upcoming.length > 0 ? upcoming.slice(0, 3) : data.slice(0, 3));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const displayPastFallback = !loading && events.length === 0;

  return (
    <section className="py-10 md:py-14 bg-white border-b border-[#E5E5E3]">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b border-[#E5E5E3]"
          >
            <div>
              <h2 className="section-heading">
                Workshops, Briefings &amp; Seminars.
              </h2>
            </div>
            <Link to="/events">
              <Button
                variant="outline"
                className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-[0.1em] h-11 px-6 gap-2"
              >
                Explore All Events
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </motion.div>

          {events.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((event, idx) => {
                const extra = extContent.mediaByEventId?.[event.id];
                const isUpcoming = event.event_date >= new Date().toISOString().split("T")[0];
                return (
                  <motion.div key={event.id} variants={fadeUp}>
                    <Link
                      to="/events"
                      className="premium-card flex flex-col justify-between h-full overflow-hidden group bg-[#F7F7F5]/50 hover:bg-white"
                    >
                      <div>
                        {extra?.banner_url && (
                          <div className="aspect-[16/9] w-full overflow-hidden border-b border-[#E5E5E3] bg-[#F0EFEA]">
                            <img
                              src={extra.banner_url}
                              alt={event.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5E5E3]">
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 bg-[#111111] text-white">
                              {isUpcoming ? "UPCOMING" : "SCHEDULED"} · 0{idx + 1}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#555555]">
                              {event.event_type} · {event.mode || "Offline"}
                            </span>
                          </div>

                          <h3 className="font-heading text-lg font-bold text-[#111111] mb-2 group-hover:underline">
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-xs text-[#555555] line-clamp-2 leading-relaxed mb-4">
                              {event.description}
                            </p>
                          )}

                          <div className="space-y-1.5 text-xs text-[#555555] font-mono">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-[#111111]" />
                              <span>
                                {new Date(event.event_date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            {event.event_time && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-[#111111]" />
                                <span>{event.event_time}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5 text-[#111111]" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-4 border-t border-[#E5E5E3] bg-white flex items-center justify-between text-xs font-mono">
                        <span className="font-semibold text-[#111111]">
                          {event.price || "Free"}
                        </span>
                        <span className="text-[#111111] inline-flex items-center gap-1 uppercase tracking-wider">
                          Register <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {(extContent.pastEvents || defaultEventsExtendedContent.pastEvents)
                .slice(0, 3)
                .map((item, idx) => (
                  <motion.div key={item.id || idx} variants={fadeUp}>
                    <Link
                      to="/events"
                      className="premium-card flex flex-col justify-between h-full overflow-hidden group bg-[#F7F7F5]/50 hover:bg-white"
                    >
                      <div>
                        {item.banner_url && (
                          <div className="aspect-[16/9] w-full overflow-hidden border-b border-[#E5E5E3] bg-[#F0EFEA]">
                            <img
                              src={item.banner_url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-[#E5E5E3]">
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2 py-0.5 bg-[#F7F7F5] border border-[#E5E5E3] text-[#111111]">
                              PROGRAMME · 0{idx + 1}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#555555]">
                              {item.date}
                            </span>
                          </div>
                          <h3 className="font-heading text-lg font-bold text-[#111111] mb-2">
                            {item.title}
                          </h3>
                          {item.summary && (
                            <p className="text-xs text-[#555555] leading-relaxed mb-4">
                              {item.summary}
                            </p>
                          )}
                          <div className="space-y-1.5 text-xs text-[#555555] font-mono">
                            <div className="flex items-center gap-2">
                              <Users className="h-3.5 w-3.5 text-[#111111]" />
                              <span>{item.participants}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-[#111111]" />
                              <span className="truncate">{item.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-4 border-t border-[#E5E5E3] bg-white flex items-center justify-between text-xs font-mono">
                        <span className="text-[#555555]">
                          {displayPastFallback ? "View Schedule & Archive" : "Details"}
                        </span>
                        <span className="text-[#111111] font-semibold inline-flex items-center gap-1 uppercase tracking-wider">
                          Events Portal <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
