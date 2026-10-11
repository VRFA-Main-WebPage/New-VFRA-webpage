import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  useWebsiteContent,
  defaultGalleryContent,
  GalleryContent,
} from "@/hooks/useWebsiteContent";
import { fadeUp, staggerContainer, useInView } from "@/lib/motion";

export function GalleryPreviewSection() {
  const { content } = useWebsiteContent<GalleryContent>("gallery", defaultGalleryContent);
  const { ref, inView } = useInView();

  const previewItems = (content.items || defaultGalleryContent.items).slice(0, 4);

  return (
    <section className="py-16 md:py-24 lg:py-28 bg-[#F7F7F5] border-b border-[#E5E5E3]">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {/* Section Header */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 mb-12 border-b border-[#E5E5E3]"
          >
            <div className="max-w-2xl">
              <span className="section-eyebrow">
                07 // FORENSIC ARCHIVE &amp; LABORATORY GALLERY
              </span>
              <h2 className="section-heading">
                Inside VFRA Nagpur Operations.
              </h2>
            </div>
            <Link to="/gallery">
              <Button
                variant="outline"
                className="border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white font-mono text-xs uppercase tracking-[0.1em] h-11 px-6 gap-2"
              >
                Open Full Gallery
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </motion.div>

          {/* Apple-style Bento Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {previewItems.map((item, idx) => {
              const isWide = idx === 0 || idx === 3;
              return (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  className={isWide ? "md:col-span-7" : "md:col-span-5"}
                >
                  <Link
                    to="/gallery"
                    className="group premium-card overflow-hidden flex flex-col h-full bg-white"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F0EFEA] border-b border-[#E5E5E3]">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 bg-white/90 backdrop-blur-md border border-[#E5E5E3] text-[#111111] font-medium">
                          {item.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className="font-mono text-[10px] px-2 py-1 bg-[#111111]/85 text-white">
                          {item.code || `ARC-0${idx + 1}`}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-[#111111] mb-1.5 tracking-[-0.02em]">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#555555] leading-relaxed line-clamp-2 mb-4">
                          {item.caption}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E5E5E3] flex items-center justify-between font-mono text-[11px] text-[#555555]">
                        <span className="inline-flex items-center gap-1.5 truncate">
                          <MapPin className="h-3 w-3 text-[#111111] shrink-0" />
                          {item.location || "VFRA Nagpur"}
                        </span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
