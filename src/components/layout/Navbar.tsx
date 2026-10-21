import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { APPLE_EASE } from "@/lib/motion";
import { BrandLogo } from "@/components/brand/BrandLogo";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Products", href: "/products" },
  { title: "Gallery", href: "/gallery" },
  { title: "Upcoming Events", href: "/events" },
  { title: "Blog", href: "/blog" },
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
          ? "bg-white/90 backdrop-blur-xl border-b border-[#E5E5E3] shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          : "bg-white/80 backdrop-blur-md border-b border-[#E5E5E3]/80"
      )}
    >
      <div className="container flex h-20 items-center justify-between gap-6">
        {/* Brand Identity */}
        <Link
          to="/"
          className="flex items-center min-w-0 shrink-0 group focus:outline-none"
        >
          <BrandLogo size="md" showText={true} interactive={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden xl:flex items-center gap-1.5"
          aria-label="Primary Navigation"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                cn(
                  "relative px-4 py-2 text-[15px] font-medium tracking-[-0.01em] transition-colors duration-300 rounded-md",
                  isActive
                    ? "text-[#111111] bg-[#F7F7F5]"
                    : "text-[#555555] hover:text-[#111111] hover:bg-[#F7F7F5]/70"
                )
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        {/* Action Button: Register Case */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link to="/submit-case">
            <Button
              className="h-11 px-5 bg-[#111111] text-white hover:bg-[#2A2A2A] text-sm font-medium tracking-[-0.01em] rounded-md gap-2 transition-all duration-300 shadow-sm"
            >
              Register Case
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          className="xl:hidden p-2.5 text-[#111111] hover:bg-[#F7F7F5] rounded-md transition-colors ml-auto lg:ml-0"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                      "flex items-center justify-between py-3.5 px-3.5 rounded-md text-base font-medium border-b border-[#E5E5E3]/50 last:border-b-0 transition-colors",
                      isActive
                        ? "text-[#111111] bg-[#F7F7F5] font-semibold"
                        : "text-[#555555] hover:text-[#111111]"
                    )
                  }
                >
                  <span>{link.title}</span>
                  <span className="font-mono text-xs text-[#71717A]">
                    0{idx + 1}
                  </span>
                </NavLink>
              ))}
              <div className="pt-4 mt-2 border-t border-[#E5E5E3]">
                <Link to="/submit-case" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-12 bg-[#111111] text-white hover:bg-[#2A2A2A] text-sm font-medium gap-2">
                    Register Case
                    <ArrowUpRight className="h-4 w-4" />
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
