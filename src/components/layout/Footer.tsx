import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";

const footerLinks = {
  services: [
    { title: "Digital Forensics", href: "/services/digital-forensics" },
    { title: "Cybercrime Investigation", href: "/services/cybercrime-investigation" },
    { title: "Incident Response", href: "/services/incident-response" },
    { title: "Expert Witness", href: "/services/expert-witness" },
    { title: "Corporate Training", href: "/services/training" },
    { title: "Lab Services", href: "/services/lab-services" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Case Studies", href: "/case-studies" },
    { title: "Events & Training", href: "/events" },
    { title: "Blog", href: "/blog" },
    { title: "Careers", href: "/careers" },
    { title: "Contact", href: "/contact" },
  ],
  resources: [
    { title: "Verify Certificate", href: "/verify" },
    { title: "FAQ", href: "/faq" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Disclaimer", href: "/disclaimer" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Shield className="h-8 w-8 text-sidebar-primary" />
              <span>Forensi<span className="text-sidebar-primary">X</span></span>
            </Link>
            <p className="text-sidebar-foreground/70 text-sm mb-6 max-w-sm">
              India's trusted digital forensics and cybercrime investigation laboratory. 
              Providing expert solutions to law enforcement, government, and corporate clients.
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-sidebar-primary shrink-0" />
                <span className="text-sidebar-foreground/70">
                  123 Cyber Tower, IT Park, Sector 62<br />
                  Noida, Uttar Pradesh 201309
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-sidebar-primary" />
                <span className="text-sidebar-foreground/70">+91 120 456 7890</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-sidebar-primary" />
                <span className="text-sidebar-foreground/70">info@forensix.in</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sidebar-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-sidebar-foreground/60">
            <p>© {new Date().getFullYear()} ForensiX India. All rights reserved.</p>
            <p>GSTIN: 09AAACF1234A1ZZ | CIN: U74999UP2020PTC123456</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
