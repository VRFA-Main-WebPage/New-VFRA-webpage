import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowRight,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useWebsiteContent,
  defaultGalleryContent,
  GalleryContent,
  GalleryCategory,
  GalleryItem,
} from "@/hooks/useWebsiteContent";
import { fadeUp, staggerContainer, APPLE_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<"All" | GalleryCategory> = [
  "All",
  "Lab Infrastructure",
  "Workshops & Training",
  "Law Enforcement",
  "Field Research",
  "Conferences",
];

export default function Gallery() {
  const { content, loading } = useWebsiteContent<GalleryContent>(
    "gallery",
    defaultGalleryContent
  );

  const [activeCategory, setActiveCategory] = useState<"All" | GalleryCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const items = content.items || defaultGalleryContent.items;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat =
        activeCategory === "All" || item.category === activeCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location &&
          item.location.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesQuery;
    });
  }, [items, activeCategory, searchQuery]);

  const selectedItem: GalleryItem | null =
    selectedIndex !== null && filteredItems[selectedIndex]
      ? filteredItems[selectedIndex]
      : null;

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      selectedIndex === 0 ? filteredItems.length - 1 : selectedIndex - 1
    );
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      selectedIndex === filteredItems.length - 1 ? 0 : selectedIndex + 1
    );
  };

  return (
    <>
      <SEO
        title="Forensic Gallery & Operations Archive | VFRA Nagpur"
        description="Explore the visual archive of Vigilant Forensic Research and Analytics Pvt. Ltd. (Nagpur) — laboratory workstations, law enforcement workshops, and field operations."
      />
      <div className="min-h-screen bg-white">
        {/* Hero Header */}
        <section className="relative py-16 md:py-24 bg-[#F7F7F5] border-b border-[#E5E5E3]">
          <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />
          <div className="container relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.span variants={fadeUp} className="section-eyebrow">
                VISUAL EVIDENCE ARCHIVE // VFRA NAGPUR
              </motion.span>
              <motion.h1
                variants={fadeUp}
                className="font-heading text-4xl md:text-5xl lg:text-[54px] font-semibold text-[#111111] tracking-[-0.035em] leading-[1.08] mb-5"
              >
                {content.heading || defaultGalleryContent.heading}.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-base md:text-lg text-[#555555] leading-relaxed"
              >
                {content.subheading || defaultGalleryContent.subheading}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-5 sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-[#E5E5E3]">
          <div className="container flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1 lg:pb-0">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setSelectedIndex(null);
                  }}
                  className={cn(
                    "px-3.5 py-2 rounded-md font-mono text-[11px] uppercase tracking-[0.1em] whitespace-nowrap border transition-colors",
                    activeCategory === category
                      ? "bg-[#111111] text-white border-[#111111]"
                      : "bg-white text-[#555555] border-[#E5E5E3] hover:border-[#111111] hover:text-[#111111]"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#555555]" />
              <Input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-[#F7F7F5] border-[#E5E5E3] text-sm"
              />
            </div>
          </div>
        </section>

        {/* Bento / Editorial Gallery Grid */}
        <section className="py-16 md:py-24">
          <div className="container">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/3] rounded-lg bg-[#F7F7F5] border border-[#E5E5E3] animate-pulse"
                  />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-[#F7F7F5] border border-[#E5E5E3] rounded-lg">
                <p className="text-sm text-[#555555] mb-4">
                  No gallery records match the selected filter.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="font-mono text-xs uppercase"
                >
                  Reset Archive Filter
                </Button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item, idx) => {
                    // Create an Apple-inspired asymmetric Bento rhythm every 5 items
                    const mod = idx % 5;
                    const colSpan =
                      mod === 0
                        ? "md:col-span-7"
                        : mod === 1
                        ? "md:col-span-5"
                        : "md:col-span-4";

                    return (
                      <motion.article
                        layout
                        key={item.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.45, ease: APPLE_EASE }}
                        onClick={() => setSelectedIndex(idx)}
                        className={cn(
                          colSpan,
                          "group cursor-pointer premium-card overflow-hidden flex flex-col justify-between bg-white"
                        )}
                      >
                        <div>
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F0EFEA] border-b border-[#E5E5E3]">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                            />
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                              <span className="font-mono text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 bg-white/90 backdrop-blur-md border border-[#E5E5E3] text-[#111111] font-medium">
                                {item.category}
                              </span>
                            </div>
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <span className="font-mono text-[10px] px-2 py-1 bg-[#111111]/85 text-white">
                                {item.code || `ARC-${String(idx + 1).padStart(2, "0")}`}
                              </span>
                              <div className="w-7 h-7 rounded bg-white/90 backdrop-blur-md border border-[#E5E5E3] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Maximize2 className="h-3.5 w-3.5 text-[#111111]" />
                              </div>
                            </div>
                          </div>

                          <div className="p-5 md:p-6">
                            <h2 className="font-heading text-lg font-bold text-[#111111] mb-2 tracking-[-0.02em] group-hover:underline">
                              {item.title}
                            </h2>
                            <p className="text-xs text-[#555555] leading-relaxed line-clamp-2">
                              {item.caption}
                            </p>
                          </div>
                        </div>

                        <div className="px-5 md:px-6 py-3.5 border-t border-[#E5E5E3] bg-[#F7F7F5]/60 flex items-center justify-between font-mono text-[11px] text-[#555555]">
                          <span className="inline-flex items-center gap-1.5 truncate">
                            <MapPin className="h-3 w-3 text-[#111111] shrink-0" />
                            {item.location || "VFRA Nagpur"}
                          </span>
                          <span className="inline-flex items-center gap-1 shrink-0">
                            <Calendar className="h-3 w-3 text-[#111111]" />
                            {item.date}
                          </span>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 md:py-20 bg-[#F7F7F5] border-t border-[#E5E5E3]">
          <div className="container flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="section-eyebrow">INSTITUTIONAL WORKSHOPS &amp; LAB TOURS</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#111111]">
                Host a Forensic Training Programme with VFRA.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/events">
                <Button className="bg-[#111111] text-white hover:bg-[#2A2A2A] h-11 px-6 font-mono text-xs uppercase tracking-[0.1em] gap-2">
                  View Upcoming Events
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="border-[#111111] text-[#111111] hover:bg-white h-11 px-6 font-mono text-xs uppercase tracking-[0.1em]"
                >
                  Contact Laboratory
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Apple-Style Lightbox Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: APPLE_EASE }}
              className="fixed inset-0 z-50 bg-[#111111]/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
              onClick={() => setSelectedIndex(null)}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: APPLE_EASE }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl bg-white border border-[#E5E5E3] rounded-lg overflow-hidden shadow-2xl grid lg:grid-cols-12"
              >
                {/* Image Column */}
                <div className="lg:col-span-8 bg-[#111111] relative flex items-center justify-center min-h-[280px] md:min-h-[460px]">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="max-h-[75vh] w-full object-contain"
                  />
                  {filteredItems.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-white/90 hover:bg-white text-[#111111] flex items-center justify-center transition-transform hover:scale-105"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-white/90 hover:bg-white text-[#111111] flex items-center justify-center transition-transform hover:scale-105"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Specification Sidebar */}
                <div className="lg:col-span-4 p-6 md:p-8 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E5E3]">
                      <span className="font-mono text-xs font-semibold px-2.5 py-0.5 bg-[#111111] text-white">
                        {selectedItem.code || "ARCHIVE"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(null)}
                        className="p-1.5 rounded-md text-[#555555] hover:text-[#111111] hover:bg-[#F7F7F5]"
                        aria-label="Close preview"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#555555] block mb-2">
                      {selectedItem.category}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-[#111111] mb-4">
                      {selectedItem.title}
                    </h3>
                    <p className="text-sm text-[#555555] leading-relaxed mb-6">
                      {selectedItem.caption}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E3] space-y-2.5 font-mono text-xs text-[#555555]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717A]">LOCATION</span>
                      <span className="text-[#111111] font-medium">
                        {selectedItem.location || "VFRA Nagpur"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717A]">TIMESTAMP</span>
                      <span className="text-[#111111] font-medium">
                        {selectedItem.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717A]">INDEX</span>
                      <span className="text-[#111111] font-medium">
                        {(selectedIndex ?? 0) + 1} / {filteredItems.length}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
