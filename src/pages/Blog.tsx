import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Digital Forensics", "Cyber Law", "Incident Response", "Training", "Industry News"];

const blogPosts = [
  {
    id: 1,
    title: "Understanding Section 65B of Indian Evidence Act: A Complete Guide",
    excerpt: "A comprehensive guide to Section 65B certification requirements for digital evidence in Indian courts...",
    category: "Cyber Law",
    date: "2024-01-15",
    readTime: "8 min read",
    image: null,
  },
  {
    id: 2,
    title: "Mobile Forensics: Extracting Data from Encrypted Android Devices",
    excerpt: "Learn about the latest techniques for extracting data from encrypted Android devices using industry-standard tools...",
    category: "Digital Forensics",
    date: "2024-01-10",
    readTime: "12 min read",
    image: null,
  },
  {
    id: 3,
    title: "Ransomware Trends in India: 2024 Threat Landscape",
    excerpt: "An analysis of ransomware attacks targeting Indian organizations and emerging threat patterns...",
    category: "Industry News",
    date: "2024-01-05",
    readTime: "6 min read",
    image: null,
  },
  {
    id: 4,
    title: "Building an Incident Response Plan: A Step-by-Step Guide",
    excerpt: "Essential components of an effective incident response plan for organizations of all sizes...",
    category: "Incident Response",
    date: "2024-01-02",
    readTime: "10 min read",
    image: null,
  },
  {
    id: 5,
    title: "Cloud Forensics: Challenges and Best Practices",
    excerpt: "Navigating the complexities of forensic investigation in cloud environments...",
    category: "Digital Forensics",
    date: "2023-12-28",
    readTime: "9 min read",
    image: null,
  },
  {
    id: 6,
    title: "Career Paths in Digital Forensics: A Beginner's Guide",
    excerpt: "Explore various career opportunities in the field of digital forensics and cybersecurity...",
    category: "Training",
    date: "2023-12-22",
    readTime: "7 min read",
    image: null,
  },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-background via-background to-primary/10 overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wider font-mono">Blog & Resources</p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
              Insights & Knowledge
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest in digital forensics, cyber law, and industry best practices.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 lg:py-28">
        <div className="container">
          {/* Search & Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={activeCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="bg-card border-border/50 hover:shadow-lg transition-shadow group">
                {/* Image Placeholder */}
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Featured Image</span>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 mb-4">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="gap-2">
              Load More Articles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 lg:py-28 bg-muted">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest articles, industry news, and training announcements.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
