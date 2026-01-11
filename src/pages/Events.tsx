import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const upcomingEvents = [
  {
    id: 1,
    title: "Mobile Forensics Masterclass",
    type: "Workshop",
    date: "2024-02-15",
    time: "09:00 AM - 05:00 PM",
    location: "Noida Lab",
    mode: "Offline",
    price: "₹15,000",
    seats: "20 seats left",
    description: "Hands-on training on Cellebrite UFED and mobile device extraction techniques.",
  },
  {
    id: 2,
    title: "Cyber Law & Digital Evidence",
    type: "Webinar",
    date: "2024-02-20",
    time: "03:00 PM - 05:00 PM",
    location: "Online",
    mode: "Online",
    price: "Free",
    seats: "Unlimited",
    description: "Understanding IT Act provisions and admissibility of digital evidence in Indian courts.",
  },
  {
    id: 3,
    title: "Advanced Incident Response",
    type: "Certificate Course",
    date: "2024-03-01",
    time: "5-Day Program",
    location: "Bangalore",
    mode: "Offline",
    price: "₹45,000",
    seats: "15 seats left",
    description: "Comprehensive training on enterprise incident response and threat hunting.",
  },
  {
    id: 4,
    title: "Ransomware Investigation Techniques",
    type: "Workshop",
    date: "2024-03-10",
    time: "10:00 AM - 04:00 PM",
    location: "Online",
    mode: "Online",
    price: "₹5,000",
    seats: "50 seats left",
    description: "Learn to investigate and trace ransomware attacks with practical case studies.",
  },
];

const pastEvents = [
  {
    title: "Cyber Forensics for Law Enforcement",
    date: "January 2024",
    participants: "45 Officers",
    location: "State Police Academy, UP",
  },
  {
    title: "Corporate Security Awareness Week",
    date: "December 2023",
    participants: "200+ Employees",
    location: "Leading IT Company, Bangalore",
  },
  {
    title: "Digital Evidence Handling Workshop",
    date: "November 2023",
    participants: "30 Lawyers",
    location: "Delhi High Court Bar Association",
  },
];

const Events = () => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20 lg:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-accent mb-2 uppercase tracking-wider">Events & Training</p>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Learn from the Experts
            </h1>
            <p className="text-lg text-primary-foreground/70">
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

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="bg-card border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={event.mode === "Online" ? "secondary" : "default"}>
                      {event.type}
                    </Badge>
                    <Badge variant="outline">{event.mode}</Badge>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-foreground">
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="text-foreground">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-foreground">{event.seats}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">{event.price}</span>
                      {event.price !== "Free" && (
                        <span className="text-sm text-muted-foreground ml-1">+ GST</span>
                      )}
                    </div>
                    <Button className="gap-2">
                      Register Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
    </div>
  );
};

export default Events;
