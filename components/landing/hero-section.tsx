"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WeatherWidget } from "./weather-widget";
import { TimeWidget } from "./time-widget";

const heroSlides = [
  {
    id: 1,
    image: "/images/hero/governemt house.jpeg",
    title: "The Government House",
    description: "Remodeled as the T. Y. Danjuma House, serves as the official residence and administrative headquarters of the Governor of Taraba State, symbolizing the state's commitment to transparent governance and public service.",
  },
  {
    id: 2,
    image: "/images/hero/drkefas.jpeg",
    title: "Dr. Kefas, Governor of Taraba State",
    description: "Launched the remodeled primary schools as part of his free education initiative to improve access and quality of education for all children in the state.",
  },
  {
    id: 3,
    image: "/images/hero/ccecc-partner.jpg",
    title: "Taraba State Partners with CCECC to Boost Energy and Infrastructure Development",
    description: "The Taraba State Government, under the leadership of Governor Dr. Agbu Kefas, has signed an MOU with the China Civil Engineering Construction Corporation (CCECC) to advance energy and infrastructure development initiatives in the state.",
  },
  {
    id: 4,
    image: "/images/hero/ccecc.jpeg",
    title: "Taraba State Government Signs MOU with CCECC",
    description: "Dr. Agbu Kefas, Governor of Taraba State, hosted a meeting in Abuja with the President of China Civil Engineering Construction Corporation to discuss Taraba State's development with Stakeholders.",
  },
  {
    id: 5,
    image: "/images/hero/mordern-bustop.jpeg",
    title: "Dr. Kefas ultra-modern bus stop in Taraba State",
    description: "To enhance public transportation infrastructure for the benefit of the people",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${currentHero.image}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full container mx-auto px-4 flex items-end pb-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {currentHero.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            {currentHero.description}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-taraba-gold"
                : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Weather and Time Widgets */}
      <div className="absolute top-8 right-4 md:right-8 flex flex-col gap-4 z-20">
        <WeatherWidget />
        <TimeWidget />
      </div>
    </section>
  );
}
