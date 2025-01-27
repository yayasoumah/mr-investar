"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  imagePath: string;
  quote: string;
  descriptionLink?: {
    text: string;
    url: string;
  };
  descriptionContinuation?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Max Valente",
    role: "CEO & CO-FOUNDER",
    description: "Max Valente is a hospitality industry expert with over 30 years of experience in hotel management and strategic consulting. His career is characterized by a deep understanding of operational dynamics and a passion for innovation, enabling him to develop tailored solutions for each client.",
    imagePath: "/landing-page/about-us/1) Max Valente.jpg",
    quote: "True luxury in hospitality: the art of welcoming and nourishing the soul.",
  },
  {
    name: "Andrea Chiappini",
    role: "PARTNER",
    description: "Andrea Chiappini is a partner and founder of ",
    descriptionLink: {
      text: "IVH Group S.p.A.",
      url: "https://ivhgroup.it/",
    },
    descriptionContinuation: ", a company established in 2014 with the aim of enhancing hotel assets. For over 10 years, he has been engaged in the hotel sector, of which he has deep knowledge in all its dynamics.",
    imagePath: "/landing-page/about-us/2 Andrea Chiappini.jpg",
    quote: "Give more than you receive. The UNIVERSE's account never makes mistakes.",
  },
];

export function TeamPreview() {
  return (
    <section className="py-20 bg-[#E5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#37B6B6] mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-700">
            Led by industry experts with decades of experience in hospitality and investment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-80">
                <Image
                  src={member.imagePath}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-[#37B6B6] font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 mb-6">
                  {member.description}
                  {member.descriptionLink && (
                    <a 
                      href={member.descriptionLink.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#37B6B6] hover:underline"
                    >
                      {member.descriptionLink.text}
                    </a>
                  )}
                  {member.descriptionContinuation}
                </p>
                <blockquote className="italic text-gray-700 border-l-4 border-[#37B6B6] pl-4 mb-6">
                  &ldquo;{member.quote}&rdquo;
                </blockquote>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/about-us">
            <Button
              variant="outline"
              className="text-[#37B6B6] border-[#37B6B6] hover:bg-[#37B6B6] hover:text-white"
            >
              Meet the Full Team
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
