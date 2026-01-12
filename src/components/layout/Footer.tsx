import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Linkedin, Twitter, Github, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import vfraLogo from "@/assets/vfra-logo.svg";

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
    <footer className="bg-background border-t border-primary/10 relative overflow-hidden">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-20" />
      
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={vfraLogo} 
                  alt="VFRA - Vigilant Forensic Research and Analytics" 
                  className="h-12 w-auto object-contain [filter:invert(1)_hue-rotate(180deg)_brightness(1.2)_contrast(0.9)]"
                />
              </motion.div>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              India's trusted digital forensics and cybercrime investigation laboratory. 
              Providing expert solutions to law enforcement, government, and corporate clients.
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 group">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  123 Cyber Tower, IT Park, Sector 62<br />
                  Noida, Uttar Pradesh 201309
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors font-mono">+91 120 456 7890</span>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors font-mono">info@forensix.in</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              {[
                { icon: Linkedin, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 hover:border-primary/40 hover:shadow-neon transition-all duration-300"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              Services
            </h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">&gt;</span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">&gt;</span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">&gt;</span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p className="font-mono text-xs">© {new Date().getFullYear()} Vigilant Forensic Research and Analytics Pvt. Ltd. All rights reserved.</p>
            <p className="font-mono text-xs">GSTIN: 09AAACF1234A1ZZ | CIN: U74999UP2020PTC123456</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
