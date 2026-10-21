import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Scale, User, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    { id: "all", label: "All Dossiers" },
    ...Array.from(new Set(caseStudies.map((c) => c.category))).map((cat) => ({
      id: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    })),
  ];

  const filteredCases =
    activeCategory === "all"
      ? caseStudies
      : caseStudies.filter((c) => c.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
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

  return (
    <>
      <SEO
        title="Case Studies | VFRA"
        description="Anonymized digital forensic investigations and documented outcomes by Vigilant Forensic Research and Analytics."
      />
      <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="container max-w-3xl">
            <span className="section-eyebrow">EVIDENTIARY ARCHIVE // CASE OUTCOMES</span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#111111] tracking-[-0.035em] mb-4">
              Documented Investigation Outcomes.
            </h1>
            <p className="text-base md:text-lg text-[#555555] leading-relaxed">
              Anonymized forensic dossiers demonstrating structured methodologies, chain-of-custody discipline, and legally defensible reporting.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-[#E5E5E3]">
          <div className="container flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-md font-mono text-xs uppercase tracking-[0.1em] border transition-colors",
                  activeCategory === cat.id
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#555555] border-[#E5E5E3] hover:border-[#111111] hover:text-[#111111]"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Cases Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            {loading ? (
              <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-[#555555]">
                Loading forensic dossiers...
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="py-20 text-center bg-[#F7F7F5] border border-[#E5E5E3] rounded-lg p-8">
                <p className="text-sm text-[#555555] mb-4">
                  Case study records are currently anonymized or under non-disclosure review.
                </p>
                <Link to="/contact">
                  <Button className="bg-[#111111] text-white hover:bg-[#2A2A2A] font-mono text-xs uppercase">
                    Request Redacted Sample Report
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((caseStudy, index) => {
                  const Icon = getCategoryIcon(caseStudy.category);
                  return (
                    <article
                      key={caseStudy.id}
                      className="premium-card p-6 flex flex-col justify-between bg-white"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E5E5E3]">
                          <span className="font-mono text-xs font-semibold text-[#111111]">
                            CS-{String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 bg-[#F7F7F5] border border-[#E5E5E3] text-[#111111]">
                            {caseStudy.category}
                          </span>
                        </div>

                        <div className="w-9 h-9 bg-[#F7F7F5] border border-[#E5E5E3] rounded-md flex items-center justify-center mb-4">
                          <Icon className="h-4 w-4 text-[#111111]" />
                        </div>

                        <h3 className="font-heading text-lg font-bold text-[#111111] mb-1">
                          {caseStudy.title}
                        </h3>
                        <p className="font-mono text-xs text-[#555555] mb-4">
                          Client: {caseStudy.client}
                        </p>

                        <p className="text-sm text-[#555555] leading-relaxed mb-6">
                          {caseStudy.description}
                        </p>

                        <div className="p-4 rounded-md bg-[#F7F7F5] border border-[#E5E5E3] space-y-3 mb-5">
                          {caseStudy.outcome && (
                            <div>
                              <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A] block">
                                Finding / Outcome
                              </span>
                              <p className="text-xs font-medium text-[#111111] mt-0.5">
                                {caseStudy.outcome}
                              </p>
                            </div>
                          )}
                          {caseStudy.impact && (
                            <div>
                              <span className="font-mono text-[10px] uppercase tracking-widest text-[#71717A] block">
                                Evidentiary Impact
                              </span>
                              <p className="text-xs font-semibold text-[#111111] mt-0.5">
                                {caseStudy.impact}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#E5E5E3]">
                        {caseStudy.services?.map((service, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] px-2 py-0.5 bg-white border border-[#E5E5E3] text-[#555555]"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-[#F7F7F5] border-t border-[#E5E5E3]">
          <div className="container max-w-2xl text-center">
            <span className="section-eyebrow">CONFIDENTIAL INTAKE</span>
            <h2 className="font-heading text-3xl font-bold text-[#111111] mb-4">
              Have a Matter Requiring Examination?
            </h2>
            <p className="text-sm md:text-base text-[#555555] mb-8">
              All consultations are conducted under strict non-disclosure and chain-of-custody protocols.
            </p>
            <Link to="/contact">
              <Button className="bg-[#111111] text-white hover:bg-[#2A2A2A] h-11 px-7 font-mono text-xs uppercase tracking-[0.1em] gap-2">
                Schedule Consultation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default CaseStudies;