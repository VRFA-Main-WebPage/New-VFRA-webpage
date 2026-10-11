import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { APPLE_EASE } from "@/lib/motion";
import vfraLogo from "@/assets/vfra-logo.png";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Gallery", href: "/gallery" },
  { title: "Upcoming Events", href: "/events" },
  { title: "Insights", href: "/blog" },
  { title: "Verify", href: "/verify" },
  { title: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-[#E5E5E3]"
          : "bg-white/75 backdrop-blur-md border-b border-[#E5E5E3]/70"
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Brand Identity */}
        <Link
          to="/"
          className="flex items-center gap-3 min-w-0 shrink-0 group focus:outline-none"
        >
          <div className="h-9 w-9 rounded-md border border-[#E5E5E3] bg-[#F7F7F5] p-1 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
            <img
              src={vfraLogo}
              alt="VFRA"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-[13px] sm:text-sm tracking-[-0.02em] text-[#111111]">
              VIGILANT FORENSIC
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] text-[#555555] mt-1">
              Research &amp; Analytics · Nagpur
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Primary Navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                cn(
                  "relative px-3 py-1.5 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-300 rounded-md",
                  isActive
                    ? "text-[#111111] bg-[#F7F7F5]"
                    : "text-[#555555] hover:text-[#111111] hover:bg-[#F7F7F5]/60"
                )
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <Link to="/track-case">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3.5 text-[12px] font-mono uppercase tracking-[0.08em] text-[#555555] hover:text-[#111111] hover:bg-[#F7F7F5]"
            >
              Track Case
            </Button>
          </Link>
          <Link to="/submit-case">
            <Button
              size="sm"
              className="h-9 px-4 bg-[#111111] text-white hover:bg-[#2A2A2A] text-[12px] font-medium tracking-[-0.01em] rounded-md gap-1.5 transition-all duration-300"
            >
              Register Case
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          className="xl:hidden p-2 text-[#111111] hover:bg-[#F7F7F5] rounded-md transition-colors ml-auto lg:ml-0"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: APPLE_EASE }}
            className="xl:hidden border-t border-[#E5E5E3] bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <nav className="container py-5 flex flex-col gap-1">
              {navLinks.map((link, idx) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between py-3 px-3 rounded-md text-sm font-medium border-b border-[#E5E5E3]/50 last:border-b-0 transition-colors",
                      isActive
                        ? "text-[#111111] bg-[#F7F7F5] font-semibold"
                        : "text-[#555555] hover:text-[#111111]"
                    )
                  }
                >
                  <span>{link.title}</span>
                  <span className="font-mono text-[10px] text-[#71717A]">
                    0{idx + 1}
                  </span>
                </NavLink>
              ))}
              <div className="pt-4 mt-2 grid grid-cols-2 gap-3 border-t border-[#E5E5E3]">
                <Link to="/track-case" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full h-11 border-[#D4D4D0] text-[#111111] font-mono text-xs uppercase tracking-wider"
                  >
                    Track Case
                  </Button>
                </Link>
                <Link to="/submit-case" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-11 bg-[#111111] text-white hover:bg-[#2A2A2A] text-xs font-medium">
                    Register Case
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
