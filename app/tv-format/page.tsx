"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LandingLayout } from "@/components/landing-page/LandingLayout";

interface ContentSection {
  title: string;
  description: (string | ReactNode)[];
  imagePath: string;
}

const contentSections: ContentSection[] = [
  {
    title: "Telling Your Story Through Television",
    description: [
      <>In collaboration with <span className="font-bold">THE DESIGNERS</span>, we bring to life the stories of entrepreneurs and destinations through a professional television format, with episodes spanning 52 minutes each.</>,
      "Our format highlights:",
      "• Destinations and Real Estate Assets",
      "• Property Owners and Investors",
      "• Operators and Brands",
      "• Partner Companies",
      "• Design Studios",
      "Most importantly, we ensure the right visibility for both sellers and buyers according to their specific needs.",
      <>Visit our partner at: <a href="http://www.thedesigners.it" target="_blank" rel="noopener noreferrer" className="text-[#37B6B6] hover:underline">www.thedesigners.it</a></>,
    ],
    imagePath: "/landing-page/tv-format/image-1.jpg",
  },
  {
    title: "Building Success Stories",
    description: [
      "Every real estate operation is more than just an investment – it's an opportunity to create value, inspire, and leave a lasting mark.",
      "Success isn't measured solely by numbers, but by the ability to transform ideas into concrete projects that generate impact and attractiveness.",
      "Through the right strategy, entrepreneurial vision, and the power of communication, every property can become a reference point, a sought-after destination, a story worth telling.",
      "Together, we can bring to life projects that not only work but leave a lasting impression.",
    ],
    imagePath: "/landing-page/tv-format/image-2.jpg",
  },
];

export default function TvFormat() {
  const scrollToContent = () => {
    const content = document.getElementById('content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing-page/tv-format/primary.jpg"
            alt="TV Format Cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-white min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center">The Power of Visual Storytelling</h1>
          <p className="text-xl md:text-2xl text-justify max-w-4xl">
            Transforming real estate opportunities into compelling narratives through professional television production
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer" onClick={scrollToContent}>
          <div className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Subtitle Section */}
      <div className="bg-[#E5F5F5] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#37B6B6] mb-6">Promoting Real Estate Opportunities</h2>
          <p className="text-xl text-gray-700">
            Effective communication is fundamental to selling, promoting, and developing real estate. 
            Real estate opportunities presented by Mr. Investar will benefit from strategic visibility 
            thanks to the support of THE DESIGNERS, a television format dedicated to showcasing destinations 
            and success stories in the sector.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <section id="content" className="py-20">
        {contentSections.map((section, index) => (
          <div
            key={section.title}
            className={cn(
              "flex flex-col py-12",
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            <div className="w-full md:w-1/2 relative bg-[#E5F5F5] pb-12 md:pb-0">
              <div className="absolute inset-0">
                <Image
                  src={section.imagePath}
                  alt={section.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="relative aspect-[4/3]" />
            </div>
            <div className="w-full md:w-1/2">
              <div className="h-full px-4 md:px-12 pt-8 md:pt-0">
                <h2 className="text-3xl font-bold mb-6 text-[#37B6B6]">{section.title}</h2>
                {section.description.map((paragraph, i) => (
                  <p key={i} className="text-gray-700 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </LandingLayout>
  );
}
