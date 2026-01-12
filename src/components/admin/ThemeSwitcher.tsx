import { motion } from "framer-motion";
import { Palette, Sparkles, Zap } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "vigilant" as const,
      name: "Vigilant Gold",
      description: "Professional gold & bronze palette",
      icon: Sparkles,
      preview: {
        primary: "bg-[hsl(42,56%,59%)]",
        accent: "bg-[hsl(43,83%,70%)]",
        bg: "bg-[hsl(30,8%,7%)]",
      },
    },
    {
      id: "cyber" as const,
      name: "Cyber Neon",
      description: "Futuristic cyan & purple palette",
      icon: Zap,
      preview: {
        primary: "bg-[hsl(180,100%,50%)]",
        accent: "bg-[hsl(270,100%,65%)]",
        bg: "bg-[hsl(220,20%,4%)]",
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="h-5 w-5 text-primary" />
        <h3 className="font-display font-semibold text-lg">Theme Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 text-left transition-all duration-300",
              theme === t.id
                ? "border-primary bg-primary/10 shadow-neon"
                : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selected indicator */}
            {theme === t.id && (
              <motion.div
                className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              />
            )}

            {/* Theme icon */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  theme === t.id ? "bg-primary/20" : "bg-muted"
                )}
              >
                <t.icon
                  className={cn(
                    "h-5 w-5",
                    theme === t.id ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{t.name}</h4>
                <p className="text-xs text-muted-foreground">{t.description}</p>
              </div>
            </div>

            {/* Color preview */}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-lg border border-white/10",
                  t.preview.bg
                )}
              />
              <div
                className={cn(
                  "w-8 h-8 rounded-lg border border-white/10",
                  t.preview.primary
                )}
              />
              <div
                className={cn(
                  "w-8 h-8 rounded-lg border border-white/10",
                  t.preview.accent
                )}
              />
              <span className="text-xs text-muted-foreground ml-2">
                Preview
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Theme changes are saved automatically and will persist across sessions.
      </p>
    </div>
  );
}
