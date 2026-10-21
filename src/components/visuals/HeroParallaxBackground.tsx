export function HeroParallaxBackground() {
  // Generate 24 lightweight particles
  const particles = Array.from({ length: 24 }).map((_, i) => {
    const left = `${Math.random() * 100}%`;
    const top = `${Math.random() * 100}%`;
    const animationDelay = `${Math.random() * 5}s`;
    const animationDuration = `${8 + Math.random() * 8}s`;
    const size = `${1 + Math.random() * 2}px`;

    return (
      <div
        key={i}
        className="absolute rounded-full bg-[#D4AF37] hidden md:block animate-[forensicParticleFloat_linear_infinite]"
        style={{
          left,
          top,
          width: size,
          height: size,
          animationDelay,
          animationDuration,
          opacity: 0.12,
          willChange: "transform",
        }}
      />
    );
  });

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050505] pointer-events-none">
      
      {/* Back blurred depth layer (Desktop only for performance) */}
      <div
        className="hidden md:block absolute inset-[-15%] opacity-40 blur-[4px] scale-[1.42] animate-[forensicHeroBack_14s_ease-in-out_infinite_alternate]"
        style={{
          backgroundImage: "url('/forensic-network-bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "72% center",
          transformOrigin: "68% 47%",
          willChange: "transform",
        }}
      />

      {/* Sharp animated front image layer */}
      <div
        className="absolute inset-[-10%] opacity-100 scale-[1.08] md:scale-[1.16] md:animate-[forensicHeroFront_10s_ease-in-out_infinite_alternate] bg-center md:bg-[72%_center]"
        style={{
          backgroundImage: "url('/forensic-network-bg.webp')",
          backgroundSize: "cover",
          transformOrigin: "68% 47%",
          willChange: "transform",
        }}
      />

      {/* Gold radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_47%,rgba(212,175,55,0.2),transparent_45%)]" />

      {/* Dark vortex vignette and center ring */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_47%,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.05)_15%,rgba(0,0,0,0.6)_80%)]" />

      {/* Left text readability gradient (starts fading out earlier to increase image area on left) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent from-0% via-[25%] md:via-[28%]" />

      {/* Stronger mobile overlay for readability */}
      <div className="md:hidden absolute inset-0 bg-black/60" />

      {/* Lightweight particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {particles}
      </div>
      
    </div>
  );
}
