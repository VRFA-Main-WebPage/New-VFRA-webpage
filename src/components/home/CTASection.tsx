import { Link } from "react-router-dom";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Need Urgent Assistance?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            Our expert team is available for emergency incident response and urgent consultations. 
            Contact us now to discuss your case confidentially.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 shadow-lg">
                Schedule Consultation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="tel:+911204567890">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2">
                <Phone className="h-4 w-4" />
                Call: +91 120 456 7890
              </Button>
            </a>
          </div>

          {/* Contact Cards */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4 border border-primary-foreground/20">
              <Phone className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm text-primary-foreground/60">24/7 Emergency</p>
              <p className="font-semibold text-primary-foreground">+91 98765 43210</p>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4 border border-primary-foreground/20">
              <Mail className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-sm text-primary-foreground/60">Email Us</p>
              <p className="font-semibold text-primary-foreground">urgent@forensix.in</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
