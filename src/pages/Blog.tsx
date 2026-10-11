import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ArrowRight, BookOpen } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  return (
    <>
      <SEO
        title="Forensic Insights & Research | VFRA Nagpur"
        description="Read technical insights, digital forensics research, and cybercrime analysis from VFRA Nagpur."
      />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="container max-w-4xl">
            <span className="section-eyebrow">PUBLICATIONS // RESEARCH &amp; INSIGHTS</span>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#111111] tracking-[-0.035em] mb-4">
              Forensic Insights &amp; Technical Briefs.
            </h1>
            <p className="text-base md:text-lg text-[#555555] max-w-2xl leading-relaxed">
              Research notes, statutory analyses, and investigative methodologies from the VFRA Nagpur laboratory.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 md:py-24">
          <div className="container">
            {loading ? (
              <div className="py-20 text-center font-mono text-xs uppercase tracking-widest text-[#555555]">
                Loading publications...
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-20 bg-[#F7F7F5] border border-[#E5E5E3] rounded-lg">
                <BookOpen className="w-8 h-8 mx-auto mb-3 text-[#555555]" />
                <p className="text-sm text-[#555555]">
                  No published articles available at this time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, index) => (
                  <motion.article
                    key={blog.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="premium-card overflow-hidden flex flex-col justify-between bg-white"
                  >
                    <div>
                      {blog.thumbnail_url && (
                        <div className="aspect-[16/10] w-full overflow-hidden bg-[#F0EFEA] border-b border-[#E5E5E3]">
                          <img
                            src={blog.thumbnail_url}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#E5E5E3] font-mono text-[10px] uppercase tracking-wider text-[#555555]">
                          <span>{blog.category || "FORENSIC BRIEF"}</span>
                          {blog.published_at && (
                            <span>{format(new Date(blog.published_at), "MMM dd, yyyy")}</span>
                          )}
                        </div>
                        <h2 className="font-heading text-lg font-bold text-[#111111] mb-2 line-clamp-2">
                          <Link to={`/blog/${blog.slug}`} className="hover:underline">
                            {blog.title}
                          </Link>
                        </h2>
                        <p className="text-xs text-[#555555] leading-relaxed line-clamp-3">
                          {blog.excerpt || blog.content.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..."}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-[#E5E5E3] bg-[#F7F7F5]/60">
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center justify-between w-full font-mono text-xs uppercase tracking-wider text-[#111111] font-semibold"
                      >
                        <span>Read Publication</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
