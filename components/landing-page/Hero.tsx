"use client";

import { Button } from "@/components/ui/button";

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/landing-page/hero/luxury-villa.png"
          alt="Luxury Italian Villa Investment Opportunity"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            The Hotel Matchmaking Experts
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-grey-100 font-medium">
            Access exclusive investment opportunities in premium hotels, resorts, and luxury properties across Italy&apos;s most sought-after destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              size="lg"
              variant="primary"
              className="w-full sm:w-auto"
              onClick={() => scrollToSection('opportunities')}
            >
              Explore Opportunities
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="w-full sm:w-auto !border-white !text-white hover:!bg-white/10"
              onClick={() => scrollToSection('our-process')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}