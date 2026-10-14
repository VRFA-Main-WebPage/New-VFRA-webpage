import { SEO } from "@/components/SEO";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/useRazorpay";
import {
  useWebsiteContent,
  defaultEventsExtendedContent,
  EventsExtendedContent,
} from "@/hooks/useWebsiteContent";
import { APPLE_EASE } from "@/lib/motion";

interface Event {
  id: string;
  title: string;
  event_type: string;
  event_date: string;
  event_time: string | null;
  location: string | null;
  mode: string | null;
  price: string | null;
  seats_available: number | null;
  description: string | null;
  is_published: boolean | null;
}

const Events = () => {
  const { toast } = useToast();
  const { openPayment, isLoading: paymentLoading } = useRazorpay();
  const { content: extendedContent } = useWebsiteContent<EventsExtendedContent>(
    "events_extended",
    defaultEventsExtendedContent
  );

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setAllEvents(data || []);
    }
    setLoading(false);
  };

  const todayIso = useMemo(() => new Date().toISOString().split("T")[0], []);

  const upcomingEvents = useMemo(() => {
    const list = allEvents.filter((evt) => evt.event_date >= todayIso);
    if (typeFilter === "All") return list;
    return list.filter(
      (evt) => evt.event_type.toLowerCase() === typeFilter.toLowerCase()
    );
  }, [allEvents, todayIso, typeFilter]);

  const pastDatabaseEvents = useMemo(() => {
    return allEvents
      .filter((evt) => evt.event_date < todayIso)
      .sort((a, b) => b.event_date.localeCompare(a.event_date));
  }, [allEvents, todayIso]);

  const parsePrice = (priceStr: string | null): number => {
    if (!priceStr || priceStr.toLowerCase() === "free") return 0;
    const match = priceStr.replace(/[₹,]/g, "").match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setFormData({ name: "", email: "", phone: "" });
    setRegistrationOpen(true);
  };

  const handleRegistration = async () => {
    if (!selectedEvent || !formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const price = parsePrice(selectedEvent.price);
    setRegistering(true);

    try {
      if (price === 0) {
        const { error } = await supabase.from("event_registrations").insert({
          event_id: selectedEvent.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          amount: 0,
          payment_status: "completed",
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "You have successfully registered for this event.",
        });
        setRegistrationOpen(false);
        fetchEvents();
      } else {
        const response = await supabase.functions.invoke("create-razorpay-order", {
          body: {
            eventId: selectedEvent.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            amount: price,
          },
        });

        if (response.error) {
          throw new Error(response.error.message || "Failed to create order");
        }

        const { orderId, registrationId, keyId, amount } = response.data;

        openPayment({
          key: keyId,
          amount: amount,
          currency: "INR",
          name: "VFRA",
          description: selectedEvent.title,
          order_id: orderId,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#111111" },
          handler: async (paymentResponse) => {
            const verifyResponse = await supabase.functions.invoke(
              "verify-razorpay-payment",
              {
                body: {
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  registrationId,
                },
              }
            );

            if (verifyResponse.data?.verified) {
              toast({
                title: "Payment Successful!",
                description: "You have successfully registered for this event.",
              });
              setRegistrationOpen(false);
              fetchEvents();
            } else {
              toast({
                title: "Payment Failed",
                description:
                  "Payment verification failed. Please contact support.",
                variant: "destructive",
              });
            }
          },
          modal: {
            ondismiss: () => {
              toast({
                title: "Cancelled",
                description: "Payment was cancelled",
              });
            },
          },
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Registration failed",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const eventTypes = ["All", "Workshop", "Training", "Webinar", "Conference"];

  return (
    <>
      <SEO
        title="Upcoming Events & Forensic Programmes | VFRA Nagpur"
        description="Upcoming workshops, forensic training programmes, webinars, and institutional sessions by Vigilant Forensic Research & Analysis."
      />
      <div className="bg-background overflow-x-hidden">
        {/* Hero Header */}
        <section className="pt-28 pb-16 md:pt-36 md:pb-20 border-b border-border">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: APPLE_EASE }}
              className="max-w-3xl"
            >
              <span className="section-eyebrow">
                01 / Academic & Institutional Calendar
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-foreground leading-[1.06] mb-6">
                Forensic Workshops &{" "}
                <span className="text-muted-foreground font-normal">
                  Upcoming Events.
                </span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Participate in hands-on digital forensics training, law enforcement
                briefings, and certified technical workshops hosted by VFRA.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Controls Bar: Upcoming vs Past + Event Type Filter */}
        <section className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="container py-4 flex flex-col gap-3">
            <div className="inline-flex items-center p-1 bg-secondary border border-border rounded-lg self-start">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-4 py-1.5 rounded-md font-mono text-xs uppercase tracking-[0.12em] transition-all ${
                  activeTab === "upcoming"
                    ? "bg-background text-foreground shadow-sm font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Upcoming ({allEvents.filter((e) => e.event_date >= todayIso).length})
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-4 py-1.5 rounded-md font-mono text-xs uppercase tracking-[0.12em] transition-all ${
                  activeTab === "past"
                    ? "bg-background text-foreground shadow-sm font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Past Archive (
                {pastDatabaseEvents.length +
                  (extendedContent.pastEvents?.length || 0)}
                )
              </button>
            </div>

            {activeTab === "upcoming" && (
              <div className="flex items-center gap-2 flex-wrap">
                {eventTypes.map((type) => {
                  const active = typeFilter === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setTypeFilter(type)}
                      className={`px-3.5 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-[0.12em] whitespace-nowrap transition-all ${
                        active
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Events Display */}
        <section className="py-16 md:py-24">
          <div className="container">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-foreground" />
              </div>
            ) : activeTab === "upcoming" ? (
              upcomingEvents.length === 0 ? (
                <div className="border border-border rounded-xl p-12 text-center bg-secondary/30 max-w-2xl mx-auto">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                    STATUS / SCHEDULE UPDATING
                  </p>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No Upcoming Programmes Matching Filter
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    New workshops and training cohorts are scheduled regularly. Check
                    our Past Archive or request a custom institutional training session.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {typeFilter !== "All" && (
                      <button
                        onClick={() => setTypeFilter("All")}
                        className="btn-outline-gold text-xs py-2.5 px-5"
                      >
                        Reset Filter
                      </button>
                    )}
                    <Link
                      to="/contact"
                      className="btn-gold inline-flex items-center gap-2 text-xs py-2.5 px-5"
                    >
                      Request Institutional Training
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {upcomingEvents.map((event, index) => {
                    const extraMeta =
                      extendedContent.mediaByEventId?.[event.id] || {};
                    const isSoldOut =
                      event.seats_available !== null && event.seats_available <= 0;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.06,
                          ease: APPLE_EASE,
                        }}
                        className="premium-card overflow-hidden flex flex-col justify-between group"
                      >
                        <div>
                          {extraMeta.banner_url && (
                            <div className="aspect-[16/9] w-full overflow-hidden border-b border-border bg-secondary relative">
                              <img
                                src={extraMeta.banner_url}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                              />
                              <div className="absolute top-3 left-3 flex items-center gap-2">
                                <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded bg-background/90 backdrop-blur-md text-foreground border border-border">
                                  {event.event_type}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="p-7 md:p-8">
                            <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b border-border">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground font-medium">
                                  UPCOMING · {event.event_type}
                                </span>
                              </div>
                              <span className="font-mono text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 rounded border border-border text-muted-foreground">
                                {event.mode || "Offline"}
                              </span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-3 leading-snug">
                              {event.title}
                            </h3>
                            {event.description && (
                              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                {event.description}
                              </p>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4 border-y border-border text-xs">
                              <div className="flex items-center gap-2.5 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 text-foreground shrink-0" />
                                <span className="font-mono">
                                  {new Date(event.event_date).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                              {event.event_time && (
                                <div className="flex items-center gap-2.5 text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5 text-foreground shrink-0" />
                                  <span className="font-mono">{event.event_time}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2.5 text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 text-foreground shrink-0" />
                                <span className="truncate">
                                  {event.location || "TBA"}
                                </span>
                              </div>
                              {event.seats_available !== null && (
                                <div className="flex items-center gap-2.5 text-muted-foreground">
                                  <Users className="h-3.5 w-3.5 text-foreground shrink-0" />
                                  <span className="font-mono">
                                    {event.seats_available > 0
                                      ? `${event.seats_available} SEATS AVAILABLE`
                                      : "SOLD OUT"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="px-7 pb-7 md:px-8 md:pb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground block">
                              REGISTRATION FEE
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-foreground tracking-tight">
                                {event.price || "Free"}
                              </span>
                              {event.price &&
                                event.price.toLowerCase() !== "free" && (
                                  <span className="font-mono text-[11px] text-muted-foreground">
                                    + GST
                                  </span>
                                )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {extraMeta.registration_url && (
                              <a
                                href={extraMeta.registration_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline-gold inline-flex items-center gap-1.5 text-xs py-2.5 px-4"
                              >
                                Details
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => handleRegisterClick(event)}
                              disabled={isSoldOut}
                              className="btn-gold inline-flex items-center gap-2 text-xs py-2.5 px-5 disabled:opacity-40"
                            >
                              {isSoldOut ? "Sold Out" : "Register Now"}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Past Events Tab */
              <div className="space-y-8">
                {pastDatabaseEvents.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {pastDatabaseEvents.map((event) => {
                      const extraMeta =
                        extendedContent.mediaByEventId?.[event.id] || {};
                      return (
                        <div
                          key={event.id}
                          className="premium-card overflow-hidden p-7 flex flex-col justify-between opacity-90"
                        >
                          <div>
                            {extraMeta.banner_url && (
                              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg mb-5 border border-border bg-secondary">
                                <img
                                  src={extraMeta.banner_url}
                                  alt={event.title}
                                  className="w-full h-full object-cover grayscale"
                                />
                              </div>
                            )}
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-1 rounded bg-secondary text-muted-foreground border border-border">
                                CONCLUDED · {event.event_type}
                              </span>
                              <span className="font-mono text-xs text-muted-foreground">
                                {new Date(event.event_date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">
                              {event.title}
                            </h3>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mb-4">
                                {event.description}
                              </p>
                            )}
                          </div>
                          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
                            <span>{event.location || "Nagpur"}</span>
                            <span>{event.mode || "Offline"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                  {(extendedContent.pastEvents || []).map((item, idx) => (
                    <motion.div
                      key={item.id || idx}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: idx * 0.06,
                        ease: APPLE_EASE,
                      }}
                      className="premium-card overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        {item.banner_url && (
                          <div className="aspect-[16/10] w-full overflow-hidden border-b border-border bg-secondary">
                            <img
                              src={item.banner_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em] px-2.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                              ARCHIVE RECORD
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {item.date}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-foreground tracking-tight mb-2 leading-snug">
                            {item.title}
                          </h4>
                          {item.summary && (
                            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                              {item.summary}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="px-6 pb-6 pt-3 border-t border-border text-xs space-y-1">
                        <div className="font-mono text-foreground font-medium">
                          {item.participants}
                        </div>
                        <div className="text-muted-foreground">{item.location}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Institutional Custom Training Section */}
        <section className="py-20 md:py-28 bg-secondary/50 border-t border-border">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-6">
                <span className="section-eyebrow">02 / Institutional Programmes</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-[-0.03em] mb-4">
                  Custom Forensic Training for Your Organization.
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
                  We design bespoke curriculum modules for law enforcement units,
                  government departments, universities, and corporate incident
                  response teams.
                </p>
                <Link
                  to="/contact"
                  className="btn-gold inline-flex items-center gap-2 text-sm"
                >
                  Request Institutional Proposal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="lg:col-span-6 grid sm:grid-cols-2 gap-px bg-border border border-border rounded-xl overflow-hidden">
                {[
                  {
                    step: "01",
                    title: "Needs Assessment",
                    desc: "Analysis of operational skill gaps and evidentiary requirements.",
                  },
                  {
                    step: "02",
                    title: "Custom Curriculum",
                    desc: "Tailored syllabus built around real forensic case studies.",
                  },
                  {
                    step: "03",
                    title: "Hands-On Lab Drills",
                    desc: "Practical investigation exercises with industry-grade tools.",
                  },
                  {
                    step: "04",
                    title: "Verified Certification",
                    desc: "Tamper-evident digital credentials verifiable on the VFRA registry.",
                  },
                ].map((item) => (
                  <div key={item.step} className="bg-background p-6">
                    <span className="font-mono text-xs text-muted-foreground block mb-3">
                      PHASE / {item.step}
                    </span>
                    <h4 className="text-base font-semibold text-foreground mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Registration Dialog */}
        <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
          <DialogContent className="sm:max-w-md border-border">
            <DialogHeader>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">
                PROGRAMME REGISTRATION
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight">
                {selectedEvent?.title}
              </DialogTitle>
              <DialogDescription className="pt-1">
                {selectedEvent?.price &&
                selectedEvent.price.toLowerCase() !== "free" ? (
                  <span className="font-mono text-xs text-foreground font-medium">
                    Fee: {selectedEvent.price} + GST
                  </span>
                ) : (
                  <span className="font-mono text-xs text-muted-foreground">
                    Complimentary Registration (Free)
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="name@institution.org"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <button
                onClick={handleRegistration}
                className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2 mt-2"
                disabled={registering || paymentLoading}
              >
                {registering || paymentLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : parsePrice(selectedEvent?.price || null) === 0 ? (
                  "Confirm Registration (Free)"
                ) : (
                  `Pay ${selectedEvent?.price} & Register`
                )}
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Events;
