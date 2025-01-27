"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { LandingLayout } from "@/components/landing-page/LandingLayout";

interface BrandSection {
  title: string;
  subtitle?: string;
  description: string[];
  imagePath: string;
  hasLogos?: boolean;
}

const brandSections: BrandSection[] = [
  {
    title: "Brand Selection",
    description: [
      "To achieve maximum success for each initiative, it's essential to start with key questions:",
      "• What type of product should be developed to best meet the buyer's needs?",
      "• Which National or International Brand represents the best strategic partner to enhance that specific real estate structure?",
      "• What added value can a brand bring to the property in terms of recognition, attractiveness, and market positioning?",
      "• What is the ideal concept for the project: a Four or Five Star Luxury hotel? With Classic or Modern design?",
      "Thanks to MR. INVESTAR's consolidated experience, we don't just answer these questions, but offer in-depth analysis and targeted consulting to select the most suitable brand for each initiative. This choice is never casual: it is based on a strategic evaluation that takes into account factors such as the type of structure, target market, customer profile, and long-term project objectives.",
      "Our approach stands out for its ability to build solid and advantageous partnerships with nationally and internationally renowned brands, ensuring that each initiative can benefit from the strength of a prestigious brand. This not only enhances the property but also ensures a distinctive market positioning, increasing the competitiveness and success of the entire project.",
      "With our expertise and network, MR. INVESTAR can identify and integrate the ideal partner, creating synergies that make a difference for all stakeholders involved. Every decision is guided by our mission: to create excellence projects that combine innovation, quality, and strong brand identity."
    ],
    imagePath: "/landing-page/brand/1) Posizionamento.jpg",
    hasLogos: true
  },
  {
    title: "Marriott",
    subtitle: "Autograph Collection",
    description: [
      "Autograph Collection is a Marriott International brand that brings together a selection of high-end and luxury independent hotels, each characterized by a unique and distinctive personality.",
      "Launched in 2010, the brand includes over 240 hotels in 41 countries, offering authentic and tailored experiences for travelers seeking memorable stays.",
      "Autograph Collection hotels maintain their individual identity while benefiting from Marriott's global network and the Marriott Bonvoy loyalty program. Each property is carefully selected for its unique character, distinctive design, and ability to deliver an experience that leaves a lasting impression on guests.",
      "In Italy, Autograph Collection includes hotels such as the Grand Universe Lucca, which combines historic elegance with modern comforts, and the Argentario Golf & Wellness Resort in Tuscany, offering designer rooms and luxury suites with panoramic views.",
      "The brand's philosophy is summed up in the motto 'Exactly like nothing else', emphasizing the commitment to providing unique and personalized experiences that reflect the essence of their location."
    ],
    imagePath: "/landing-page/brand/2) Autograph Collection.jpg"
  },
  {
    title: "Hilton",
    subtitle: "Curio Collection",
    description: [
      "Curio Collection by Hilton is an upscale hotel brand within the Hilton Worldwide portfolio. Launched in 2014, the brand brings together a selection of independent hotels and resorts, each with a unique identity and strong connection to its destination.",
      "Hotels in the Curio Collection maintain their individuality while benefiting from Hilton's support and resources, including booking systems and the Hilton Honors loyalty program. This approach allows guests to experience authentic and personalized stays, with the added value of quality and reliability associated with the Hilton name.",
      "In Italy, Curio Collection by Hilton includes properties such as the Aleph Rome Hotel, located in the heart of Rome, offering a luxury experience with modern amenities in a historic setting.",
      "The brand's philosophy focuses on selecting hotels that offer distinctive experiences, allowing guests to immerse themselves in local peculiarities and enjoy memorable stays in some of the world's most sought-after destinations."
    ],
    imagePath: "/landing-page/brand/3) Curio.jpg"
  },
  {
    title: "Relais & Châteaux",
    description: [
      "Relais & Châteaux is an international association founded in France in 1954 by Marcel and Nelly Tilloy, bringing together over 580 luxury hotels and restaurants in more than 60 countries.",
      "Affiliated properties are often historic residences, such as castles and manors, offering refined hospitality and culinary excellence. The association distinguishes itself through its rigorous admission criteria, based on the motto of the 'five Cs': Character, Courtesy, Calm, Charm, and Cuisine.",
      "This ensures that each member offers a unique experience, rooted in culture and tradition, while maintaining the highest standards of luxury hospitality."
    ],
    imagePath: "/landing-page/brand/4) Relais & Chateaux.jpg"
  },
  {
    title: "Radisson",
    subtitle: "Radisson Collection",
    description: [
      "Radisson Collection represents the premium lifestyle and affordable luxury segment of Radisson Hotel Group. This exceptional collection of hotels is uniquely positioned in prestigious locations, offering guests authentic local experiences.",
      "Each Radisson Collection hotel is a reflection of its location, combining exceptional hospitality with local influence in design, amenities, and service. The brand focuses on creating unique properties that maintain high standards while celebrating their individual character.",
      "The collection includes both historic landmarks and contemporary properties, each offering a distinct experience that embodies the spirit of their location while maintaining the exceptional service standards Radisson is known for."
    ],
    imagePath: "/landing-page/brand/5) Radisson Collection.jpg"
  }
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

export default function Brand() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing-page/brand/primary-image.jpg"
            alt="Mr. Investar Brand"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-white min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-center">Brand Selection</h1>
          <p className="text-xl md:text-2xl text-justify max-w-4xl">
            We partner with the world&apos;s most prestigious hospitality brands to create exceptional value for our properties and deliver unforgettable experiences for guests.
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#37B6B6] mb-6">Strategic Brand Partnerships</h2>
          <p className="text-xl text-gray-700">
            Our strategic approach to brand selection ensures each property achieves its full potential. We carefully evaluate market dynamics, property characteristics, and target demographics to identify the perfect brand partnership that will maximize value and create lasting success.
          </p>
        </div>
      </div>

      {/* Brand Sections */}
      <section className="py-20">
        {brandSections.map((section, index) => (
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
                {section.hasLogos && (
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
                <h2 className="text-3xl font-bold mb-2 text-[#37B6B6]">{section.title}</h2>
                {section.subtitle && (
                  <h3 className="text-2xl text-gray-600 mb-6">{section.subtitle}</h3>
                )}
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
