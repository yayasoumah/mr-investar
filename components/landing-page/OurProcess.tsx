import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const brandLogos = [
  {
    src: "/landing-page/brand/Logo MARRIOTT.png",
    alt: "Marriott",
    className: "w-16 md:w-20"
  },
  {
    src: "/landing-page/brand/Logo Radisson COllections.png",
    alt: "Radisson Collections",
    className: "w-16 md:w-20"
  },
  {
    src: "/landing-page/brand/Logo HILTON.png",
    alt: "Hilton",
    className: "w-12 md:w-16"
  },
  {
    src: "/landing-page/brand/Logo Relais & Chateux.png",
    alt: "Relais & Chateaux",
    className: "w-10 md:w-14"
  },
  {
    src: "/landing-page/brand/Autograph COllection.png",
    alt: "Autograph Collection",
    className: "w-16 md:w-20"
  }
];

const steps = [
  {
    id: 1,
    title: "Property Assessment & Due Diligence",
    description: "Whether you're selling, leasing, or developing your property, we begin with a comprehensive feasibility study and due diligence process at our expense.",
    imagePath: "/landing-page/our-process/1 Vendita Affitto Sviluppo.jpeg",
    features: [
      "Comprehensive feasibility studies",
      "Strategic value creation analysis",
      "Project design and planning",
      "Brand positioning",
      "Effective communication strategy"
    ]
  },
  {
    id: 2,
    title: "Feasibility Analysis",
    description: "To ensure swift and effective investments for our partners, we conduct an in-depth feasibility study combined with thorough due diligence.",
    imagePath: "/landing-page/our-process/2 Studio di fattibilità.jpg",
    features: [
      "In-depth market analysis",
      "ROI projections",
      "Risk assessment",
      "Investment metrics evaluation"
    ]
  },
  {
    id: 3,
    title: "Design & Development",
    description: "We help investors visualize the completed project through detailed planning and design, working with leading international hospitality design firms.",
    imagePath: "/landing-page/our-process/3 Progetto Giusto.jpg",
    features: [
      "Concept development",
      "Master planning",
      "Functional zoning",
      "Cost estimation",
      "Partnership with renowned design studios"
    ]
  },
  {
    id: 4,
    title: "Brand Selection & Positioning",
    description: "Our expertise helps determine the optimal positioning for your property, ensuring perfect alignment between the property and its intended market.",
    imagePath: "/landing-page/our-process/4 Brand Selection.jpg",
    hasLogos: true,
    features: [
      "Product type determination",
      "National/International brand partnerships",
      "Brand value assessment",
      "Market positioning strategy"
    ]
  },
  {
    id: 5,
    title: "Media & Communication",
    description: "Through our collaboration with THE DESIGNERS, we showcase properties and entrepreneurs through a professional TV format highlighting unique project aspects.",
    imagePath: "/landing-page/our-process/5 Comunicazione.jpg",
    features: [
      "Property and destination showcase",
      "Owner and investor features",
      "Management team spotlight",
      "Brand storytelling",
      "Partner company highlights"
    ]
  },
  {
    id: 6,
    title: "Renovation & Implementation",
    description: "We address investor concerns about project execution by partnering with qualified companies with proven track records, ensuring reliable renovation across Italy.",
    imagePath: "/landing-page/our-process/6 Riqualificazione.jpg",
    features: [
      "Guaranteed timelines",
      "Cost certainty",
      "Quality assurance",
      "Trusted supplier network"
    ]
  }
];

export function OurProcess() {
  return (
    <section id="our-process" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary mb-4">
            Our Process
          </h2>
          <p className="text-xl text-grey-500 max-w-2xl mx-auto">
            Our proven six-step process ensures successful property development and investment outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group bg-grey-50 hover:bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col"
            >
              <div className="relative h-48">
                <Image
                  src={step.imagePath}
                  alt={step.title}
                  fill
                  className="object-cover"
                />
                {step.hasLogos && (
                  <>
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-4 p-4">
                        {brandLogos.map((logo) => (
                          <div key={logo.alt} className="flex items-center justify-center">
                            <Image
                              src={logo.src}
                              alt={logo.alt}
                              width={100}
                              height={50}
                              className={cn("object-contain filter brightness-0 invert", logo.className)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <span className="text-primary text-lg font-semibold">{step.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-secondary">{step.title}</h3>
                </div>

                <p className="text-grey-500 mb-6">{step.description}</p>

                <ul className="space-y-2">
                  {step.features.map((feature, index) => (
                    <li key={index} className="text-grey-500 flex items-start">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/our-process">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white">
              Learn More About Our Process
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}