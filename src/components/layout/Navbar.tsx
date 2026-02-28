import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import vfraLogo from "@/assets/vfra-logo.png";

const services = [
  { title: "Digital Forensics", href: "/services/digital-forensics", description: "Mobile, computer, cloud & network forensics" },
  { title: "Cybercrime Investigation", href: "/services/cybercrime-investigation", description: "Professional cybercrime analysis & investigation" },
  { title: "Incident Response", href: "/services/incident-response", description: "Rapid response & recovery services" },
  { title: "Expert Witness", href: "/services/expert-witness", description: "Court reports & expert testimony" },
  { title: "Corporate Training", href: "/services/training", description: "Workshops & certification programs" },
  { title: "Lab Services", href: "/services/lab-services", description: "Data recovery & evidence preservation" },
];

const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Case Studies", href: "/case-studies" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => location.pathname === href;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "glass-navbar shadow-lg shadow-primary/5"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <img 
              src={vfraLogo} 
              alt="VFRA - Vigilant Forensic Research and Analytics" 
              className="h-10 w-auto object-contain"
            />
          </motion.div>
          <div className="flex lg:hidden flex-col">
            <span className="font-display font-bold text-xs text-foreground leading-tight">Vigilant Forensic</span>
            <span className="font-display text-[10px] text-muted-foreground leading-tight">Research & Analytics</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-300",
                      "hover:text-primary hover:bg-primary/10",
                      "text-foreground/80",
                      isActive("/") && "text-primary bg-primary/10"
                    )}
                  >
                    <span className="relative">
                      Home
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300",
                        isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-300",
                      "hover:text-primary hover:bg-primary/10",
                      "text-foreground/80",
                      isActive("/about") && "text-primary bg-primary/10"
                    )}
                  >
                    <span className="relative">
                      About
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300",
                        isActive("/about") ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent text-foreground/80 hover:text-primary hover:bg-primary/10 data-[state=open]:bg-primary/10 data-[state=open]:text-primary transition-all duration-300",
                    location.pathname.startsWith("/services") && "text-primary bg-primary/10"
                  )}
                >
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-popover/95 backdrop-blur-xl border border-primary/20 rounded-lg shadow-xl shadow-primary/10">
                    {services.map((service) => (
                      <li key={service.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={service.href}
                            className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 border border-transparent"
                          >
                            <div className="text-sm font-medium leading-none text-foreground group-hover:text-primary transition-colors">
                              {service.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {service.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/case-studies">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-300",
                      "hover:text-primary hover:bg-primary/10",
                      "text-foreground/80",
                      isActive("/case-studies") && "text-primary bg-primary/10"
                    )}
                  >
                    <span className="relative">
                      Case Studies
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300",
                        isActive("/case-studies") ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/events">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-300",
                      "hover:text-primary hover:bg-primary/10",
                      "text-foreground/80",
                      isActive("/events") && "text-primary bg-primary/10"
                    )}
                  >
                    <span className="relative">
                      Events
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300",
                        isActive("/events") ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/contact">
                  <NavigationMenuLink
                    className={cn(
                      "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-300",
                      "hover:text-primary hover:bg-primary/10",
                      "text-foreground/80",
                      isActive("/contact") && "text-primary bg-primary/10"
                    )}
                  >
                    <span className="relative">
                      Contact
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300",
                        isActive("/contact") ? "w-full" : "w-0 group-hover:w-full"
                      )} />
                    </span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/verify">
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
            >
              Verify Certificate
            </Button>
          </Link>
          <Link to="/track-case">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 gap-2"
              >
                <Search className="h-4 w-4" />
                Track Case
              </Button>
            </motion.div>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-primary/20 glass-navbar"
          >
            <nav className="container py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      "block py-2 px-3 rounded-md text-sm font-medium transition-all duration-300",
                      "hover:bg-primary/10 hover:text-primary",
                      isActive(link.href) && "text-primary bg-primary/10"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="py-2 px-3"
              >
                <p className="text-sm font-medium text-muted-foreground mb-2">Services</p>
                <div className="space-y-1 pl-2 border-l border-primary/20">
                  {services.map((service) => (
                    <Link
                      key={service.href}
                      to={service.href}
                      className="block py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.05 }}
                className="pt-4 space-y-2"
              >
                <Link to="/verify" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50">
                    Verify Certificate
                  </Button>
                </Link>
                <Link to="/track-case" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 gap-2">
                    <Search className="h-4 w-4" />
                    Track Case
                  </Button>
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
