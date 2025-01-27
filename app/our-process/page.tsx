"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LandingLayout } from "@/components/landing-page/LandingLayout";

interface ProcessStep {
  title: string;
  description: (string | ReactNode)[];
  imagePath: string;
  hasLogos?: boolean;
}

const processSteps: ProcessStep[] = [
  {
    title: "1) Feasibility & Due Diligence",
    description: [
      "To achieve a quick and effective sale or lease of your property, or to develop its full potential, we conduct comprehensive preliminary assessments at our expense:",
      "• Detailed feasibility studies to create value",
      "• Optimal project design and planning",
      "• Strategic market positioning and brand selection",
      "• Effective communication strategies",
      "Through our thorough pre-feasibility and due diligence process, we determine the property's fair market value and potential.",
    ],
    imagePath: "/landing-page/our-process/1 Vendita Affitto Sviluppo.jpeg",
  },
  {
    title: "2) Value Creation Through Feasibility Studies",
    description: [
      "To ensure swift and effective investments for our partners, we conduct comprehensive feasibility studies coupled with thorough due diligence. This process helps us precisely determine the potential return on investment for each real estate asset.",
      "Our feasibility studies quantify the initiative's potential returns, making it easier to sell or lease the property at appropriate market values.",
      "We focus on being rapid and effective in ensuring good investments for our partners through detailed feasibility studies and due diligence, precisely determining the return on real estate assets.",
      <>View our example feasibility study at: <a href="https://www.investar.fund/asset/pitch/pitch-torre-guaceto-resort.pdf" target="_blank" rel="noopener noreferrer" className="text-[#37B6B6] hover:underline">www.investar.fund/asset/pitch/pitch-torre-guaceto-resort.pdf</a></>,
    ],
    imagePath: "/landing-page/our-process/2 Studio di fattibilità.jpg",
  },
  {
    title: "3) Optimal Design & Planning",
    description: [
      "It's crucial to help buyers visualize the completed structure and answer key questions:",
      "• Does it meet their expectations?",
      "• Is it functional for their intended use?",
      "We address these questions through the creation of:",
      "• Detailed concepts",
      "• Comprehensive master plans",
      "• Strategic zoning plans",
      "These elements are fundamental in understanding how the structure will be realized and its implementation costs.",
      <>We partner with leading international design firms with proven experience in hospitality facilities. View our principal design partners at: <a href="https://www.thedesigners.it/designer-2" target="_blank" rel="noopener noreferrer" className="text-[#37B6B6] hover:underline">www.thedesigners.it/designer-2</a></>,
    ],
    imagePath: "/landing-page/our-process/3 Progetto Giusto.jpg",
  },
  {
    title: "4) Strategic Brand Selection",
    description: [
      "To achieve our objectives, we focus on key considerations:",
      "• What type of product will best satisfy our buyer's needs?",
      "• Which national or international brands would be interested in this property?",
      "• What added value can a brand bring to the property?",
      "• What category should we target - four-star, five-star luxury, classic, or modern?",
      "Our extensive experience enables us to address these crucial questions, making a significant difference for all stakeholders involved.",
    ],
    imagePath: "/landing-page/our-process/4 Brand Selection.jpg",
    hasLogos: true
  },
  {
    title: "5) The Designers TV Format",
    description: [
      "In collaboration with THE DESIGNERS, we tell the stories of entrepreneurs and destinations through a TV format series, with each episode running 52 minutes. This unique approach highlights:",
      "• Destination and Real Estate Assets",
      "• Property Owner and/or Buyer",
      "• Management Team",
      "• Brand Identity",
      "• Partner Companies",
      "• Design Studio",
      "Most importantly, this format ensures appropriate visibility for both sellers and buyers according to their preferences.",
      <>Learn more at: <a href="https://www.thedesigners.it" target="_blank" rel="noopener noreferrer" className="text-[#37B6B6] hover:underline">www.thedesigners.it</a></>,
    ],
    imagePath: "/landing-page/our-process/5 Comunicazione.jpg",
  },
  {
    title: "6) Property Enhancement & Partner Network",
    description: [
      "One of the main concerns for investors is project execution. We address this by partnering with qualified companies with proven track records to ensure two fundamental aspects: guaranteed timelines and costs.",
      <>For over 10 years, we&apos;ve been collaborating with <a href="https://ivhgroup.it/" target="_blank" rel="noopener noreferrer" className="text-[#37B6B6] hover:underline">IVH Group S.p.A.</a> for hotel renovation and redevelopment projects across Italy.</>,
      "The selection of suppliers (Partner Companies) capable of supporting the initiative is crucial for success.",
      <>View our example projects at: <a href="https://www.lagemmahotel.com" target="_blank" rel="noopener noreferrer" className="text-[#37B6B6] hover:underline">www.lagemmahotel.com</a></>,
    ],
    imagePath: "/landing-page/our-process/6 Riqualificazione.jpg",
  },
  {
    title: "7) Innovative Hotel Management",
    description: [
      "MR. INVESTAR adopts an innovative business model focused on excellence and guest care, distinguished by our ability to select Italy's finest hotel management companies as strategic partners for each property's success.",
      "Our dynamic approach combines centralized management of strategic activities with locally-focused operational excellence. Specialized activities such as operational and commercial management, communications, administration, finance, management control, purchasing, maintenance, and staff selection are coordinated from our headquarters.",
      "At individual properties, the focus is entirely on service quality, with hotel directors dedicated exclusively to guest experience, ensuring highest-level hospitality.",
      "Through careful partner selection and synergy between central expertise and local operations, MR. INVESTAR optimizes quality standards for each property, promoting growth and success. This organizational model not only maximizes partnership value but also consolidates our leadership position in Italy's luxury hospitality sector.",
      "With an excellence-oriented approach, we aim to create unique and memorable experiences for every guest, transforming each stay into an unforgettable moment.",
    ],
    imagePath: "/landing-page/our-process/7 Gestione Alberghiera.jpg",
  },
  {
    title: "8) Strategic Industrial Partnerships",
    description: [
      "MR. INVESTAR's unique business model is based on selecting the best industrial partner for each initiative. Our strategy focuses on collaborating with excellence-driven organizations that provide high-level operational and technological support while actively participating as investors.",
      "For each project, we identify industrial partners who bring distinctive competencies and innovative solutions, creating strategic synergies that strengthen the initiative. These partners not only guarantee technological and managerial excellence but also choose to invest directly in projects, aligning their interests with those of MR. INVESTAR and other stakeholders.",
      "Through this model, MR. INVESTAR creates a virtuous ecosystem where partners' expertise, resources, and commitment unite to achieve ambitious goals. Each initiative is supported by a solid structure, oriented towards long-term success, ensuring concrete results and added value for all parties involved.",
      "This strategic selection and collaboration process represents one of the pillars of our approach, strengthening our ability to create successful opportunities in the real estate and hospitality sector, with a constant focus on innovation and excellence.",
    ],
    imagePath: "/landing-page/our-process/8 Partner Industriale.jpg",
  },
  {
    title: "9) Investment & Network Fundraising",
    description: [
      "We already know who can best purchase, lease, or manage the property, ensuring a strategic and success-oriented approach. Through our Entrepreneur Network and selection of the best companies in the real estate and hotel sectors, we can present properties to the right stakeholders, identifying qualified partners and high-profile operators for each project.",
      "Our 'opportunity showcase' is connected to highly specialized platforms for real estate capital raising and strategic asset management. Through an established network of contacts and institutional relationships, we provide comprehensive support in fundraising activities, identifying the best financial solutions to accelerate project development and growth.",
      "With a structured, results-oriented approach, we position ourselves as strategic partners for buyers, investors, and management companies, facilitating goal achievement through a unique combination of experience, financial expertise, and established relationships.",
      "To achieve desired results, we consider it essential to present ourselves to buyers and/or investors with all credentials in order, ensuring transparency, project solidity, and accurate resource management. Our ability to build trust and attract capital allows us to create value for all parties involved, promoting a sustainable and innovative development model.",
    ],
    imagePath: "/landing-page/our-process/9 Fundraising.jpg",
  },
];

const brandLogos = [
  {
    src: "/landing-page/brand/Logo MARRIOTT.png",
    alt: "Marriott",
    className: "w-32 md:w-40"
  },
  {
    src: "/landing-page/brand/Logo Radisson COllections.png",
    alt: "Radisson Collections",
    className: "w-32 md:w-40"
  },
  {
    src: "/landing-page/brand/Logo HILTON.png",
    alt: "Hilton",
    className: "w-24 md:w-32"
  },
  {
    src: "/landing-page/brand/Logo Relais & Chateux.png",
    alt: "Relais & Chateaux",
    className: "w-20 md:w-28"
  },
  {
    src: "/landing-page/brand/Autograph COllection.png",
    alt: "Autograph Collection",
    className: "w-32 md:w-40"
  }
];

export default function OurProcess() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing-page/our-process/our-process-primary.jpg"
            alt="Mr. Investar Our Process"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-white min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center">Our Process</h1>
          <p className="text-xl md:text-2xl text-justify max-w-4xl">
            At Mr. Investar, we&apos;ve developed a comprehensive process that ensures every investment opportunity in the hospitality sector is thoroughly evaluated, developed, and managed.
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#37B6B6] mb-6">Creating Value at Every Step</h2>
          <p className="text-xl text-gray-700">
            Our systematic approach combines industry expertise with innovative solutions, guiding projects from initial concept to successful operation. Each step is carefully designed to maximize value and ensure sustainable growth in the hospitality sector.
          </p>
        </div>
      </div>

      {/* Process Steps Section */}
      <section className="py-20">
        {processSteps.map((step, index) => (
          <div
            key={step.title}
            className={cn(
              "flex flex-col py-12",
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            <div className="w-full md:w-1/2 relative bg-[#E5F5F5] pb-12 md:pb-0">
              <div className="absolute inset-0">
                <Image
                  src={step.imagePath}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                {step.hasLogos && (
                  <>
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 p-8 max-w-6xl mx-auto">
                        {brandLogos.map((logo) => (
                          <div key={logo.alt} className="flex items-center justify-center">
                            <Image
                              src={logo.src}
                              alt={logo.alt}
                              width={200}
                              height={100}
                              className={cn("object-contain filter brightness-0 invert", logo.className)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="relative aspect-[4/3]" />
            </div>
            <div className="w-full md:w-1/2">
              <div className="h-full px-4 md:px-12 pt-8 md:pt-0">
                <h2 className="text-3xl font-bold mb-6 text-[#37B6B6]">{step.title}</h2>
                {step.description.map((paragraph, i) => (
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
