"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { LandingLayout } from "@/components/landing-page/LandingLayout";
import { ReactNode } from "react";

interface TeamMember {
  name: string;
  role: string;
  description: (string | ReactNode)[];
  imagePath: string;
  quote?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Max Valente",
    role: "CEO & CO-FOUNDER",
    description: [
      "Max Valente is a hospitality industry expert with over 30 years of experience in hotel management and strategic consulting. His career is characterized by a deep understanding of operational dynamics and a passion for innovation, enabling him to develop tailored solutions for each client.",
      "Throughout his career, Max has collaborated with a wide range of hospitality establishments, offering services from strategic consulting to temporary management, always with the goal of improving operational performance and guest satisfaction.",
      "His philosophy is based on empathy and building strong relationships with clients, firmly believing that open dialogue and mutual exchange of ideas are the foundation of every successful creation.",
    ],
    imagePath: "/landing-page/about-us/1) Max Valente.jpg",
    quote: "True luxury in hospitality: the art of welcoming and nourishing the soul.",
  },
  {
    name: "Carlo Prudentino",
    role: "ASSET MANAGEMENT",
    description: [
      "Real Estate Finance Expert with 10 years of experience in Fundraising and Financial Structuring of Complex Real Estate Transactions",
      "Throughout my career, I have built a wide network of institutional and professional investors and have also focused on structuring complex financial instruments for real estate transactions across Europe, with a particular focus on Italy and Switzerland.",
      "I have collaborated with investors and financial institutions to create tailored solutions that optimize investment returns while managing the risks associated with specific real estate markets.",
      "Additionally, I have developed expertise in the origination of real estate transactions, identifying and evaluating investment opportunities, and guiding projects from the initial phase to completion. My approach is always geared towards efficiency and financial sustainability.",
      "My passion for the real estate drives me to continuously deepen my understanding of market dynamics and explore innovative solutions to ensure the success of transactions.",
      "Core Competencies:",
      "• Fundraising and management of real estate transactions",
      "• Structuring of complex financial instruments",
      "• Origination and evaluation of real estate opportunities in Europe and Switzerland",
      "• Focus on the Italian market",
      "• Advanced financial analysis and risk management",
    ],
    imagePath: "/landing-page/about-us/prudentino.jpg",
  },
  {
    name: "Guido Castellini",
    role: "HEAD OF FINANCIAL ANALYSIS",
    description: [
      "Guido Castellini is a highly qualified professional with over twenty years of experience in the hospitality sector, specializing in analyzing numbers and performance of hotel structures, with the aim of optimizing their profitability and strategic positioning.",
      "Castellini stands out for his ability to transform data and financial analysis into successful operational strategies. He has developed solid expertise in evaluating feasibility studies, business planning, and management models for luxury hotel structures, collaborating with investors and operators to maximize return on investment.",
      "In his professional journey, he has held significant roles where he has led complex projects, combining deep market knowledge with rigorous economic and financial analysis. His ability to interpret numbers and translate them into strategic plans makes him a privileged interlocutor for investors, asset managers, and property owners.",
      "Castellini is also a reference point in management training for the sector, collaborating with major Italian Masters in Hospitality & Tourism Management and with the Italian Institute of Real Estate Valuation (ISIVI). His courses delve into topics such as hotel investments, performance evaluation, and strategic planning.",
    ],
    imagePath: "/landing-page/about-us/3 Guido Castellini.jpg",
  },
  {
    name: "Barnaba di Cugno Costa",
    role: "HEAD OF DEVELOPMENT",
    description: [
      "A manager with proven experience in Corporate Operations Management and General Management of luxury tourist accommodations, specializing in managing 4 and 5-star hotels. Over more than ten years of career, he has consolidated a solid track record in strategic planning, optimization of operational processes, and enhancement of company assets, contributing to improving management efficiency and profitability.",
      "Barnaba has held leadership positions in some of the most prestigious realities of the hotel sector, including Lindeberg (5 Stars) and Hosteda (4 Stars Luxury), where he successfully led multidisciplinary teams, implementing innovative strategies to ensure excellence standards in hospitality. His experience also extends to managing relationships with high-profile stakeholders, quality control, and development of new market opportunities.",
      "In the Mr. Investar project, Barnaba plays a crucial role, dealing with the selection and development of investment opportunities, with a focus on evaluating and implementing high-potential initiatives in the real estate and hotel sector. His strategic vision and attention to detail make him a fundamental asset for the success and growth of the project.",
    ],
    imagePath: "/landing-page/about-us/4 Barnaba di Cugno Costa.jpg",
  },
  {
    name: "Andrea Chiappini",
    role: "BUSINESS PARTNER",
    description: [
      <>Andrea Chiappini is a partner and founder of <a href="https://ivhgroup.it/" target="_blank" rel="noopener noreferrer" className="text-[#37B6B6] hover:underline">IVH Group S.p.A.</a>, a company established in 2014 with the aim of enhancing hotel assets. For over 10 years, he has been engaged in the hotel sector, of which he has deep knowledge in all its dynamics.</>,
      "His experience includes:",
      "• Direct knowledge of hotel structures, management, and ownership",
      "• Understanding of commercial and distribution logistics of facilities",
      "• Expertise in restructuring and procurement logistics",
      "• Familiarity with the main technological and IT systems in the sector",
      "Andrea has consistently participated in major industry trade shows and has been involved multiple times as a testimonial and speaker. Before entering the hotel sector, he gained extensive experience in his family business, which has been active in extra virgin olive oil production since the early 1900s.",
    ],
    imagePath: "/landing-page/about-us/2 Andrea Chiappini.jpg",
    quote: "Give more than you receive. The UNIVERSE's account never makes mistakes.",
  },
  {
    name: "Valerio Maggi",
    role: "IT MANAGER",
    description: [
      "Valerio Maggi is an entrepreneur and innovator with deep expertise in technologies applied to the world of tourism and business. Founder and CEO of Tecnonews, a leading company in the development of management systems, software, and iOS and Android applications, Valerio has distinguished himself for his ability to accompany companies and startups in the path of digitalization and optimization of business processes.",
      "Thanks to a highly strategic approach, he positions himself as a reference partner for innovative startups and SMEs, supporting them in building customized technological infrastructures, designed to accelerate growth and improve operational efficiency. The company mission is clear: provide consulting and advanced technological tools, carefully selecting partners to ensure personalized and high-quality solutions, building lasting and satisfying collaboration relationships for all parties involved.",
      "With solid experience in the sector, Valerio Maggi has developed an innovative vision that combines technology, business strategies, and customer centricity. His leadership is based on a result-oriented philosophy, which aims to create added value for clients through targeted digitalization and adoption of the best available technologies.",
    ],
    imagePath: "/landing-page/about-us/6 Valerio Maggi.jpg",
  },
  {
    name: "Giorgio Ghiselli",
    role: "PROJECT MANAGEMENT DIRECTOR",
    description: [
      "Strategic Management and Project Management Expert for the Luxury Hotel Sector",
      "Giorgio Ghiselli is a high-profile manager with extensive experience in strategic management, project management, and development of luxury hotel structures. Specialized in creating and enhancing 5-star hotels, Giorgio has collaborated with important international design studios to complete complex projects of high architectural and commercial value.",
      "With a consolidated track record, Giorgio excels in coordinating multidisciplinary teams, negotiating with relevant stakeholders, and building strategic partnerships. He has worked with global entities and luxury operators, developing customized projects that combine innovative design with efficient and sustainable operational management.",
      "One of his most recent and successful experiences was the redevelopment and relaunch of Borgo dei Conti, a prestigious 5-star structure in Umbria. In this project, Giorgio demonstrated his ability to guide all phases of development, from initial planning to final delivery, working closely with renowned architecture and interior design studios to ensure excellence in every detail.",
    ],
    imagePath: "/landing-page/about-us/7 Giorgio Ghiselli.jpg",
  },
];

export default function AboutUs() {
  return (
    <LandingLayout>
      {/* Hero Section with Primary Image */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing-page/about-us/section-image.jpg"
            alt="Mr. Investar About Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-white min-h-screen flex flex-col justify-center items-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center">About Us</h1>
            <p className="text-xl md:text-2xl mb-4 text-justify">
              For decades, we have been dedicated to identifying and developing opportunities that make a difference in the hospitality sector. MR INVESTAR was born from the experience of entrepreneurs and professionals who have built solid expertise in the hospitality, financial, and strategic consulting sectors.
            </p>
            <p className="text-xl md:text-2xl text-justify">
              With operational offices in Milan and Pisa, we have a vision that embraces Italy and extends to international markets. Our goal is to provide tailored solutions, helping individuals and companies realize innovative projects in the hotel sector, from managing accommodation facilities to accessing off-market properties.
            </p>
          </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#37B6B6] mb-6">Expertise Meets Innovation</h2>
          <p className="text-xl text-gray-700">
            Our team brings together decades of experience in hospitality, finance, and strategic consulting. Each member contributes unique expertise and insights, working together to identify and develop exceptional opportunities in the Italian hospitality sector. With a commitment to excellence and innovation, we help our partners achieve their investment goals while maintaining the highest standards of service and professionalism.
          </p>
        </div>
      </div>

      {/* Team Members Section */}
      <section>
        {teamMembers.map((member, index) => (
          <div
            key={member.name}
            className={cn(
              "flex flex-col py-16",
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            <div className="w-full md:w-1/2 relative bg-[#E5F5F5] pb-12 md:pb-0">
              <div className="absolute inset-0">
                <Image
                  src={member.imagePath}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
              <div className="relative aspect-[4/3]" />
            </div>
            <div className="w-full md:w-1/2">
              <div className="h-full px-4 md:px-12 pt-8 md:pt-0">
                <h2 className="text-3xl font-bold mb-2 text-[#37B6B6]">{member.name}</h2>
                <h3 className="text-xl text-gray-600 mb-6">{member.role}</h3>
                {member.description.map((paragraph, i) => (
                  <p key={i} className="text-gray-700 mb-4">
                    {paragraph}
                  </p>
                ))}
                {member.quote && (
                  <blockquote className="text-xl italic text-[#37B6B6] mt-4">
                    &quot;{member.quote}&quot;
                  </blockquote>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </LandingLayout>
  );
}
