import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowRight, BookOpen } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Blog = Database['public']['Tables']['blogs']['Row'];

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
        title="Digital Forensics & Cyber Investigation Blog"
        description="Stay updated with the latest in digital forensics, cybercrime investigations, and lawful intelligence from VFRA."
      />
      <div className="pt-24 pb-16 min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Insights & Intelligence</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Expert analysis, case studies, and updates from the frontline of digital forensics and cybercrime investigations.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No published articles available at this time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col bg-card/50 border-white/5 hover:border-primary/50 transition-colors">
                    {blog.thumbnail_url && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-muted">
                        <img 
                          src={blog.thumbnail_url} 
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        {blog.category && (
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {blog.category}
                          </span>
                        )}
                        {blog.published_at && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(blog.published_at), 'MMM dd, yyyy')}
                          </span>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2 leading-tight hover:text-primary transition-colors">
                        <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="line-clamp-3">
                        {blog.excerpt || blog.content.substring(0, 150) + "..."}
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Link to={`/blog/${blog.slug}`} className="w-full">
                        <Button variant="ghost" className="w-full group">
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
