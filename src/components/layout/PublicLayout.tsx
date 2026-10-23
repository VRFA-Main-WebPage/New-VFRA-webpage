import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { APPLE_EASE } from "@/lib/motion";
import ClickSpark from "@/components/animations/ClickSpark";

export function PublicLayout() {
  const location = useLocation();

  return (
    <ClickSpark
      sparkColor={["#D4AF37", "#111111", "#F59E0B", "#4A5568"]}
      sparkSize={14}
      sparkRadius={28}
      sparkCount={8}
      sparkWidth={2}
      duration={450}
      shape="line"
      layer="front"
      className="min-h-screen flex flex-col w-full"
    >
      <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
        <Navbar />
        <main className="flex-1 pt-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.38, ease: APPLE_EASE }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}
