import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import vfraLogo from "@/assets/vfra-logo.png";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Events", href: "/events" },
  { title: "Blogs", href: "/blog" },
  { title: "Contact", href: "/contact" },
  { title: "Verify Certificate", href: "/verify" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const activeClassName = "text-primary bg-primary/10";
  const inactiveClassName = "text-muted-foreground hover:text-foreground hover:bg-muted/50";

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass-navbar" : "bg-background/80 backdrop-blur-md border-b border-transparent"
      )}
    >
      <div className="container flex min-h-14 items-center justify-between gap-2 py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2 min-w-0 shrink flex-1 md:flex-none mr-2">
          <img
            src={vfraLogo}
            alt="VFRA"
            className="h-8 w-8 sm:h-9 sm:w-auto shrink-0 object-contain"
          />
          <div className="flex flex-col leading-none min-w-0 justify-center">
            <span className="font-heading font-bold text-[11px] sm:text-sm text-foreground truncate block">
              Vigilant Forensic
            </span>
            <span className="text-[9px] sm:text-xs text-muted-foreground truncate block">
              Research & Analytics Pvt. Ltd. 
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? activeClassName : inactiveClassName
                )
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Link to="/track-case">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Track Case
            </Button>
          </Link>
          <Link to="/submit-case">
            <Button size="sm" className="btn-gold">
              Register a Case
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-foreground shrink-0 ml-auto"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background overflow-hidden"
          >
            <nav className="container py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === "/"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block py-2.5 px-3 rounded-md text-sm font-medium",
                      isActive ? activeClassName : "text-muted-foreground"
                    )
                  }
                >
                  {link.title}
                </NavLink>
              ))}
              <div className="pt-4 flex flex-col gap-2 border-t border-border mt-2">
                <Link to="/track-case" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full btn-outline-gold">
                    Track Case
                  </Button>
                </Link>
                <Link to="/submit-case" onClick={() => setIsOpen(false)}>
                  <Button className="w-full btn-gold">Register a Case</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

