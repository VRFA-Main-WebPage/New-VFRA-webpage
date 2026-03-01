import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Scale, User, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  outcome: string;
  impact: string;
  services: string[];
}

const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

    if (error) {
      console.error("Error fetching cases:", error);
      setLoading(false);
      return;
    }

    setCaseStudies(data || []);
    setLoading(false);
  };

  const categories = [
    { id: "all", label: "All Cases" },
    ...Array.from(new Set(caseStudies.map((c) => c.category))).map(
      (cat) => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })
    ),
  ];

  const filteredCases =
    activeCategory === "all"
      ? caseStudies
      : caseStudies.filter((c) => c.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "government":
        return Scale;
      case "corporate":
        return Building2;
      case "legal":
        return Scale;
      case "individual":
        return User;
      default:
        return Award;
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-muted-foreground">
        Loading case studies...
      </div>
    );
  }

  return (
    <div className="bg-background">

      {/* Hero */}
      <section className="py-24 text-center">
        <div className="container max-w-3xl mx-auto">
          <p className="text-sm text-primary uppercase tracking-widest mb-3">
            Case Studies
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Documented Investigation Outcomes
          </h1>
          <p className="text-muted-foreground">
            Anonymized investigations demonstrating structured forensic
            methodologies and legally defensible reporting.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="container flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Cases */}
      <section className="pb-24">
        <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseStudy) => {
            const Icon = getCategoryIcon(caseStudy.category);

            return (
              <Card key={caseStudy.id}>
                <CardHeader>
                  <div className="flex justify-between mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {caseStudy.category}
                    </Badge>
                  </div>
                  <CardTitle>{caseStudy.title}</CardTitle>
                  <CardDescription>{caseStudy.client}</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {caseStudy.description}
                  </p>

                  <div className="mb-4 space-y-2">
                    <div>
                      <span className="text-xs uppercase text-muted-foreground">
                        Outcome
                      </span>
                      <p className="text-sm font-medium">
                        {caseStudy.outcome}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase text-muted-foreground">
                        Impact
                      </span>
                      <p className="text-sm text-primary font-medium">
                        {caseStudy.impact}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {caseStudy.services?.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-muted">
        <div className="container max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Have a Case to Discuss?
          </h2>
          <p className="text-muted-foreground mb-8">
            All consultations are handled with strict confidentiality and
            evidence integrity protocols.
          </p>
          <Link to="/contact">
            <Button size="lg" className="gap-2">
              Schedule Consultation
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default CaseStudies;