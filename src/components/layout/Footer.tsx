import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import vfraLogo from "@/assets/vfra-logo.png";
import {
  useWebsiteContent,
  defaultFooterContent,
  defaultContactContent,
  FooterContent,
  ContactContent,
} from "@/hooks/useWebsiteContent";

const footerLinks = {
  services: [
    { title: "All Services", href: "/services" },
    { title: "Digital Forensics", href: "/services#category-a" },
    { title: "OSINT & SOCMINT", href: "/services#category-b" },
    { title: "Legal & Court Support", href: "/services#category-f" },
    { title: "Training Programmes", href: "/services#category-g" },
  ],
  products: [
    { title: "InvestiGate", href: "/contact" },
    { title: "VFRA-TTI", href: "/contact" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Case Studies", href: "/case-studies" },
    { title: "Events & Training", href: "/events" },
    { title: "Contact", href: "/contact" },
  ],
  legal: [
    { title: "Verify Certificate", href: "/verify" },
    { title: "Register Case", href: "/submit-case" },
    { title: "Track Case", href: "/track-case" },
    { title: "Privacy Policy"},
    { title: "Terms of Service"},
  ],
};

export function Footer() {
  const { content: footerContent } = useWebsiteContent<FooterContent>("footer", defaultFooterContent);
  const { content: contactContent } = useWebsiteContent<ContactContent>("contact", defaultContactContent);

  return (
    <footer className="bg-background border-t border-border">
      <div className="container py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={vfraLogo} alt="VFRA" className="h-12 w-auto object-contain" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              {footerContent.tagline ||
                "Vigilant Forensic Research and Analytics — digital forensics, cybercrime investigation support, and intelligence workflows for authorized professional use."}
            </p>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  {contactContent.address}
                  <br />
                  {contactContent.addressLine2}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{contactContent.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>{contactContent.email}</span>
              </div>
            </div>
          </div>

          {(
            [
              ["Services", footerLinks.services],
              ["Products", footerLinks.products],
              ["Company", footerLinks.company],
              ["Legal", footerLinks.legal],
            ] as const
          ).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-sm text-foreground mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Vigilant Forensic Research and Analytics Pvt. Ltd. All rights
            reserved.
          </p>
          <p>
            GSTIN: {footerContent.gstin} · CIN: {footerContent.cin}
          </p>
        </div>
      </div>
    </footer>
  );
}
