import { SEO } from "@/components/SEO";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Dispatch Logged",
      description: "Our forensic desk will respond within 24 hours.",
    });

    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <>
      <SEO
        title="Contact Laboratory | VFRA"
        description="Get in touch with Vigilant Forensic Research and Analytics Pvt. Ltd. (VFRA) for digital forensics and investigation support."
      />
      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="container max-w-3xl">
            <span className="section-eyebrow">LABORATORY DISPATCH // HEADQUARTERS</span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#111111] tracking-[-0.035em] mb-4">
              Contact Our Forensic Desk.
            </h1>
            <p className="text-base md:text-lg text-[#555555] leading-relaxed">
              Need an expert consultation, platform demonstration, or institutional training quote? Reach out to our laboratory for confidential assistance.
            </p>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-12 gap-10">
              {/* Left Column: Specification Cards */}
              <div className="lg:col-span-4 space-y-4">
                <div className="premium-card p-6 bg-[#F7F7F5]/60">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5E3]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#555555]">
                      01 // DIRECT LINE
                    </span>
                    <Phone className="h-4 w-4 text-[#111111]" />
                  </div>
                  <p className="font-mono text-base font-semibold text-[#111111]">
                    {content.phone}
                  </p>
                </div>

                <div className="premium-card p-6 bg-[#F7F7F5]/60">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5E3]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#555555]">
                      02 // ELECTRONIC MAIL
                    </span>
                    <Mail className="h-4 w-4 text-[#111111]" />
                  </div>
                  <p className="font-mono text-sm font-semibold text-[#111111] break-all">
                    {content.email}
                  </p>
                </div>

                <div className="premium-card p-6 bg-[#F7F7F5]/60">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5E3]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#555555]">
                      03 // HEADQUARTERS
                    </span>
                    <MapPin className="h-4 w-4 text-[#111111]" />
                  </div>
                  <p className="text-sm text-[#111111] leading-relaxed">
                    {content.address}
                    <br />
                    {content.addressLine2}
                    <br />
                    {content.addressLine3}
                  </p>
                </div>

                <div className="premium-card p-6 bg-[#F7F7F5]/60">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E5E3]">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#555555]">
                      04 // OPERATING HOURS
                    </span>
                    <Clock className="h-4 w-4 text-[#111111]" />
                  </div>
                  <p className="text-sm text-[#111111]">{content.workingHours}</p>
                  <p className="font-mono text-xs text-[#555555] mt-1">
                    Emergency Incident Response: 24/7
                  </p>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="lg:col-span-8">
                <div className="premium-card p-6 md:p-10 bg-white">
                  <div className="pb-6 mb-8 border-b border-[#E5E5E3]">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#555555]">
                      CONFIDENTIAL INQUIRY FORM
                    </span>
                    <h2 className="font-heading text-2xl font-bold text-[#111111] mt-1">
                      Send a Direct Message
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider">
                          Full Name *
                        </Label>
                        <Input id="name" placeholder="Enter full name" required className="h-11 bg-[#F7F7F5]/50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@organization.com"
                          required
                          className="h-11 bg-[#F7F7F5]/50"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-mono text-xs uppercase tracking-wider">
                          Phone Number
                        </Label>
                        <Input id="phone" placeholder="+91 9XXXXXXXXX" className="h-11 bg-[#F7F7F5]/50" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="organization" className="font-mono text-xs uppercase tracking-wider">
                          Institution / Organization
                        </Label>
                        <Input
                          id="organization"
                          placeholder="Law Firm, Police Unit, Enterprise"
                          className="h-11 bg-[#F7F7F5]/50"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="inquiry-type" className="font-mono text-xs uppercase tracking-wider">
                          Inquiry Classification *
                        </Label>
                        <Select required>
                          <SelectTrigger className="h-11 bg-[#F7F7F5]/50">
                            <SelectValue placeholder="Select classification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="case-consultation">Case Consultation</SelectItem>
                            <SelectItem value="forensic-services">Forensic Services</SelectItem>
                            <SelectItem value="training">Training &amp; Workshops</SelectItem>
                            <SelectItem value="incident-response">Incident Response</SelectItem>
                            <SelectItem value="partnership">Institutional Partnership</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="font-mono text-xs uppercase tracking-wider">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          placeholder="Brief subject line"
                          required
                          className="h-11 bg-[#F7F7F5]/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-mono text-xs uppercase tracking-wider">
                        Case / Inquiry Details *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Describe your technical requirements or inquiry details..."
                        rows={5}
                        required
                        className="bg-[#F7F7F5]/50"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-xs text-[#555555]">
                        All communications are logged under strict confidentiality.
                      </p>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 px-8 bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase tracking-[0.1em] gap-2"
                      >
                        {isSubmitting ? (
                          "Transmitting..."
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Transmit Inquiry
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;