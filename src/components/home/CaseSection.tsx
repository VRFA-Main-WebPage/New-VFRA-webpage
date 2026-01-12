import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ArrowRight, Search, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useWebsiteContent, defaultCaseSectionContent, CaseSectionContent } from "@/hooks/useWebsiteContent";

const stepIcons = [FileText, Shield, CheckCircle];

export function CaseSection() {
  const { content } = useWebsiteContent<CaseSectionContent>("case_section", defaultCaseSectionContent);

  // Split heading to highlight the special word
  const headingParts = content.heading.split(content.highlightWord);

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">{content.badge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {headingParts[0]}
              <span className="text-primary text-glow">{content.highlightWord}</span>
              {headingParts[1]}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {content.description}
            </p>
          </motion.div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {content.steps.map((step, index) => {
            const IconComponent = stepIcons[index % stepIcons.length];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card h-full relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <div className="absolute top-4 right-4 text-4xl font-bold text-primary/10">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/submit-case">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
              <FileText className="h-5 w-5" />
              Submit a Case
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/track-case">
            <Button size="lg" variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50">
              <Search className="h-5 w-5" />
              Track Your Case
            </Button>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
        >
          {content.trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
