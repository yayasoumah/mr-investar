"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { LandingLayout } from "@/components/landing-page/LandingLayout";
import { ReactNode } from "react";

interface BusinessPartnerSection {
  title: string;
  description: (string | ReactNode)[];
  imagePath: string;
}

const businessPartnerSections: BusinessPartnerSection[] = [
  {
    title: "Strategic Support",
    description: [
      "MR. INVESTAR adopts a unique business model based on selecting the best industrial partner for each initiative. Our strategy is founded on collaboration with excellence-driven entities that not only provide high-level operational and technological support but also actively participate as investors in initiatives, sharing objectives and contributing to their success.",
      "For each project, we identify industrial partners capable of bringing distinctive competencies and innovative solutions, creating a strategic synergy that strengthens the initiative's solidity. These partners, beyond ensuring technological and managerial excellence, choose to invest directly in projects, aligning their interests with those of MR. INVESTAR and other stakeholders. This approach generates collaboration based on trust and shared results, promoting sustainable and profitable growth.",
      "Through this model, MR. INVESTAR not only develops successful initiatives but creates a virtuous ecosystem where the skills, resources, and commitment of industrial partners unite to achieve ambitious goals. Each initiative is thus supported by a solid structure, oriented towards the long term, capable of ensuring concrete results and added value for all parties involved.",
      "This strategic selection and collaboration process represents one of the pillars of our approach, strengthening our ability to create successful opportunities in the real estate and hospitality sector, with a constant focus on innovation and excellence."
    ],
    imagePath: "/landing-page/business-partner/1) Partner Industriale.jpg"
  },
  {
    title: "Redevelopment",
    description: [
      "One of the main concerns that troubles investors is related to project execution.",
      "It's essential to rely on qualified partners with a successful track record to achieve two fundamental aspects: Guaranteed timelines and costs!",
      "For over 10 years, we have been carrying out renovation and redevelopment projects of hotel structures throughout Italy with our partner ",
      <>with our partner <a href="https://ivhgroup.it/" target="_blank" rel="noopener noreferrer" className="text-[#37B6B6] hover:underline">IVH Group S.p.A.</a></>,
      "The selection of suppliers (Partner Companies) capable of supporting the initiative is also fundamental.",
      <>Example Project: <a href="https://www.lagemmahotel.com" target="_blank" rel="noopener noreferrer" className="text-[#37B6B6] hover:underline">www.lagemmahotel.com</a></>
    ],
    imagePath: "/landing-page/business-partner/2) Riqualificazione.jpg"
  }
];

export default function BusinessPartner() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing-page/business-partner/business-partner-primary.jpg"
            alt="Mr. Investar Business Partner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-white min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center">Business Partner</h1>
          <p className="text-xl md:text-2xl text-justify max-w-4xl">
            At Mr. Investar, we believe in the power of strategic partnerships. Our success is built on collaborating with industry leaders who share our vision for excellence in the hospitality sector.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Subtitle Section */}
      <div className="bg-[#E5F5F5] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#37B6B6] mb-6">Excellence Through Partnership</h2>
          <p className="text-xl text-gray-700">
            Our partnerships are carefully curated to ensure the highest standards of quality and reliability in every project. We work with industry leaders who not only bring expertise but also share our commitment to creating exceptional value in the hospitality sector.
          </p>
        </div>
      </div>

      {/* Partner Sections */}
      <section className="py-20">
        {businessPartnerSections.map((section, index) => (
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
