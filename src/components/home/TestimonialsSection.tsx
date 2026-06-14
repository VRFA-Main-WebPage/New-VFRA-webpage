import { useEffect, useState } from "react";
import { Quote, Star, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  organization: string | null;
  rating: number;
}

const fallbackTestimonials = [
  {
    id: "1",
    quote: "The training session on cybercrime investigation techniques was highly practical and aligned with real-world investigative challenges. The structured approach, case-based discussions, and demonstration of digital evidence handling methods made it extremely valuable for enforcement professionals.",
    author: "Senior Law Enforcement Officer",
    organization: "Cyber Crime Cell, Nagpur",
    rating: 5,
  },
  {
    id: "2",
    quote: "The cybersecurity awareness session was highly informative and directly relevant to emerging digital fraud and financial cybercrime trends. The practical examples and preventive strategies shared during the lecture were valuable for strengthening organizational security awareness.",
    author: "Senior Officer",
    organization: "Life Insurance Corporation of India (LIC)",
    rating: 5,
  },
  {
    id: "3",
    quote: "The Dark Web investigation session conducted for our students was highly practical and engaging. The hands-on demonstrations, real-world case discussions, and live exploration techniques provided valuable insight into modern cybercrime investigation methodologies.",
    author: "Cybersecurity Student",
    organization: "Ramdeobaba College of Engineering & Management,Nagpur",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (data && data.length > 0) {
        setTestimonials(data);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <section className="py-10 md:py-24 lg:py-32 bg-muted relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      
      {/* Animated data streams */}
      <div className="absolute left-10 top-0 bottom-0 w-px overflow-hidden opacity-20">
        <motion.div
          className="w-full h-32 bg-gradient-to-b from-transparent via-primary to-transparent"
          animate={{ y: ["0%", "300%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="absolute right-10 top-0 bottom-0 w-px overflow-hidden opacity-20">
        <motion.div
          className="w-full h-32 bg-gradient-to-b from-transparent via-accent to-transparent"
          animate={{ y: ["100%", "-200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Terminal className="h-4 w-4" />
            <span className="uppercase tracking-widest font-mono">// TESTIMONIALS</span>
          </motion.div>
          <h2 className="font-display text-[28px] md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            What Our <span className="text-primary text-glow">Clients</span> Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from law enforcement agencies, government organizations, and corporate clients
            who have trusted us with their most sensitive investigations.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 hover:shadow-neon transition-all duration-300 h-full group">
                <CardContent className="pt-8 pb-6 px-6 flex flex-col h-full">
                  {/* Quote Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 400 }}
                  >
                    <Quote className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors mb-4" />
                  </motion.div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                      >
                        <Star className="h-4 w-4 fill-accent text-accent" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-foreground/80 mb-8 leading-relaxed flex-1 text-lg">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="border-t border-primary/10 pt-5">
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{testimonial.author}</p>
                    <p className="text-sm text-primary font-mono">{testimonial.organization}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
