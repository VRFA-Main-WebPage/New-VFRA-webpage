import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRazorpay } from "@/hooks/useRazorpay";

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

const pastEvents = [
  {
    title: "Dark Web Investigation & Digital Forensics Workshop",
    date: "2026",
    participants: "200+ Students & Faculty",
    location: "Ramdeobaba College of Engineering & Management",
  },
  {
    title: "Cybersecurity Awareness & Digital Fraud Prevention Session",
    date: "2026",
    participants: "500+ Officers & Staff",
    location: "Life Insurance Corporation of India (LIC)",
  },
  {
    title: "Cybercrime Investigation & Digital Evidence Techniques Training",
    date: "2025",
    participants: "1000+ Law Enforcement Personnel",
    location: "Regional Law Enforcement Unit",
  },
];

const Events = () => {
  const { toast } = useToast();
  const { openPayment, isLoading: paymentLoading } = useRazorpay();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
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
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date");

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

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
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const price = parsePrice(selectedEvent.price);
    setRegistering(true);

    try {
      if (price === 0) {
        // Free event - direct registration
        const { error } = await supabase.from("event_registrations").insert({
          event_id: selectedEvent.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          amount: 0,
          payment_status: "completed",
        });

        if (error) throw error;

        toast({ title: "Success!", description: "You have successfully registered for this event." });
        setRegistrationOpen(false);
        fetchEvents();
      } else {
        // Paid event - create Razorpay order
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

        // Open Razorpay checkout
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
          theme: { color: "#D3AA5A" },
          handler: async (paymentResponse) => {
            // Verify payment
            const verifyResponse = await supabase.functions.invoke("verify-razorpay-payment", {
              body: {
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                registrationId,
              },
            });

            if (verifyResponse.data?.verified) {
              toast({ title: "Payment Successful!", description: "You have successfully registered for this event." });
              setRegistrationOpen(false);
              fetchEvents();
            } else {
              toast({ title: "Payment Failed", description: "Payment verification failed. Please contact support.", variant: "destructive" });
            }
          },
          modal: {
            ondismiss: () => {
              toast({ title: "Cancelled", description: "Payment was cancelled" });
            },
          },
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({ 
        title: "Error", 
        description: error instanceof Error ? error.message : "Registration failed", 
        variant: "destructive" 
      });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <>
      <SEO title="Events & Training | VFRA" description="Upcoming events, workshops and training programs by VFRA." />
      <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider font-mono">Events & Training</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
              Learn from the Experts
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our workshops, webinars, and certification programs to enhance your 
              skills in digital forensics and cybersecurity.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upcoming Events
            </h2>
            <p className="text-muted-foreground">
              Register now for our upcoming training programs and workshops.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="bg-card border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={event.mode === "Online" ? "secondary" : "default"}>
                        {event.event_type}
                      </Badge>
                      <Badge variant="outline">{event.mode || "Offline"}</Badge>
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-foreground">
                          {new Date(event.event_date).toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {event.event_time && (
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-foreground">{event.event_time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-foreground">{event.location || "TBA"}</span>
                      </div>
                      {event.seats_available !== null && (
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-foreground">
                            {event.seats_available > 0 ? `${event.seats_available} seats left` : "Sold Out"}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-foreground">
                          {event.price || "Free"}
                        </span>
                        {event.price && event.price.toLowerCase() !== "free" && (
                          <span className="text-sm text-muted-foreground ml-1">+ GST</span>
                        )}
                      </div>
                      <Button 
                        className="gap-2"
                        onClick={() => handleRegisterClick(event)}
                        disabled={event.seats_available !== null && event.seats_available <= 0}
                      >
                        {event.seats_available !== null && event.seats_available <= 0 ? "Sold Out" : "Register Now"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Training Programs</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Custom Training for Your Organization
              </h2>
              <p className="text-muted-foreground mb-6">
                We offer customized training programs tailored to the needs of law enforcement agencies, 
                government organizations, and corporate security teams.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-primary text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Needs Assessment</h4>
                    <p className="text-sm text-muted-foreground">We analyze your team's skill gaps and training requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-primary text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Custom Curriculum</h4>
                    <p className="text-sm text-muted-foreground">Tailored content with relevant case studies and exercises</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-primary text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Hands-on Labs</h4>
                    <p className="text-sm text-muted-foreground">Practical exercises with industry-standard tools</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <span className="text-primary text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Certification</h4>
                    <p className="text-sm text-muted-foreground">Participants receive verified completion certificates</p>
                  </div>
                </div>
              </div>

              <Link to="/contact">
                <Button size="lg" className="gap-2">
                  Request Training Quote
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Past Events */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">Recent Training Programs</h3>
              <div className="space-y-4">
                {pastEvents.map((event, index) => (
                  <Card key={index} className="bg-card border-border/50">
                    <CardContent className="py-4">
                      <h4 className="font-semibold text-foreground">{event.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{event.date}</span>
                        <span>•</span>
                        <span>{event.participants}</span>
                      </div>
                      <p className="text-sm text-primary mt-1">{event.location}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Verification CTA */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Verify Your Certificate
            </h2>
            <p className="text-muted-foreground mb-8">
              Already completed a training program? Verify your certificate authenticity 
              using our online verification system.
            </p>
            <Link to="/verify">
              <Button size="lg" variant="outline" className="gap-2">
                Verify Certificate
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Dialog */}
      <Dialog open={registrationOpen} onOpenChange={setRegistrationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Event</DialogTitle>
            <DialogDescription>
              {selectedEvent?.title}
              {selectedEvent?.price && selectedEvent.price.toLowerCase() !== "free" && (
                <span className="block mt-1 text-primary font-medium">
                  Fee: {selectedEvent.price} + GST
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>
            <Button 
              onClick={handleRegistration} 
              className="w-full" 
              disabled={registering || paymentLoading}
            >
              {registering || paymentLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : parsePrice(selectedEvent?.price || null) === 0 ? (
                "Register (Free)"
              ) : (
                `Pay ${selectedEvent?.price} & Register`
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </>
  );
};

export default Events;
