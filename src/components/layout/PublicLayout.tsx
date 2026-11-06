import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import ClickSpark from "@/components/animations/ClickSpark";

export function PublicLayout() {
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
          <Outlet />
        </main>
        <Footer />
      </div>
    </ClickSpark>
  );
}
