import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "ForensiX provided exceptional forensic analysis that was crucial to our investigation. Their expert testimony was clear and compelling in court.",
    author: "Deputy Commissioner of Police",
    organization: "Cyber Crime Cell, Delhi",
  },
  {
    quote: "Their rapid incident response helped us contain a major data breach within hours. Professional, thorough, and completely confidential.",
    author: "Chief Information Security Officer",
    organization: "Leading Private Bank",
  },
  {
    quote: "The training workshops conducted for our officers were extremely practical and well-organized. Highly recommended for law enforcement training.",
    author: "Senior Superintendent of Police",
    organization: "State Cyber Cell",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground">
            Hear from law enforcement agencies, government organizations, and corporate clients 
            who have trusted us with their most sensitive investigations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border/50">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.organization}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
