import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (error || !data) {
          navigate("/404");
          return;
        }

        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-mono text-xs uppercase tracking-widest text-[#555555]">
        Loading article...
      </div>
    );
  }

  if (!blog) return null;

  return (
    <>
      <SEO
        title={blog.seo_title || blog.title}
        description={blog.seo_description || blog.excerpt || ""}
        image={blog.thumbnail_url || undefined}
        type="article"
      />

      <div className="py-16 md:py-24 min-h-screen bg-white">
        <article className="container max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center font-mono text-xs uppercase tracking-wider text-[#555555] hover:text-[#111111] mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to Publications
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 pb-4 mb-6 border-b border-[#E5E5E3] font-mono text-xs uppercase tracking-wider text-[#555555]">
              {blog.category && (
                <span className="px-2.5 py-0.5 bg-[#111111] text-white">
                  {blog.category}
                </span>
              )}
              {blog.published_at && (
                <span>{format(new Date(blog.published_at), "MMMM dd, yyyy")}</span>
              )}
              {blog.author && <span>· By {blog.author}</span>}
            </div>

            <h1 className="text-3xl md:text-5xl font-heading font-bold text-[#111111] tracking-[-0.03em] mb-8 leading-tight">
              {blog.title}
            </h1>

            {blog.thumbnail_url && (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-[#F7F7F5] border border-[#E5E5E3] mb-10">
                <img
                  src={blog.thumbnail_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-neutral prose-lg max-w-none prose-headings:font-heading prose-headings:text-[#111111] prose-p:text-[#333333] prose-a:text-[#111111] prose-a:underline"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <div className="mt-16 p-8 rounded-lg bg-[#F7F7F5] border border-[#E5E5E3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-xl font-bold text-[#111111] mb-1">
                  Require Forensic Consultation?
                </h3>
                <p className="text-sm text-[#555555]">
                  Connect with our forensic laboratory team for case intake or technical support.
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Link to="/contact" className="flex-1 sm:flex-none">
                  <Button variant="outline" className="w-full border-[#111111] text-[#111111]">
                    Contact Us
                  </Button>
                </Link>
                <Link to="/submit-case" className="flex-1 sm:flex-none">
                  <Button className="w-full bg-[#111111] text-white hover:bg-[#2A2A2A]">
                    Register Case
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </article>
      </div>
    </>
  );
}
