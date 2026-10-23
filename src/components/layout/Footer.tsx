import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  useWebsiteContent,
  defaultFooterContent,
  defaultContactContent,
  FooterContent,
  ContactContent,
} from "@/hooks/useWebsiteContent";

const footerLinks = {
  services: [
    { title: "All Forensic Services", href: "/services" },
    { title: "Digital & Mobile Forensics", href: "/services" },
    { title: "OSINT & Threat Intelligence", href: "/services" },
    { title: "Section 65B / BSA Certification", href: "/services" },
    { title: "LEA & Corporate Training", href: "/services" },
  ],
  platforms: [
    { title: "InvestiGate Platform", href: "/products" },
    { title: "VFRA-TTI Intelligence", href: "/products" },
    { title: "Forensic Lab Archive", href: "/gallery" },
    { title: "Upcoming Events", href: "/events" },
  ],
  institution: [
    { title: "About VFRA", href: "/about" },
    { title: "Documented Case Studies", href: "/case-studies" },
    { title: "Research & Blog", href: "/blog" },
    { title: "Contact Laboratory", href: "/contact" },
  ],
  operations: [
    { title: "Register a Case", href: "/submit-case" },
    { title: "Institutional Proposals", href: "/contact" },
    { title: "Admin Portal", href: "/admin" },
  ],
};

export function Footer() {
  const { content: footerContent } = useWebsiteContent<FooterContent>("footer", defaultFooterContent);
  const { content: contactContent } = useWebsiteContent<ContactContent>("contact", defaultContactContent);

  return (
    <footer className="bg-[#F7F7F5] border-t border-[#E5E5E3] text-[#111111]">
      <div className="container py-14 md:py-20">
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-[#E5E5E3]">
          {/* Column 1: Institutional Spec Block */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <BrandLogo size="sm" showText={false} interactive={false} />
              <div>
                <p className="font-heading font-bold text-sm tracking-[-0.02em] text-[#111111]">
                  VIGILANT FORENSIC
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#555555]">
                  Research &amp; Analytics Pvt. Ltd.
                </p>
              </div>
            </Link>

            <p className="text-sm text-[#555555] leading-relaxed max-w-sm">
              {footerContent.tagline ||
                "Structured digital forensics, cybercrime investigation support, and legally defensible technical reporting for law enforcement, legal teams, and institutions."}
            </p>

            <div className="space-y-2.5 pt-1 text-xs text-[#555555] font-mono">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-3.5 w-3.5 text-[#111111] shrink-0 mt-0.5" />
                <span className="font-sans text-[13px] leading-relaxed">
                  {contactContent.address}, {contactContent.addressLine2}, {contactContent.addressLine3}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 text-[#111111] shrink-0" />
                <a href={`tel:${contactContent.phone.replace(/\s/g, "")}`} className="hover:text-[#111111] transition-colors">
                  {contactContent.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-[#111111] shrink-0" />
                <a href={`mailto:${contactContent.email}`} className="hover:text-[#111111] transition-colors">
                  {contactContent.email}
                </a>
              </div>
            </div>
          </div>

          {/* Columns 2-5: Navigation Links */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {(
              [
                ["01 / Capabilities", footerLinks.services],
                ["02 / Platforms", footerLinks.platforms],
                ["03 / Institution", footerLinks.institution],
                ["04 / Engagement", footerLinks.operations],
              ] as const
            ).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#111111] font-semibold mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.title}>
                      <Link
                        to={link.href}
                        className="inline-flex items-center gap-1 text-[13px] text-[#555555] hover:text-[#111111] transition-colors"
                      >
                        <span>{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Clinical Metadata Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#555555]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>© {new Date().getFullYear()} Vigilant Forensic Research and Analytics Pvt. Ltd.</p>
            <span className="hidden md:inline text-[#D4D4D0]">|</span>
            <p className="font-mono text-[11px]">
              HQ: Nagpur, Maharashtra (440034)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[#555555]">
            <span>GSTIN: {footerContent.gstin}</span>
            <span>·</span>
            <span>CIN: {footerContent.cin}</span>
            {footerContent.linkedin && footerContent.linkedin !== "#" && (
              <>
                <span>·</span>
                <a
                  href={footerContent.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-[#111111] hover:underline"
                >
                  LinkedIn <ArrowUpRight className="h-3 w-3" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
