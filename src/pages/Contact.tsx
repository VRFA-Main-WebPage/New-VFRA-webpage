import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWebsiteContent, defaultContactContent, ContactContent } from "@/hooks/useWebsiteContent";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { content } = useWebsiteContent<ContactContent>("contact", defaultContactContent);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <SEO title="Contact Us | VFRA" description="Get in touch with our forensic experts for investigation support." />
      <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-10 md:py-20 lg:py-28 bg-gradient-hero border-b border-border overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-eyebrow">Contact Us</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a case to discuss? Need expert consultation? Reach out to our team 
              for confidential assistance with your digital forensics needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 md:py-20 lg:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="premium-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Phone</h3>
                      <p className="text-sm text-muted-foreground mt-1">{content.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <p className="text-sm text-muted-foreground mt-1">{content.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Head Office</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {content.address}<br />
                        {content.addressLine2}<br />
                        {content.addressLine3}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="premium-card">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Working Hours</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {content.workingHours}<br />
                        Emergency: 24/7 Available
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours.
                    For urgent matters, please call our emergency line.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="name@email.com" required />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="+91 9XXXXXXXXX" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization</Label>
                        <Input id="organization" placeholder="Your organization" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inquiry-type">Inquiry Type *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="case-consultation">Case Consultation</SelectItem>
                          <SelectItem value="forensic-services">Forensic Services</SelectItem>
                          <SelectItem value="training">Training & Workshops</SelectItem>
                          <SelectItem value="incident-response">Incident Response</SelectItem>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" placeholder="Brief subject of your inquiry" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your inquiry in detail. All communications are treated as strictly confidential."
                        rows={5}
                        required
                      />
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>* All inquiries are handled with strict confidentiality. By submitting this form, 
                      you agree to our privacy policy.</p>
                    </div>

                    <Button type="submit" size="lg" className="w-full md:w-auto btn-gold" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  </>
  );
};

export default Contact;