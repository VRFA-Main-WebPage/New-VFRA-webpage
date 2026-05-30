import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Blog = Database['public']['Tables']['blogs']['Row'];

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
      
      <div className="pt-24 pb-16 min-h-screen bg-background">
        <article className="container max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              {blog.category && (
                <div className="flex items-center text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                  <Tag className="w-4 h-4 mr-1.5" />
                  {blog.category}
                </div>
              )}
              {blog.published_at && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {format(new Date(blog.published_at), 'MMMM dd, yyyy')}
                </div>
              )}
              {blog.author && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1.5" />
                  {blog.author}
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-8 leading-tight">
              {blog.title}
            </h1>

            {blog.thumbnail_url && (
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted mb-10">
                <img 
                  src={blog.thumbnail_url} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div 
              className="prose prose-invert prose-lg max-w-none prose-headings:font-heading prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-xl font-bold mb-2">Need Expert Assistance?</h3>
                <p className="text-muted-foreground">Our team of forensic experts is ready to help with your investigation.</p>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <Link to="/contact" className="flex-1 sm:flex-none">
                  <Button variant="outline" className="w-full">Contact Us</Button>
                </Link>
                <Link to="/submit-case" className="flex-1 sm:flex-none">
                  <Button className="w-full btn-gold">Register Case</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </article>
      </div>
    </>
  );
}
